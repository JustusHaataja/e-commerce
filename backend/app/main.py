# Local hosting imports
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
import os

import models, database, crud, schemas
from routes import routes_auth, routes_products, routes_cart
from database import engine, get_db, SessionLocal
from background_tasks import clean_old_guests

# NOTE:
# The imports below are for local development (localhost execution).
# Use these when running the file directly.
# Commented-out relative imports are used when running the app as a package.

# from . import models, database, crud, schemas
# from .routes import routes_auth, routes_products, routes_cart
# from .database import engine, get_db, SessionLocal
# from .background_tasks import clean_old_guests


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-commerce Backend")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
IS_PRODUCTION = os.getenv("ENVIRONMENT", "development") == "production"

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    FRONTEND_URL,
]

# CORS settings based on environment
cors_config = {
    "allow_origins": origins,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
    "expose_headers": ["*"],
}

if IS_PRODUCTION:
    # More permissive for cross-origin in production
    cors_config["allow_origin_regex"] = r"https://.*\.netlify\.app"


app.add_middleware(CORSMiddleware, **cors_config)

app.include_router(routes_auth.router, prefix="/auth", tags=["auth"])
app.include_router(routes_products.router, prefix="/products", tags=["products"])
app.include_router(routes_cart.router, prefix="/cart", tags=["cart"])


@app.get("/")
def root():
    return {"message": "E-commerce API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


# ---- Background tasks ----
scheduler = BackgroundScheduler()

def scheduled_guest_cleanup():
    db = SessionLocal()
    try:
        count = clean_old_guests(db)
        if count > 0:
            print(f"[CLEANUP] Removed {count} old guest cart items.")
    finally:
        db.close()

scheduler.add_job(scheduled_guest_cleanup, "interval", hours=48)    # clean up every other day
scheduler.start()