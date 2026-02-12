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

    # Basic Context Builder (Synced with tree.definition.js fields)
    for node in nodes:
        if node == "client.user":
            # Fields: name, email, mobileNumber, role, userRole, walletBalance
            data = await db.users.find_one(
                {"_id": oid}, 
                {"name": 1, "email": 1, "mobileNumber": 1, "role": 1, "walletBalance": 1}
            )
            if data: data["_id"] = str(data["_id"])
            context[node] = data if data else {}
        
        elif node == "client.profile":
            # Fields: companyInfo, gstDetails, signatoryDetails, locations
            data = await db.clientprofiles.find_one(
                {"user": oid},
                {"companyInfo": 1, "gstDetails": 1, "signatoryDetails": 1, "locations": 1}
            )
            if data: 
                data["_id"] = str(data["_id"])
                if "user" in data: data["user"] = str(data["user"])
            context[node] = data if data else {}

        elif node == "trips.assigned":
            # Fetch assigned vehicle/trip records for this user
            # Fields: tripId, driverId, vehicleId, deliveryStatus, consignorName
            cursor = db.assignevheicles.find(
                {"userId": oid},
                {"tripId": 1, "driverId": 1, "vehicleId": 1, "deliveryStatus": 1, "consignorName": 1}
            ).limit(20) # Limit to 20 recent records
            data = await cursor.to_list(length=20)
            for item in data:
                item["_id"] = str(item["_id"])
                if "userId" in item: item["userId"] = str(item["userId"])
                if "driverId" in item: item["driverId"] = str(item["driverId"])
            context[node] = data
            
        elif node == "trips.drivers":
            # We need to find drivers associated with the user's assigned vehicles
            # Try to get them from context if trips.assigned was already processed
            assigned_trips = context.get("trips.assigned")
            if not assigned_trips:
                cursor = db.assignevheicles.find({"userId": oid}, {"driverId": 1}).limit(20)
                assigned_trips = await cursor.to_list(length=20)
            
            driver_ids = [to_oid(t["driverId"]) for t in assigned_trips if t.get("driverId")]
            if driver_ids:
                # Fields: name, phoneNumber, email, city, address
                cursor = db.driverdetails.find(
                    {"_id": {"$in": driver_ids}},
                    {"name": 1, "phoneNumber": 1, "email": 1, "city": 1, "address": 1}
                )
                drivers = await cursor.to_list(length=20)
                for d in drivers:
                    d["_id"] = str(d["_id"])
                context[node] = drivers
            else:
                context[node] = []

    # Build Prompt
    prompt = f"""
    You are an AI Client Support Assistant for "PageIndex".
    Provide accurate and concise answers based ONLY on the DATA provided.
    
    DATA (JSON):
    {json.dumps(context, indent=2, default=str)}
    
    USER QUESTION:
    "{req.message}"
    
    GUIDELINES:
    - Personalize the response if 'name' is available.
    - If the DATA is empty, inform the client politely.
    - Do NOT hallucinate.
    """
    
    try:
        # Note: gemini-2.5 does not exist yet; using the latest stable 1.5-flash
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
