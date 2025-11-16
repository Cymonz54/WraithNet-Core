import os
import importlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from core_dashboard.database import Base, engine
from core_dashboard.routers import security_policy  # ✅ Fully qualified import

# Create DB tables
Base.metadata.create_all(bind=engine)

# ✅ Define app BEFORE using it
app = FastAPI(title="WraithNet Core Dashboard")

# Allow frontend (adjust origins later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include static routers manually (if needed)
app.include_router(security_policy.router)

# 🔹 Automatically load all routers from the "routers" folder
routers_dir = os.path.join(os.path.dirname(__file__), "routers")
for filename in os.listdir(routers_dir):
    if filename.endswith(".py") and filename != "__init__.py":
        module_name = f"core_dashboard.routers.{filename[:-3]}"
        module = importlib.import_module(module_name)
        if hasattr(module, "router"):
            app.include_router(module.router)
            print(f"✅ Loaded router: {module_name}")

# Root route
@app.get("/")
def root():
    return {"message": "Welcome to WraithNet Core Dashboard API is running"}

# ✅ Health check route
@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
