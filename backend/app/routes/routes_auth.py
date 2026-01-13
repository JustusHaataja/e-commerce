from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, status
from sqlalchemy.orm import Session
import os

# Local imports (comment out for production)
# from ..database import SessionLocal
# from ..models import User, CartItem
# from ..auth import hash_password, verify_password, create_jwt, verify_jwt
# from ..schemas import UserCreate, UserLogin

# Package imports for production
from database import SessionLocal
from models import User, CartItem
from auth import hash_password, verify_password, create_jwt, verify_jwt
from schemas import UserCreate, UserLogin

router = APIRouter()

# Environment detection
IS_PRODUCTION = os.getenv("ENVIRONMENT", "development") == "production"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---- Helper ----
def get_current_user(access_token: str | None = Cookie(None), db: Session = Depends(get_db)):
    if not access_token:
        return None
    
    user_id = verify_jwt(access_token)
    if not user_id:
        return None
    
    user = db.query(User).get(user_id)
    return user


# ---- Cookie Settings Helper ----
def get_cookie_settings():
    """Returns cookie settings based on environment"""
    if IS_PRODUCTION:
        return {
            "httponly": True,
            "secure": True,           # HTTPS only
            "samesite": "none",       # Required for cross-origin in production
            "max_age": 60 * 60 * 24 * 7,
            "domain": None            # Let browser handle it
        }
    else:
        # Local development settings
        return {
            "httponly": True,
            "secure": False,          # Allow HTTP for localhost
            "samesite": "lax",        # More permissive for local
            "max_age": 60 * 60 * 24 * 7,
            "domain": None
        }


# ---- Routes ----
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == user.email).first()

    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sähköposti jo käytössä"
        )
    
    hashed = hash_password(user.password)
    new_user = User(name = user.name,
                    email = user.email,
                    password_hash = hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Käyttäjätili luotu onnistuneesti"}


@router.post("/login")
def login(credentials: UserLogin, response: Response,
          guest_id: str | None = Cookie(None), db: Session = Depends(get_db)):
    # Verify user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Virheelliset kirjautumistiedot"
        )
    
    # Create JWT and set cookie with environment-specific settings
    token = create_jwt(user.id)
    cookie_settings = get_cookie_settings()
    
    response.set_cookie(
        key="access_token",
        value=token,
        **cookie_settings
    )

    # Merge guest cart into user's cart if guest_id exists
    if guest_id:
        guest_items = db.query(CartItem).filter(CartItem.guest_id == guest_id).all()
        
        if guest_items:
            for g in guest_items:
                existing = db.query(CartItem).filter(
                    CartItem.user_id == user.id,
                    CartItem.product_id == g.product_id
                ).first()
                if existing:
                    existing.quantity += g.quantity
                    db.delete(g)
                else:
                    g.user_id = user.id
                    g.guest_id = None
            db.commit()
        
        # Remove guest_id cookie after merge
        response.delete_cookie("guest_id")

    return {"message": "Logged in successfully"}


@router.post("/logout")
def logout(response: Response):
    cookie_settings = get_cookie_settings()

    # Clear access_token with same settings
    response.delete_cookie(
        key="access_token",
        path="/",
        samesite="none",
        secure=True
    )

    # Clear guest_id with same settings
    response.delete_cookie(
        key="guest_id",
        path="/",
        samesite="none",
        secure=True
    )
    
    return {"message": "Logged out"}


@router.get("/me")
def get_current_user_info(user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return {"id": user.id, "name": user.name, "email": user.email}
