import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_homepage():
    print("Testing GET / ...")
    try:
        res = requests.get(f"{BASE_URL}/")
        print("Status code:", res.status_code)
        print("Response:", json.dumps(res.json(), indent=2))
    except Exception as e:
        print("Error:", e)
    print("-"*50)

def test_structured_search():
    print("Testing GET /search?company=HP ...")
    try:
        params = {"company": "HP", "limit": 5}
        res = requests.get(f"{BASE_URL}/search", params=params)
        print("Status code:", res.status_code)
        print("Response:", json.dumps(res.json(), indent=2))
    except Exception as e:
        print("Error:", e)
    print("-"*50)

def test_natural_language_search(prompts):
    for prompt in prompts:
        print(f"Testing POST /search with prompt: '{prompt}'")
        try:
            payload = {"prompt": prompt, "limit": 5}
            res = requests.post(f"{BASE_URL}/search", json=payload)
            print("Status code:", res.status_code)
            try:
                response_json = res.json()
                print("Response:", json.dumps(response_json, indent=2))
                # Optional: show only results if present
                if "results" in response_json:
                    print(f"Found {len(response_json['results'])} results")
            except json.JSONDecodeError:
                print("Response not JSON:", res.text)
        except Exception as e:
            print("Error:", e)
        print("-"*50)

if __name__ == "__main__":
    test_homepage()
    test_structured_search()
    
    # List of natural language prompts to test real data
    prompts = [
        "Find managers at HP",
        "List data analyst at HP",
        "Show people working as researchers at Google",
        "Find connections of Osaid"
    ]
    
    test_natural_language_search(prompts)
