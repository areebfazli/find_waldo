# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import search, homepage

app = FastAPI(title="AI Search API")

# CORS — restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers (homepage has GET / and POST /)
app.include_router(homepage.router)
app.include_router(search.router)
