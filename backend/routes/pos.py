from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas import POSCreate
import time

router = APIRouter(prefix="/pos", tags=["POS"])
from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas import POSCreate
import time

router = APIRouter(prefix="/pos", tags=["POS"])

@router.post("/complete")
def complete_sale(data: POSCreate):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        invoice_no = f"INV-{int(time.time())}"

        cursor.execute("""
            INSERT INTO sales 
            (staff_id, invoice_no, total, vat, discount, grand_total, payment_method)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data.staff_id,
            invoice_no,
            data.total,
            data.vat,
            data.discount,
            data.grand_total,
            data.payment_method
        ))

        sale_id = cursor.lastrowid

        for item in data.items:
            cursor.execute("""
                INSERT INTO sale_items (sale_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            """, (
                sale_id,
                item.product_id,
                item.quantity,
                item.price
            ))

            cursor.execute("""
                UPDATE products
                SET stock = stock - %s
                WHERE id = %s
            """, (
                item.quantity,
                item.product_id
            ))

        conn.commit()
        return {
            "message": "✅ Sale completed successfully",
            "invoice_no": invoice_no
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.close()

