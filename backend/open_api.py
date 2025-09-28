import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Initialize the client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Make a chat completion request
response = client.chat.completions.create(
    model="gpt-4o-mini",  # Use a current model like gpt-4o or gpt-4o-mini
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, world!"}
    ]
)

print(response.choices[0].message.content)