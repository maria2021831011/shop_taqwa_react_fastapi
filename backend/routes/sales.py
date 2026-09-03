from fastapi import APIRouter, Depends
from database import get_connection
from dependencies import get_current_user
import pymysql

router = APIRouter(prefix="/sales", tags=["Sales"])


@router.get("/performance/me")
def my_performance(user=Depends(get_current_user)):
    staff_id = user["id"]

    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT 
            COUNT(*) AS orders_handled,
            COALESCE(SUM(grand_total), 0) AS total_sales
        FROM sales
        WHERE staff_id = %s
    """, (staff_id,))

    data = cursor.fetchone()

    cursor.close()
    conn.close()

    return data


@router.get("/summary/today")
def today_sales_summary(user=Depends(get_current_user)):
    staff_id = user["id"]

    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT 
            COUNT(*) AS total_orders,
            COALESCE(SUM(grand_total), 0) AS total_sales
        FROM sales
        WHERE staff_id = %s
          AND DATE(created_at) = CURDATE()
    """, (staff_id,))

    summary = cursor.fetchone()
    cursor.close()
    conn.close()

    return summary
