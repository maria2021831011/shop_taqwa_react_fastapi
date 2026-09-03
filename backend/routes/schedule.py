from fastapi import APIRouter, Depends
from database import get_connection
from dependencies import get_current_user
import pymysql

router = APIRouter(prefix="/schedule", tags=["Schedule"])

# Get all staff members
@router.get("/staff")
def get_all_staff():
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT id, name, email, role
        FROM users
        WHERE role = 'staff'
        ORDER BY name ASC
    """)

    staff = cursor.fetchall()
    cursor.close()
    conn.close()

    return staff

# Get schedule for all staff
@router.get("/")
def get_all_schedules():
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT ss.*, u.email
        FROM staff_schedule ss
        LEFT JOIN users u ON ss.staff_id = u.id
        ORDER BY ss.staff_name ASC
    """)

    schedules = cursor.fetchall()
    cursor.close()
    conn.close()

    return schedules

# Get schedule for a specific staff member
@router.get("/{staff_id}")
def get_staff_schedule(staff_id: int):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT *
        FROM staff_schedule
        WHERE staff_id = %s
    """, (staff_id,))

    schedule = cursor.fetchone()
    cursor.close()
    conn.close()

    if not schedule:
        # Create default schedule if doesn't exist
        return create_default_schedule(staff_id)

    return schedule

# Create or update staff schedule
@router.post("/")
def create_or_update_schedule(data: dict, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    staff_id = data.get("staff_id")
    staff_name = data.get("staff_name", "")
    
    if not staff_id:
        cursor.close()
        conn.close()
        return {"error": "staff_id is required"}
    
    try:
        # Check if schedule exists
        cursor.execute("SELECT id FROM staff_schedule WHERE staff_id = %s", (staff_id,))
        existing = cursor.fetchone()

        if existing:
            # Update existing schedule
            cursor.execute("""
                UPDATE staff_schedule
                SET monday = %s, tuesday = %s, wednesday = %s, thursday = %s,
                    friday = %s, saturday = %s, sunday = %s, updated_at = NOW()
                WHERE staff_id = %s
            """, (
                data.get("monday", "Off"),
                data.get("tuesday", "Off"),
                data.get("wednesday", "Off"),
                data.get("thursday", "Off"),
                data.get("friday", "Off"),
                data.get("saturday", "Off"),
                data.get("sunday", "Off"),
                staff_id
            ))
        else:
            # Insert new schedule
            cursor.execute("""
                INSERT INTO staff_schedule 
                (staff_id, staff_name, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                staff_id,
                staff_name,
                data.get("monday", "Off"),
                data.get("tuesday", "Off"),
                data.get("wednesday", "Off"),
                data.get("thursday", "Off"),
                data.get("friday", "Off"),
                data.get("saturday", "Off"),
                data.get("sunday", "Off")
            ))

        conn.commit()
        return {"msg": "Schedule saved successfully"}
    
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    
    finally:
        cursor.close()
        conn.close()

# Delete schedule
@router.delete("/{staff_id}")
def delete_schedule(staff_id: int, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM staff_schedule WHERE staff_id = %s", (staff_id,))
        conn.commit()
        return {"msg": "Schedule deleted successfully"}
    
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    
    finally:
        cursor.close()
        conn.close()

# Helper function to create default schedule
def create_default_schedule(staff_id: int):
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    # Get staff name
    cursor.execute("SELECT name FROM users WHERE id = %s", (staff_id,))
    result = cursor.fetchone()
    staff_name = result["name"] if result else "Staff"

    # Create default schedule
    cursor.execute("""
        INSERT INTO staff_schedule 
        (staff_id, staff_name, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (staff_id, staff_name, "Off", "Off", "Off", "Off", "Off", "Off", "Off"))

    conn.commit()

    cursor.execute("SELECT * FROM staff_schedule WHERE staff_id = %s", (staff_id,))
    schedule = cursor.fetchone()
    cursor.close()
    conn.close()

    return schedule
