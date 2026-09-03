from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas import StockCreate, StockUpdate

router = APIRouter(prefix="/staff/stock", tags=["Staff Stock"])

# ➕ Add product
@router.post("/")
def add_stock(item: StockCreate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO products (name, price, stock) VALUES (%s, %s, %s)",
        (item.name, item.price, item.stock)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "✅ Product added successfully"}


# 📥 Get all products
@router.get("/")
def get_stock():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data


# ✏️ Update product
@router.put("/{product_id}")
def update_stock(product_id: int, item: StockUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE products
        SET name=%s, price=%s, stock=%s
        WHERE id=%s
        """,
        (item.name, item.price, item.stock, product_id)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "✅ Product updated"}


# ➖ Decrease stock
@router.patch("/decrease/{product_id}")
def decrease_stock(product_id: int, qty: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE products SET stock = stock - %s WHERE id=%s",
        (qty, product_id)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "➖ Stock decreased"}


# ➕ Increase stock
@router.patch("/increase/{product_id}")
def increase_stock(product_id: int, qty: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE products SET stock = stock + %s WHERE id=%s",
        (qty, product_id)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "➕ Stock increased"}


# ❌ Delete product
@router.delete("/{product_id}")
def delete_stock(product_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM products WHERE id=%s", (product_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "❌ Product deleted"}
