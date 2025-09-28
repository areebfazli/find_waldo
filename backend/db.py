# db.py
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in .env")

# Ensure TLS CA file is provided (prevents SSL handshake issues)
client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
db = client["mydb"]
collection = db["people"]
