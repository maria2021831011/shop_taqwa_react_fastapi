from fastapi import APIRouter, Depends, HTTPException, Query
from database import get_connection
from dependencies import get_current_user
import pymysql

router = APIRouter(
    prefix="/manager",
    tags=["Manager Dashboard"]
)

@router.get("/daily-sales")
def daily_sales_snapshot(
    date: str = Query(..., description="YYYY-MM-DD"),
    user=Depends(get_current_user)
):
    # 🔐 Only manager access
    if user.get("role") != "manager":
        raise HTTPException(status_code=403, detail="Access denied")

    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    # 🔹 Staff-wise sales for selected date
    cursor.execute("""
        SELECT 
            u.id AS staff_id,
            u.name AS staff_name,
            COUNT(s.id) AS total_orders,
            IFNULL(SUM(s.grand_total), 0) AS total_sales
        FROM sales s
        JOIN users u ON s.staff_id = u.id
        WHERE DATE(s.created_at) = %s
        GROUP BY u.id, u.name
    """, (date,))

    staff_sales = cursor.fetchall()

    # 🔹 Final total (all staff)
    cursor.execute("""
        SELECT 
            COUNT(id) AS grand_total_orders,
            IFNULL(SUM(grand_total), 0) AS grand_total_sales
        FROM sales
        WHERE DATE(created_at) = %s
    """, (date,))

    final_summary = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "date": date,
        "staff_sales": staff_sales,
        "grand_total_orders": final_summary["grand_total_orders"],
        "grand_total_sales": final_summary["grand_total_sales"]
    }
