from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database import SessionLocal
from models import Product as ProductModel, Category as CategoryModel
from schemas import Product, Category

# NOTE:
# The imports below are for local development (localhost execution).
# Use these when running the file directly.
# Commented-out relative imports are used when running the app as a package.

# from ..database import SessionLocal
# from ..models import Product as ProductModel, Category as CategoryModel
# from ..schemas import Product, Category


router = APIRouter(tags=["Products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---- Routes ----
@router.get("/", response_model=List[Product])
def get_products(db: Session = Depends(get_db),
                 skip: int = Query(0, ge=0),
                 limit: int = Query(20, le=100),
                 category_id: int | None = None,
                 search: str | None = None,
                 min_price: float | None = None,
                 max_price: float | None = None
                ):
    query = db.query(ProductModel)

    # Calculate current price: use sale_price if available, otherwise price
    current_price = func.coalesce(ProductModel.sale_price, ProductModel.price)

    if category_id:
        query = query.filter(ProductModel.category_id == category_id)
    if search:
        query = query.filter(ProductModel.name.ilike(f"%{search}%"))
    if min_price is not None:
        query = query.filter(current_price >= min_price)
    if max_price is not None:
        query = query.filter(current_price <= max_price)

    products = query.offset(skip).limit(limit).all()

    return products


@router.get("/categories", response_model=List[Category])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(CategoryModel).all()
    
    return categories


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
            )
    return product