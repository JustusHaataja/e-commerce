from pydantic import BaseModel, EmailStr
from typing import List, Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str   # Plain text input, we will hash it


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True


class ProductImageBase(BaseModel):
    image_url: str


class ProductImage(ProductImageBase):
    id: int
    product_id: int

    class Config:
        orm_mode = True


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    sale_price: Optional[float] = None
    category_id: Optional[int] = None
    nutrition: Optional[str] = None


class Product(ProductBase):
    id: int
    images: List[ProductImage] = []

    class Config:
        orm_mode = True


class Category(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class CartItemBase(BaseModel):
    product_id: int
    quantity: int


class CartItemCreate(CartItemBase):
    pass


class CartItem(CartItemBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
