from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# --- CONFIGURATION ---
APP_TITLE = "Navigator Core"
VERSION = "1.0.0"

app = FastAPI(title=APP_TITLE, version=VERSION)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GENERIC MODELS ---
class User(BaseModel):
    id: int
    email: str
    name: str # The "Hero" name
    role: str # e.g. "Student", "Patient", "Employee"

class ActionItem(BaseModel):
    id: int
    title: str # e.g. "Bill Due", "Assignment Missing"
    severity: str # "critical", "warning", "info"
    action_url: Optional[str] = None

# --- ROUTES ---

@app.get("/api/health")
def health_check():
    return {"status": "operational", "engine": "Navigator Stack v1"}

@app.get("/api/user/me")
def get_user_profile():
    # TODO: Connect to DB
    return User(
        id=1, 
        email="demo@example.com", 
        name="Demo User", 
        role="Standard User"
    )

@app.get("/api/signals")
def get_dashboard_signals():
    """Returns the 'Holds/Alerts' that drive the Dashboard color"""
    return [
        ActionItem(id=1, title="Welcome to your new App", severity="info"),
        ActionItem(id=2, title="Complete your profile", severity="warning")
    ]

# --- VERCEL ENTRY ---
# This ensures it runs on Serverless correctly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
