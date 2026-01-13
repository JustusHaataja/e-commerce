from fastapi import APIRouter, Depends, HTTPException, Response, status, Cookie
from sqlalchemy.orm import Session
from typing import Optional
import uuid
import os

from routes.routes_auth import get_current_user
from database import get_db
from models import CartItem, Product

# NOTE:
# The imports below are for local development (localhost execution).
# Use these when running the file directly.
# Commented-out relative imports are used when running the app as a package.

# from .routes_auth import get_current_user
# from ..database import get_db
# from ..models import CartItem, Product


router = APIRouter(tags=["Cart"])

IS_PRODUCTION = os.getenv("ENVIRONMENT", "development") == "production"

# ---- Helper: Set Cookie Safely ----
def get_cookie_settings():
    """Returns cookie settings based on environment"""
    if IS_PRODUCTION:
        return {
            "httponly": True,
            "secure": True,
            "samesite": "none",
            "max_age": 60 * 60 * 24 * 14,
        }
    else:
        return {
            "httponly": True,
            "secure": False,
            "samesite": "lax",
            "max_age": 60 * 60 * 24 * 14,
        }


def ensure_guest_id(response: Response, guest_id: Optional[str], current_user) -> Optional[str]:
    """
    Returns guest_id only if user is NOT logged in.
    If user IS logged in, clears the guest_id cookie.
    """
    # If user is logged in, we don't need guest_id
    if current_user:
        # Clear guest_id cookie if it exists
        if guest_id:
            response.delete_cookie("guest_id")
        return None
    
    # User not logged in - ensure they have a guest_id
    if not guest_id:
        new_guest_id = str(uuid.uuid4())
        cookie_settings = get_cookie_settings()
        response.set_cookie(
            key="guest_id",
            value=new_guest_id,
            **cookie_settings
        )
        return new_guest_id
    
    return guest_id


def get_cart_item(
    db: Session,
    product_id: int,
    current_user,
    guest_id: Optional[str]
) -> Optional[CartItem]:
    """
    Helper function to get a cart item based on user authentication status.
    Returns the cart item if found, None otherwise.
    """
    if current_user:
        return db.query(CartItem).filter(
            CartItem.user_id == current_user.id,
            CartItem.product_id == product_id,
            CartItem.guest_id.is_(None)
        ).first()
    else:
        if not guest_id:
            return None
        return db.query(CartItem).filter(
            CartItem.guest_id == guest_id,
            CartItem.product_id == product_id,
            CartItem.user_id.is_(None)
        ).first()


# ---- Routes ----

@router.get("/", summary="View cart")
def view_cart(
    response: Response,
    current_user = Depends(get_current_user),
    guest_id: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
):
    # This will create a NEW guest_id if user is logged out and has no guest_id
    final_guest_id = ensure_guest_id(response, guest_id, current_user)

    if current_user:
        items = db.query(CartItem).filter(
            CartItem.user_id == current_user.id,
            CartItem.guest_id.is_(None)
        ).all()
    else:
        # If no guest_id, return empty (will be set by ensure_guest_id on next request)
        if not final_guest_id:
            return []
        items = db.query(CartItem).filter(
            CartItem.guest_id == final_guest_id,
            CartItem.user_id.is_(None)
        ).all()
    
    return items


@router.post("/add", summary="Add item to cart")
def add_to_cart(
    product_id: int, 
    response: Response, 
    quantity: int = 1,
    current_user = Depends(get_current_user),
    guest_id: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
):
    final_guest_id = ensure_guest_id(response, guest_id, current_user)

    # Validate quantity
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be positive")

    # Check if product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Find existing cart item using helper
    cart_item = get_cart_item(db, product_id, current_user, final_guest_id)

    if cart_item:
        cart_item.quantity += quantity
    else:
        new_item = CartItem(
            product_id=product_id,
            quantity=quantity,
            user_id=current_user.id if current_user else None,
            guest_id=final_guest_id if not current_user else None
        )
        db.add(new_item)
    
    db.commit()
    return {"message": "Item added to cart", "product_id": product_id}


@router.delete("/remove/{product_id}", summary="Remove item from cart")
def remove_from_cart(
    product_id: int,
    response: Response,
    current_user = Depends(get_current_user),
    guest_id: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
):
    final_guest_id = ensure_guest_id(response, guest_id, current_user)

    # Get cart item using helper
    cart_item = get_cart_item(db, product_id, current_user, final_guest_id)

    if not cart_item:
        raise HTTPException(
            status_code=404, 
            detail=f"Product {product_id} not found in your cart"
        )

    # Additional security check: ensure the item belongs to the current user/guest
    if current_user and cart_item.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to remove this item"
        )
    if not current_user and cart_item.guest_id != final_guest_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to remove this item"
        )

    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart", "product_id": product_id}


@router.put("/update/{product_id}", summary="Update item quantity")
def update_quantity(
    product_id: int,
    quantity: int,
    response: Response,
    current_user = Depends(get_current_user),
    guest_id: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
):
    final_guest_id = ensure_guest_id(response, guest_id, current_user)

    # Get cart item using helper
    cart_item = get_cart_item(db, product_id, current_user, final_guest_id)

    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail=f"Product {product_id} not found in your cart"
        )

    # Additional security check
    if current_user and cart_item.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to update this item"
        )
    if not current_user and cart_item.guest_id != final_guest_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to update this item"
        )

    if quantity <= 0:
        # Remove item if quantity is 0 or negative
        db.delete(cart_item)
        message = "Item removed from cart"
    else:
        cart_item.quantity = quantity
        message = "Cart updated"
    
    db.commit()
    return {"message": message, "product_id": product_id, "quantity": max(0, quantity)}