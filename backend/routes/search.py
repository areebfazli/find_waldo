# routes/search.py
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from db import collection
import os, json, traceback
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("❌ OPENAI_API_KEY not found in .env")

client = OpenAI(api_key=OPENAI_API_KEY)

router = APIRouter()

# ----- Request model for NL search -----
class PromptRequest(BaseModel):
    prompt: str
    limit: int = 20

from datetime import datetime

def serialize_results(results):
    """Convert non-JSON-serializable fields (like datetime) to strings for OpenAI."""
    serialized = []
    for r in results:
        r_copy = r.copy()
        for k, v in r_copy.items():
            if isinstance(v, datetime):
                r_copy[k] = str(v)
        serialized.append(r_copy)
    return serialized


# ----- Structured GET search -----
@router.get("/search")
def structured_search(
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
        if connection_name:
            query["connections_of.name"] = {"$regex": connection_name, "$options": "i"}
        if connection_url:
            query["connections_of.linkedin_url"] = connection_url

    results = list(collection.find(query).limit(limit))
    for r in results:
        r["_id"] = str(r["_id"])
    return {"results": results}

# ----- Natural Language POST search -----
@router.post("/search")
def natural_language_search(req: PromptRequest):
    try:
        system_msg = (
            "You are an assistant that converts natural language into a MongoDB query JSON. "
            "Allowed keys: first_name, last_name, company, position. "
            "Respond ONLY with valid JSON without extra text."
        )

        # Call OpenAI to extract query
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": req.prompt}
            ],
            temperature=0
        )

        raw = response.choices[0].message.content.strip()
        if not raw:
            return {"error": "OpenAI returned empty response", "results": []}

        # parse JSON safely
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            start = raw.find("{")
            end = raw.rfind("}") + 1
            if start == -1 or end == -1:
                return {"error": f"Cannot extract JSON from OpenAI response: {raw}"}
            parsed = json.loads(raw[start:end])

        # sanitize allowed keys
        allowed_keys = {"first_name", "last_name", "company", "position"}
        sanitized = {}
        for k, v in parsed.items():
            if k in allowed_keys and v is not None:
                if isinstance(v, list):
                    v = str(v[0])
                sanitized[k] = str(v)

        # build mongo query
        mongo_query = {k: {"$regex": v, "$options": "i"} for k, v in sanitized.items()}
        results = list(collection.find(mongo_query).limit(req.limit))
        for r in results:
            r["_id"] = str(r["_id"])

        # ----- Generate summary safely -----
        safe_results = serialize_results(results)

        if not safe_results:
            text_summary = "No matching results were found for your search."
        else:
            summary_prompt = (
                f"Summarize the following search results in 1-2 sentences. "
                f"Do not include any URLs or links, only use plain text:\n\n"
                f"{json.dumps(safe_results, indent=2)}"
            )
            try:
                summary_resp = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": summary_prompt}
                    ],
                    temperature=0.5
                )
                text_summary = summary_resp.choices[0].message.content.strip()
            except Exception as e:
                text_summary = f"Could not generate summary: {str(e)}"



        return {
            "parsed_fields": sanitized,
            "mongo_query": mongo_query,
            "results": results,
            "summary": text_summary
        }

    except Exception as e:
        print("Error in /search POST:", e)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
