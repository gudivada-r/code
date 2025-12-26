from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router

app = FastAPI(title="Student Success API", version="0.1.0")

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    from sqlmodel import SQLModel
    from app.auth import engine
    SQLModel.metadata.create_all(engine)

@app.get("/")
async def root():
    return {"message": "Welcome to Student Success API"}

app.include_router(router, prefix="/api")
