from fastapi import APIRouter, Header, HTTPException
from jose import jwt, JWTError
from database import get_connection
import os
import pymysql.cursors

conn = get_connection()
cursor = conn.cursor(pymysql.cursors.DictCursor)  # ✅ correct for pymysql

router = APIRouter(prefix="/owner", tags=["Owner"])

SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")
ALGORITHM = "HS256"


def get_user_from_token(authorization: str):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except (JWTError, IndexError):
        raise HTTPException(status_code=401, detail="Invalid or missing token")
@router.get("/sales-analytics")
def sales_analytics(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    user = get_user_from_token(authorization)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Access denied")

    conn = get_connection()
    cursor = conn.cursor()

    # Daily sales (last 7 days)
    cursor.execute("""
        SELECT DATE(created_at) AS day, 
               SUM(grand_total) AS total
        FROM sales
        GROUP BY DATE(created_at)
        ORDER BY day DESC
        LIMIT 7
    """)

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    # Convert to frontend-friendly format
    data = [
        {
            "date": str(row["day"]),
            "sales": float(row["total"])
        }
        for row in rows
    ]

    return data[::-1]  # oldest → newest

@router.get("/employee-performance")
def employee_performance(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    user = get_user_from_token(authorization)

    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Access denied")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            u.name,
            SUM(s.grand_total) AS total_sales
        FROM sales s
        JOIN users u ON s.staff_id = u.id
        WHERE u.role = 'staff'
        GROUP BY s.staff_id
        ORDER BY total_sales DESC
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    result = []
    for row in rows:
        sales = float(row["total_sales"] or 0)

        # ⭐ Rating logic (simple & clear)
        if sales >= 300000:
            rating = 5
        elif sales >= 250000:
            rating = 4
        elif sales >= 200000:
            rating = 3
        else:
            rating = 2

        result.append({
            "name": row["name"],
            "sales": sales,
            "rating": rating
        })

    return result
@router.get("/profit-loss")
def profit_loss(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    user = get_user_from_token(authorization)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Access denied")

    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)  # ✅ use DictCursor


    # Total Revenue from sales
    cursor.execute("SELECT SUM(grand_total) AS revenue FROM sales")
    revenue = cursor.fetchone()["revenue"] or 0

    # Expenses: purchases
    cursor.execute("SELECT SUM(purchase_price * quantity) AS purchase_expenses FROM purchases")
    purchase_expenses = cursor.fetchone()["purchase_expenses"] or 0

    # Staff salaries (12k per staff)
    cursor.execute("SELECT COUNT(*) AS staff_count FROM users WHERE role='staff'")
    staff_count = cursor.fetchone()["staff_count"] or 0
    staff_salaries = staff_count * 12000

    # Manager salaries (20k per manager)
    cursor.execute("SELECT COUNT(*) AS manager_count FROM users WHERE role='manager'")
    manager_count = cursor.fetchone()["manager_count"] or 0
    manager_salaries = manager_count * 20000

    total_salaries = staff_salaries + manager_salaries
    total_expenses = purchase_expenses + total_salaries
    net_profit = revenue - total_expenses

    cursor.close()
    conn.close()

    return {
        "revenue": revenue,
        "purchase_expenses": purchase_expenses,
        "staff_salaries": staff_salaries,
        "manager_salaries": manager_salaries,
        "total_expenses": total_expenses,
        "profit": net_profit
    }
@router.get("/stock")
def stock_overview(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    user = get_user_from_token(authorization)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Access denied")
    
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT name, stock FROM products")
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return products
@router.get("/activities")
def get_activities(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    user = get_user_from_token(authorization)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Access denied")

    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    # Example: last 10 sales + messages
    cursor.execute("""
        SELECT u.name AS user, 'completed a sale' AS action, s.created_at AS time
        FROM sales s
        JOIN users u ON s.staff_id = u.id
        ORDER BY s.created_at DESC
        LIMIT 10
    """)
    sales_logs = cursor.fetchall()

    cursor.execute("""
        SELECT customer_email AS user, message AS action, created_at AS time
        FROM customer_messages
        ORDER BY created_at DESC
        LIMIT 5
    """)
    customer_logs = cursor.fetchall()

    cursor.close()
    conn.close()

    # Combine and sort by time descending
    all_logs = sales_logs + customer_logs
    all_logs.sort(key=lambda x: x["time"], reverse=True)

    return all_logs
@router.get("/notifications")
def get_notifications(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    user = get_user_from_token(authorization)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Access denied")

    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    # Example 1: Low stock alerts
    cursor.execute("""
        SELECT name AS product, stock
        FROM products
        WHERE stock < 20
    """)
    low_stock = cursor.fetchall()

    # Example 2: Sales drop alert (simple: compare this week's vs last week's sales)
    cursor.execute("""
        SELECT 
            SUM(CASE WHEN WEEK(created_at) = WEEK(CURDATE()) THEN grand_total ELSE 0 END) AS this_week,
            SUM(CASE WHEN WEEK(created_at) = WEEK(CURDATE()) - 1 THEN grand_total ELSE 0 END) AS last_week
        FROM sales
    """)
    sales = cursor.fetchone()
    sales_drop = 0
    if sales and sales["last_week"]:
        sales_drop = ((sales["last_week"] - sales["this_week"]) / sales["last_week"]) * 100

    notifications = []

    for item in low_stock:
        notifications.append({
            "message": f"Stock critical for {item['product']} ({item['stock']} left)",
            "icon": "⚠️"
        })

    if sales_drop > 5:
        notifications.append({
            "message": f"Sales dropped {sales_drop:.1f}% this week",
            "icon": "📉"
        })

    cursor.close()
    conn.close()
    return notifications

@router.get("/overview")
def owner_overview(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    user = get_user_from_token(authorization)

    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Access denied")

    conn = get_connection()
    cursor = conn.cursor()  # already DictCursor

    # Total sales
    cursor.execute("SELECT IFNULL(SUM(grand_total),0) AS total_sales FROM sales")
    total_sales = cursor.fetchone()["total_sales"]

    # Net profit (example 15%)
    net_profit = total_sales * 0.15

    # Employees
    cursor.execute(
        "SELECT COUNT(*) AS total_employees FROM users WHERE role IN ('staff','manager')"
    )
    total_employees = cursor.fetchone()["total_employees"]

    # Active products
    cursor.execute(
        "SELECT COUNT(*) AS active_products FROM products WHERE stock > 0"
    )
    active_products = cursor.fetchone()["active_products"]

    cursor.close()
    conn.close()

    return {
        "total_sales": total_sales,
        "net_profit": net_profit,
        "total_employees": total_employees,
        "active_products": active_products
    }
