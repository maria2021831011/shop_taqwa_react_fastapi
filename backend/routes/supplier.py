from fastapi import FastAPI, APIRouter, UploadFile, File, Header, HTTPException
from database import get_connection
import os
import shutil

router = APIRouter(prefix="/invoices", tags=["Invoices"])

SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")

def get_user_from_token(authorization: str):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/upload")
async def upload_invoice(
    invoice: UploadFile = File(...),
    authorization: str = Header(None)
):
    user = get_user_from_token(authorization)
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Only suppliers can upload invoices")

    # Save file to server
    upload_dir = "uploads/invoices"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, invoice.filename)
    
    with open(file_path, "wb") as f:
        shutil.copyfileobj(invoice.file, f)

    # Insert record into supplier_invoices table
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
