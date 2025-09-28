import pandas as pd
from pymongo import MongoClient, UpdateOne
from datetime import datetime
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

# Current uploader details (the connection owner)
# connection_owner = {
#     "full_name": "Areeb Abad Fazli",
#     "linkedin_url": "https://linkedin.com/in/areebfazli"
# }

connection_owner = {
    "full_name": "Jorge Campo Teruel",
    "linkedin_url": "https://www.linkedin.com/in/jorgecampoteruel/"
}

# Load CSV
df = pd.read_csv("data/jorge_connections.csv")

# Bulk operations
operations = []
for _, row in df.iterrows():
    base_doc = {
        "first_name": row["First Name"],
        "last_name": row["Last Name"],
        "full_name": f"{row['First Name']} {row['Last Name']}",
        "linkedin_url": row["URL"],        # unique identifier
        "company": row["Company"],
        "position": row["Position"],
        "created_at": datetime.utcnow()
    }

    operations.append(
        UpdateOne(
            {"linkedin_url": row["URL"]},  # check uniqueness
            {
                "$setOnInsert": base_doc,
                "$addToSet": {"connections_of": connection_owner}
            },
            upsert=True
        )
    )

# Apply bulk write
if operations:
    result = collection.bulk_write(operations)
    print(f"✅ Inserted {result.upserted_count}, updated {result.modified_count}")
