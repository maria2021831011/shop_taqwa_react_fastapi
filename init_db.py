#!/usr/bin/env python3
"""
Database initialization script - Run this to ensure all tables are created correctly
"""
from backend.database import get_connection
from backend.models import create_tables

try:
    print("🔧 Initializing database tables...")
    create_tables()
    print("✅ Database initialized successfully!")
    
    # Verify tables exist
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES;")
    tables = cursor.fetchall()
    
    print("\n📋 Existing tables in database:")
    for table in tables:
        print(f"  - {list(table.values())[0]}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
