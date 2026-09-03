from fastapi import APIRouter, Depends, HTTPException
from database import get_connection
from dependencies import get_current_user
import pymysql
from typing import Optional
from pydantic import BaseModel, EmailStr, validator
import re

router = APIRouter(prefix="/customers", tags=["Customers"])

# 🔹 Get profile
@router.get("/profile")
def get_profile(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT name, email, mobile, coin_points, offer_points, total_purchases
        FROM customers
        WHERE email = %s
    """, (user["email"],))

    customer = cursor.fetchone()
    cursor.close()
    conn.close()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    return customer


# 🔹 Update profile
@router.put("/profile")
def update_profile(data: dict, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE customers
        SET name=%s, email=%s, mobile=%s
        WHERE email=%s
    """, (
        data["name"],
        data["email"],
        data["mobile"],
        user["email"]
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Profile updated successfully"}

# Pydantic Models
class CustomerCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    mobile: str
    coin_points: Optional[int] = 0
    offer_points: Optional[int] = 0
    
    @validator('mobile')
    def validate_mobile(cls, v):
        # Simple BD mobile validation (01XXXXXXXXX)
        pattern = r'^01[3-9]\d{8}$'
        if not re.match(pattern, v):
            raise ValueError('Invalid Bangladeshi mobile number (must be 01XXXXXXXXX)')
        return v

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    coin_points: Optional[int] = None
    offer_points: Optional[int] = None

class PointAdjustment(BaseModel):
    customer_id: int
    adjustment_type: str  # 'coin_add', 'coin_subtract', 'offer_add', 'offer_subtract'
    points: int
    reason: str

# Routes
@router.post("/")
def create_customer(customer: CustomerCreate, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    try:
        cursor.execute("""
            INSERT INTO customers (name, email, mobile, coin_points, offer_points)
            VALUES (%s, %s, %s, %s, %s)
        """, (customer.name, customer.email, customer.mobile, 
              customer.coin_points, customer.offer_points))
        
        customer_id = cursor.lastrowid
        
        # Log initial transactions if points provided
        if customer.coin_points > 0:
            cursor.execute("""
                INSERT INTO customer_transactions 
                (customer_id, type, amount, description, staff_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (customer_id, 'coin_adjustment', customer.coin_points, 
                  'Initial points', user.get('id')))
        
        if customer.offer_points > 0:
            cursor.execute("""
                INSERT INTO customer_transactions 
                (customer_id, type, amount, description, staff_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (customer_id, 'offer_adjustment', customer.offer_points, 
                  'Initial offer points', user.get('id')))
        
        conn.commit()
        return {"message": "Customer created successfully", "id": customer_id}
    except pymysql.err.IntegrityError as e:
        conn.rollback()
        if "mobile" in str(e):
            raise HTTPException(status_code=400, detail="Mobile number already exists")
        elif "email" in str(e):
            raise HTTPException(status_code=400, detail="Email already exists")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.get("/")
def get_customers(
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    user=Depends(get_current_user)
):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    offset = (page - 1) * limit
    query = "SELECT * FROM customers WHERE 1=1"
    params = []
    
    if search:
        query += " AND (name LIKE %s OR mobile LIKE %s OR email LIKE %s)"
        search_pattern = f"%{search}%"
        params.extend([search_pattern, search_pattern, search_pattern])
    
    query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
    params.extend([limit, offset])
    
    cursor.execute(query, params)
    customers = cursor.fetchall()
    
    # Get total count
    count_query = "SELECT COUNT(*) as total FROM customers WHERE 1=1"
    count_params = []
    if search:
        count_query += " AND (name LIKE %s OR mobile LIKE %s OR email LIKE %s)"
        count_params.extend([search_pattern, search_pattern, search_pattern])
    
    cursor.execute(count_query, count_params)
    total = cursor.fetchone()['total']
    
    cursor.close()
    conn.close()
    
    return {
        "customers": customers,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/{customer_id}")
def get_customer(customer_id: int, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    cursor.execute("SELECT * FROM customers WHERE id = %s", (customer_id,))
    customer = cursor.fetchone()
    
    if not customer:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Customer not found")
    
    cursor.close()
    conn.close()
    
    return customer

@router.put("/{customer_id}")
def update_customer(customer_id: int, updates: CustomerUpdate, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    # Check if customer exists
    cursor.execute("SELECT * FROM customers WHERE id = %s", (customer_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Build update query dynamically
    update_fields = []
    params = []
    
    if updates.name is not None:
        update_fields.append("name = %s")
        params.append(updates.name)
    
    if updates.email is not None:
        update_fields.append("email = %s")
        params.append(updates.email)
    
    if updates.coin_points is not None:
        update_fields.append("coin_points = %s")
        params.append(updates.coin_points)
    
    if updates.offer_points is not None:
        update_fields.append("offer_points = %s")
        params.append(updates.offer_points)
    
    if not update_fields:
        cursor.close()
        conn.close()
        return {"message": "No changes provided"}
    
    update_fields.append("updated_at = CURRENT_TIMESTAMP")
    params.append(customer_id)
    
    query = f"UPDATE customers SET {', '.join(update_fields)} WHERE id = %s"
    
    try:
        cursor.execute(query, params)
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Customer updated successfully"}

@router.post("/adjust-points")
def adjust_points(adjustment: PointAdjustment, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    try:
        # Get current points
        cursor.execute("SELECT coin_points, offer_points FROM customers WHERE id = %s", 
                      (adjustment.customer_id,))
        customer = cursor.fetchone()
        
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        current_coins = customer['coin_points']
        current_offers = customer['offer_points']
        new_coins = current_coins
        new_offers = current_offers
        transaction_type = ""
        amount = adjustment.points
        
        # Calculate new values based on adjustment type
        if adjustment.adjustment_type == 'coin_add':
            new_coins = current_coins + adjustment.points
            transaction_type = "coin_adjustment"
            amount = adjustment.points
        elif adjustment.adjustment_type == 'coin_subtract':
            if current_coins < adjustment.points:
                raise HTTPException(status_code=400, detail="Insufficient coin points")
            new_coins = current_coins - adjustment.points
            transaction_type = "coin_adjustment"
            amount = -adjustment.points
        elif adjustment.adjustment_type == 'offer_add':
            new_offers = current_offers + adjustment.points
            transaction_type = "offer_adjustment"
            amount = adjustment.points
        elif adjustment.adjustment_type == 'offer_subtract':
            if current_offers < adjustment.points:
                raise HTTPException(status_code=400, detail="Insufficient offer points")
            new_offers = current_offers - adjustment.points
            transaction_type = "offer_adjustment"
            amount = -adjustment.points
        else:
            raise HTTPException(status_code=400, detail="Invalid adjustment type")
        
        # Update customer points
        cursor.execute("""
            UPDATE customers 
            SET coin_points = %s, offer_points = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (new_coins, new_offers, adjustment.customer_id))
        
        # Log transaction (handle missing user name/id safely)
        description = f"{adjustment.reason} (Staff: {user.get('name', user.get('id'))})"
        cursor.execute("""
            INSERT INTO customer_transactions 
            (customer_id, type, amount, description, staff_id)
            VALUES (%s, %s, %s, %s, %s)
        """, (adjustment.customer_id, transaction_type, amount, description, user.get('id')))
        
        conn.commit()
        
        return {
            "message": "Points adjusted successfully",
            "new_coin_points": new_coins,
            "new_offer_points": new_offers
        }
        
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.get("/{customer_id}/transactions")
def get_customer_transactions(
    customer_id: int, 
    page: int = 1, 
    limit: int = 20,
    user=Depends(get_current_user)
):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    offset = (page - 1) * limit
    
    cursor.execute("""
        SELECT ct.*, u.name as staff_name 
        FROM customer_transactions ct
        JOIN users u ON ct.staff_id = u.id
        WHERE ct.customer_id = %s
        ORDER BY ct.created_at DESC
        LIMIT %s OFFSET %s
    """, (customer_id, limit, offset))
    
    transactions = cursor.fetchall()
    
    # Get total count
    cursor.execute("SELECT COUNT(*) as total FROM customer_transactions WHERE customer_id = %s", 
                  (customer_id,))
    total = cursor.fetchone()['total']
    
    cursor.close()
    conn.close()
    
    return {
        "transactions": transactions,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    try:
        # Check if customer exists
        cursor.execute("SELECT * FROM customers WHERE id = %s", (customer_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Delete transactions first (foreign key constraint)
        cursor.execute("DELETE FROM customer_transactions WHERE customer_id = %s", (customer_id,))
        
        # Delete customer
        cursor.execute("DELETE FROM customers WHERE id = %s", (customer_id,))
        
        conn.commit()
        
        return {"message": "Customer deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()