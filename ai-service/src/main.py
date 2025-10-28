from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import ai_routes

app = FastAPI(title="DelegateVault AI Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(ai_routes.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "DelegateVault AI Service", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
