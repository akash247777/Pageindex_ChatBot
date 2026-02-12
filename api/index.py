from fastapi import FastAPI, Request
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import google.generativeai as genai
import os
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
# Extract DB name from URI or use 'test' as default from your .env
DB_NAME = "test" 
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Gemini Config
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

class ChatRequest(BaseModel):
    message: str
    userId: str
    sessionId: str

def resolve_relevant_nodes(query: str):
    q = query.lower().replace(" ", "")
    # Ported from index.navigator.js
    if any(word in q for word in ["profile", "company", "gst", "pan", "address", "pickup", "drop", "brand"]):
        return ["client.profile"]
    if "driver" in q:
        return ["trips.assigned", "trips.drivers"]
    if any(word in q for word in ["wallet", "balance"]):
        return ["client.user"]
    if any(word in q for word in ["chat", "history", "previous"]):
        return ["support.chat"]
    return ["client.user"]

from fastapi.responses import HTMLResponse

@app.get("/api/status")
async def status():
    return {"message": "FastAPI API for Mobile Bot is active"}

from bson import ObjectId

def to_oid(id_str):
    try:
        return ObjectId(id_str) if len(id_str) == 24 else id_str
    except:
        return id_str

@app.post("/api/chat")
async def chat(req: ChatRequest):
    nodes = resolve_relevant_nodes(req.message)
    
    context = {}
    oid = to_oid(req.userId)

    # Basic Context Builder (Sync logic with tree.definition.js)
    for node in nodes:
        if node == "client.user":
            data = await db.users.find_one({"_id": oid})
            if data: data["_id"] = str(data["_id"])
            context[node] = data if data else {}
        
        elif node == "client.profile":
            # In your tree.definition, client.profile queryKey is "user"
            data = await db.clientprofiles.find_one({"user": oid})
            if data: 
                data["_id"] = str(data["_id"])
                if "user" in data: data["user"] = str(data["user"])
            context[node] = data if data else {}

    # Build Prompt
    prompt = f"""
    You are an AI Client Support Assistant for "PageIndex".
    Your goal is to provide accurate, helpful, and concise answers to clients regarding their profile, account, drivers, and company information.
    
    DATA (JSON):
    {json.dumps(context, indent=2, default=str)}
    
    USER QUESTION:
    "{req.message}"
    
    GUIDELINES:
    - If the DATA contains user info like 'name', use it to be personalized.
    - If the DATA is empty or does not contain the answer, politely tell the client you don't have that information.
    - Never hallucinate data. Only use what is provided.
    - Be concise and clear.
    """
    
    try:
        # Use a stable model version
        actual_model = genai.GenerativeModel('gemini-1.5-flash')
        response = actual_model.generate_content(prompt)
        reply = response.text
    except Exception as e:
        reply = f"I'm sorry, I encountered an error: {str(e)}"

    # Save to history
    await db.ClientChats.insert_one({
        "sessionId": req.sessionId,
        "user": req.userId,
        "role": "assistant",
        "message": reply,
        "timestamp": datetime.utcnow()
    })

    return {"reply": reply, "nodes": nodes}

# Vercel needs the app object
# Optional: Handler for Vercel
# from mangum import Mangum
# handler = Mangum(app)
