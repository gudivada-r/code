from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ActionItem, Metric

app = FastAPI(title="Navigator Core", version="1.0.0")

# CORS for Frontend Development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Standardized "Signal Engine" Endpoints ---

@app.get("/api/signals", response_model=list[ActionItem])
def get_signals():
    """
    Returns a list of 'Signals' (Action Items) for the user.
    This replaces domain-specific logic like 'get_student_holds'.
    """
    return [
        ActionItem(id="1", title="Review Terms of Service", type="warning", description="Please sign the new agreement."),
        ActionItem(id="2", title="Welcome Aboard", type="info", description="Setup your profile to get started.")
    ]

@app.get("/api/metrics", response_model=list[Metric])
def get_metrics():
    """
    Returns key performance indicators for the user.
    """
    return [
        Metric(label="Completion", value="85%", trend="up"),
        Metric(label="Efficiency", value="9.2", trend="neutral")
    ]

@app.get("/health")
def health_check():
    return {"status": "operational", "framework": "Navigator Stack 1.0"}
