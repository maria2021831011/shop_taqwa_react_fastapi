from pydantic import BaseModel
from typing import Optional

# Register / Login
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

# Stock
class StockItem(BaseModel):
    product_name: str
    quantity: int
    price: float

# Orders
class OrderItem(BaseModel):
    customer_id: int
    product_id: int
    quantity: int
