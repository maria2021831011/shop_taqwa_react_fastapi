from fastapi import APIRouter, UploadFile, File, Header, HTTPException
from jose import jwt, JWTError
from database import get_connection
import os, shutil

router = APIRouter(prefix="/invoices", tags=["Invoices"])
SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")

def get_user_from_token(authorization: str):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except (JWTError, IndexError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Upload
@router.post("/upload")
async def upload_invoice(invoice: UploadFile = File(...), authorization: str = Header(None)):
    user = get_user_from_token(authorization)
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Only suppliers can upload invoices")

    upload_dir = "uploads/invoices"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, invoice.filename)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(invoice.file, f)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO supplier_invoices (supplier_email, filename, file_path)
        VALUES (%s, %s, %s)
    """, (user["email"], invoice.filename, file_path))
    conn.commit()
    cursor.close()
    conn.close()

    return {"success": True, "message": "Invoice uploaded successfully"}

# List invoices
@router.get("/list")
def list_invoices(authorization: str = Header(None)):
    user = get_user_from_token(authorization)
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Only suppliers can view invoices")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM supplier_invoices
        WHERE supplier_email = %s
        ORDER BY created_at DESC
    """, (user["email"],))
    invoices = cursor.fetchall()
    cursor.close()
    conn.close()
    return invoices
