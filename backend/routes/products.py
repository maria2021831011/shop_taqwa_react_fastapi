from fastapi import APIRouter
from database import get_connection
import pymysql

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/")
def get_products():
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT id, name, price, stock
        FROM products
        WHERE stock > 0
        ORDER BY name
    """)

    products = cursor.fetchall()
    cursor.close()
    conn.close()

    return products
