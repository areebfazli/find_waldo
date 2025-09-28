from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
uri = os.getenv("MONGODB_URI")
if not uri:
    raise ValueError("❌ MONGODB_URI not found in .env")

# Connect to MongoDB
client = MongoClient(uri)
db = client["mydb"]
collection = db["people"]

# FastAPI app
app = FastAPI()

# CORS (can adjust later for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
def search_people(
    first_name: str | None = Query(None),
    last_name: str | None = Query(None),
    company: str | None = Query(None),
    position: str | None = Query(None),
    connection_name: str | None = Query(None),
    connection_url: str | None = Query(None),
    limit: int = Query(20, le=100),
):
    query = {}

    

    if first_name:
        query["first_name"] = {"$regex": f"^{first_name}", "$options": "i"}
    if last_name:
        query["last_name"] = {"$regex": f"^{last_name}", "$options": "i"}
    if company:
        query["company"] = {"$regex": company, "$options": "i"}
    if position:
        query["position"] = {"$regex": position, "$options": "i"}

    if connection_name or connection_url:
        conn_filter = {}
        if connection_name:
            conn_filter["connections_of.name"] = {"$regex": connection_name, "$options": "i"}
        if connection_url:
            conn_filter["connections_of.linkedin_url"] = connection_url
        query.update(conn_filter)

    results = list(collection.find(query).limit(limit))

    # Convert ObjectId to string
    for r in results:
        r["_id"] = str(r["_id"])
    return {"results": results}
