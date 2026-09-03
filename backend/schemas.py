from pydantic import BaseModel, EmailStr
from typing import List, Optional

# =========================
# Auth
# =========================
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str


class UserLogin(BaseModel):
    email: str
    password: str


# =========================
# Stock
# =========================
class StockCreate(BaseModel):
    name: str
    price: float
    stock: int


class StockUpdate(BaseModel):
    name: str
    price: float
    stock: int


# =========================
# Orders
# =========================
class OrderItem(BaseModel):
    customer_id: int
    product_id: int
    quantity: int


# =========================
# POS
# =========================
class POSItem(BaseModel):
    product_id: int
    quantity: int
    price: float


class POSCreate(BaseModel):
    staff_id: int
    items: List[POSItem]
    total: float
    vat: float
    discount: float
    grand_total: float
    payment_method: str
class ProfileUpdate(BaseModel):
    name: str
    email: EmailStr
    mobile: str

