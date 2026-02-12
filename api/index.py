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
model = genai.GenerativeModel('gemini-1.5-flash')

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

@app.get("/", response_class=HTMLResponse)
async def root():
    # Load and serve the index.html from the public folder
    # We use a path relative to this file to ensure it works on Vercel
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    index_path = os.path.join(project_root, "public", "index.html")
    
    try:
        with open(index_path, "r", encoding="utf-8") as f:
            content = f.read()
        return HTMLResponse(content=content)
    except FileNotFoundError:
        return HTMLResponse(content=f"<h1>Frontend Not Found</h1><p>Search path: {index_path}</p>", status_code=404)

@app.post("/api/chat")
async def chat(req: ChatRequest):
    nodes = resolve_relevant_nodes(req.message)
    
    context = {}
    # Basic Context Builder (Simplified for example, can be expanded)
    for node in nodes:
        if node == "client.user":
            data = await db.users.find_one({"_id": req.userId})
            if data: data["_id"] = str(data["_id"])
            context[node] = data if data else {}
        
        elif node == "client.profile":
            data = await db.clientprofiles.find_one({"user": req.userId})
            if data: data["_id"] = str(data["_id"])
            context[node] = data if data else {}

    # Build Prompt
    prompt = f"""
    You are an AI Client Support Assistant for "PageIndex".
    SCHEMA: clientprofiles (company info), users (wallet/profile), assignevheicles (trips), driverdetails.
    
    DATA (JSON):
    {json.dumps(context, indent=2, default=str)}
    
    USER QUESTION:
    "{req.message}"
    
    Answer concisely.
    """
    
    try:
        response = model.generate_content(prompt)
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
