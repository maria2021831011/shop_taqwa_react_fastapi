from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pymysql
from database import get_connection
from passlib.context import CryptContext
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")

router = APIRouter()

class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str
    role: str

class LoginSchema(BaseModel):
    email: str
    password: str

# Register
@router.post("/register")
def register(data: RegisterSchema):
    conn = get_connection()
    cursor = conn.cursor()

    # Hash password
    hashed_password = pwd_context.hash(data.password)

    try:
        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
            (data.name, data.email, hashed_password, data.role)
        )
        conn.commit()
        return {"msg": "User registered successfully"}
    except pymysql.err.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")
    finally:
        cursor.close()
        conn.close()

# Login
@router.post("/login")
def login(data: LoginSchema):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email=%s", (data.email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = jwt.encode(
    {
        "id": user["id"],
        "role": user["role"],
        "email": user["email"]
    },
    SECRET_KEY,
    algorithm="HS256"
)


    return {"token": token, "role": user["role"], "id": user["id"]}
