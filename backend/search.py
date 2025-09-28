from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
uri = os.getenv("MONGODB_URI")
if not uri:
    raise ValueError("❌ MONGODB_URI not found in .env")

client = MongoClient(uri)
db = client["mydb"]
collection = db["people"]

def search_people(first_name=None, last_name=None, company=None, position=None, connection_name=None, connection_url=None, limit=20):
    """
    Search people with optional filters using regex.
    """
    query = {}

    # Regex filters
    if first_name:
        query["first_name"] = {"$regex": f"^{first_name}", "$options": "i"}  # case-insensitive
    if last_name:
        query["last_name"] = {"$regex": f"^{last_name}", "$options": "i"}
    if company:
        query["company"] = {"$regex": company, "$options": "i"}
    if position:
        query["position"] = {"$regex": position, "$options": "i"}

    # Filter by connections_of
    if connection_name or connection_url:
        conn_filter = {}
        if connection_name:
            conn_filter["connections_of.name"] = {"$regex": connection_name, "$options": "i"}
        if connection_url:
            conn_filter["connections_of.linkedin_url"] = connection_url
        query.update(conn_filter)

    # Execute query
    results = list(collection.find(query).limit(limit))
    return results

if __name__ == "__main__":
    query = input("Query: ")
    results = search_people(query)
    print(results)

    # # Search by last name
    # for p in search_people(last_name="Johnson"):
    #     print(p["full_name"], "-", p["company"])
