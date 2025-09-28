from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {
        "message": "Welcome to the AI Search API",
        "routes": {
            "structured_search (GET)": "/search?company=OpenAI",
            "natural_language_search (POST)": "/search {\"prompt\":\"...\"}"
        }
    }
