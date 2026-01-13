from sqlalchemy.orm import Session
from passlib.context import CryptContext

import models

# NOTE:
# The import below is for local development (localhost execution).
# Use this when running the file directly.
# Commented-out relative import us used when running the app as a package.

from . import models 


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---- User CRUD ----
def create_user(db: Session, name: str, email: str, password: str):
    hashed_password = pwd_context.hash(password)
    user = models.User(name=name, email=email, password_hash=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user(db: Session, user_id: int):
    return db.query(models.User).get(user_id)


# --- Cart CRUD ---
def add_to_cart(db: Session, user_id: int, product_id: int, quantity: int):
    cart_item = db.query(models.CartItem).filter_by(user_id=user_id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = models.CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item

def get_cart_items(db: Session, user_id: int):
    return db.query(models.CartItem).filter_by(user_id=user_id).all()

def remove_from_cart(db: Session, cart_item_id: int):
    item = db.query(models.CartItem).get(cart_item_id)
    if item:
        db.delete(item)
        db.commit()
    return item