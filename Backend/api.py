from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pipeline import run_research_pipeline

app = FastAPI(title="ResearchIQ API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    topic: str


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "ResearchIQ API"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/research")
def research(request: ResearchRequest):
    result = run_research_pipeline(request.topic)
    return result