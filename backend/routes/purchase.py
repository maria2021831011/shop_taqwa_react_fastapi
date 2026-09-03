from fastapi import APIRouter, Depends
from database import get_connection
from dependencies import get_current_user
import pymysql

router = APIRouter(prefix="/purchase", tags=["Purchase"])

@router.get("/orders")
def get_all_purchases():
    """Fetch all purchase orders"""
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT id, product_name, quantity, purchase_price, 
               supplier_name, supplier_email, shop_location, created_at
        FROM purchases
        ORDER BY created_at DESC
    """)

    purchases = cursor.fetchall()
    cursor.close()
    conn.close()

    return purchases

@router.post("")
def add_purchase(data: dict, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    # Save purchase
    cursor.execute("""
        INSERT INTO purchases 
        (product_name, quantity, purchase_price, supplier_name, supplier_email, shop_location)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data["product_name"],
        data["quantity"],
        data["purchase_price"],
        data.get("supplier_name"),
        data.get("supplier_email"),
        data.get("shop_location")
    ))

    # Update stock
    cursor.execute("""
        UPDATE products 
        SET stock = stock + %s 
        WHERE name = %s
    """, (data["quantity"], data["product_name"]))

    conn.commit()
    cursor.close()
    conn.close()

    return {"msg": "Purchase added & stock updated"}
