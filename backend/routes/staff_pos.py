from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas import POSCreate

router = APIRouter(prefix="/staff/pos", tags=["Staff POS"])




@router.post("/sale")
def create_sale(data: POSCreate):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Calculate total
        total = sum(item.price * item.quantity for item in data.items)

        # Insert sale
        cursor.execute(
            "INSERT INTO sales (staff_id, total_amount) VALUES (%s, %s)",
            (data.staff_id, total)
        )
        sale_id = cursor.lastrowid

        # Insert sale items & update stock
        for item in data.items:
            cursor.execute(
                """
                INSERT INTO sale_items (sale_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
                """,
                (sale_id, item.product_id, item.quantity, item.price)
            )

            # Update stock
            cursor.execute(
                "UPDATE products SET stock = stock - %s WHERE id = %s",
                (item.quantity, item.product_id)
            )

        conn.commit()

        return {
            "message": "✅ Sale completed successfully",
            "sale_id": sale_id,
            "total": total
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.close()
