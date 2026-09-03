from fastapi import APIRouter, Depends
from database import get_connection
from dependencies import get_current_user
import pymysql

router = APIRouter(prefix="/messages", tags=["Messages"])
@router.post("/send")
def send_message(data: dict, user=Depends(get_current_user)):
    email = user["email"]

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO customer_messages (customer_email, message)
        VALUES (%s, %s)
    """, (email, data["message"]))

    conn.commit()
    cursor.close()
    conn.close()

    return {"msg": "Message sent successfully"}
@router.get("/my")
def get_my_messages(user=Depends(get_current_user)):
    email = user["email"]

    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT id, message, created_at
        FROM customer_messages
        WHERE customer_email = %s
        ORDER BY created_at DESC
    """, (email,))

    messages = cursor.fetchall()
    cursor.close()
    conn.close()

    return messages

@router.get("/")
def get_all_messages(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT id, customer_email, message, created_at
        FROM customer_messages
        ORDER BY created_at DESC
    """)

    messages = cursor.fetchall()
    cursor.close()
    conn.close()

    return messages

@router.post("/reply")
def send_reply(data: dict, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO customer_messages (customer_email, message)
        VALUES (%s, %s)
    """, (data["customer_email"], f"[MANAGER REPLY] {data['reply']}"))

    conn.commit()
    cursor.close()
    conn.close()

    return {"msg": "Reply sent successfully"}

# Supplier messaging endpoints
@router.post("/supplier/send")
def send_supplier_message(data: dict, user=Depends(get_current_user)):
    """Supplier sends message to manager"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        print(f"Sending message from {user['email']} to {data.get('recipient_email', 'manager@taqwa.com')}")
        cursor.execute("""
            INSERT INTO supplier_messages 
            (sender_email, sender_name, sender_role, recipient_email, message)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            user["email"],
            user.get("name", "Supplier"),
            "supplier",
            data.get("recipient_email", "manager@taqwa.com"),
            data["message"]
        ))

        conn.commit()
        print("Message sent successfully")
        return {"msg": "Message sent successfully", "status": "success"}
    except Exception as e:
        conn.rollback()
        print(f"Error sending message: {str(e)}")
        return {"error": str(e), "status": "error"}
    finally:
        cursor.close()
        conn.close()

@router.get("/supplier/inbox")
def get_supplier_messages(user=Depends(get_current_user)):
    """Get messages for supplier (sent to them by manager)"""
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    try:
        cursor.execute("""
            SELECT id, sender_email, sender_name, message, is_read, created_at
            FROM supplier_messages
            WHERE recipient_email = %s
            ORDER BY created_at DESC
        """, (user["email"],))

        messages = cursor.fetchall()
        return messages
    except Exception as e:
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()

@router.get("/supplier/sent")
def get_supplier_sent_messages(user=Depends(get_current_user)):
    """Get messages sent by supplier"""
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    try:
        cursor.execute("""
            SELECT id, recipient_email, message, created_at
            FROM supplier_messages
            WHERE sender_email = %s
            ORDER BY created_at DESC
        """, (user["email"],))

        messages = cursor.fetchall()
        return messages
    except Exception as e:
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()

@router.post("/supplier/read/{message_id}")
def mark_message_read(message_id: int, user=Depends(get_current_user)):
    """Mark message as read"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE supplier_messages 
            SET is_read = TRUE 
            WHERE id = %s AND recipient_email = %s
        """, (message_id, user["email"]))

        conn.commit()
        return {"msg": "Message marked as read"}
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()

