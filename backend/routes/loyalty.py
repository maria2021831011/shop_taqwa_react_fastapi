from fastapi import APIRouter, Depends, HTTPException
from database import get_connection
from dependencies import get_current_user
import pymysql

router = APIRouter(prefix="/loyalty", tags=["Loyalty"])

@router.get("/me")
def my_loyalty(user=Depends(get_current_user)):
    if user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Not allowed")

    email = user["email"]

    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    # Customer info
    cursor.execute("""
        SELECT id, name, coin_points, offer_points, total_purchases
        FROM customers
        WHERE email = %s
    """, (email,))
    customer = cursor.fetchone()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Transactions
    cursor.execute("""
        SELECT type, amount, description, created_at
        FROM customer_transactions
        WHERE customer_id = %s
        ORDER BY created_at DESC
        LIMIT 10
    """, (customer["id"],))

    transactions = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "customer": customer,
        "transactions": transactions
    }
