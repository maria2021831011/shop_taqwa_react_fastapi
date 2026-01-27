import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    """
    Returns a MySQL connection object using pymysql.
    """
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "taqwa_discount_shop"),
        cursorclass=pymysql.cursors.DictCursor
    )
