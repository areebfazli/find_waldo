import os
import pytest
from fastapi.testclient import TestClient
from main import app

pytestmark = pytest.mark.asyncio


client = TestClient(app)

def test_homepage():
    res = client.get("/")
    assert res.status_code == 200
    body = res.json()
    assert "message" in body
    assert "routes" in body

def test_structured_search():
    # Insert test doc first
    from db import collection
    test_doc = {"first_name": "Alice", "last_name": "Smith", "company": "OpenAI", "position": "Engineer"}
    inserted_id = collection.insert_one(test_doc).inserted_id

    res = client.get("/search", params={"company": "OpenAI"})
    assert res.status_code == 200
    body = res.json()
    assert "results" in body
    assert any(doc["company"] == "OpenAI" for doc in body["results"])

    # cleanup
    collection.delete_one({"_id": inserted_id})

@pytest.mark.asyncio
async def test_natural_language_search(monkeypatch):
    """
    Mock OpenAI so we don’t actually call the API during tests.
    """

    # Mocked OpenAI response
    class DummyResponse:
        def __getitem__(self, key):
            return {
                "choices": [{"message": {"content": '{"company": "OpenAI"}'}}]
            }[key]

    async def dummy_acreate(*args, **kwargs):
        return DummyResponse()

    import routes.search as search_module
    monkeypatch.setattr(search_module.openai.ChatCompletion, "acreate", dummy_acreate)

    # Insert test doc
    from db import collection
    test_doc = {"first_name": "Bob", "last_name": "Jones", "company": "OpenAI", "position": "Scientist"}
    inserted_id = collection.insert_one(test_doc).inserted_id

    res = client.post("/search", json={"prompt": "Find people at OpenAI", "limit": 5})
    assert res.status_code == 200
    body = res.json()
    assert "results" in body
    assert any(doc["company"] == "OpenAI" for doc in body["results"])

    # cleanup
    collection.delete_one({"_id": inserted_id})
