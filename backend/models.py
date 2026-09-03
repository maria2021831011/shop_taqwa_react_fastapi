from database import get_connection

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()
        # Purchases table (Stock In / Supplier purchase)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS purchases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        quantity INT NOT NULL,
        purchase_price FLOAT NOT NULL,
        supplier_name VARCHAR(100),
        supplier_email VARCHAR(100),
        shop_location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer','staff','supplier','manager','owner') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)


 # Products table (needed for POS)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        price FLOAT,
        stock INT
    );
    """)

    # Sales table
    # Sales table (POS compatible)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        staff_id INT NOT NULL,
        invoice_no VARCHAR(50) NOT NULL,
        total FLOAT NOT NULL,
        vat FLOAT NOT NULL,
        discount FLOAT NOT NULL,
        grand_total FLOAT NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
        # Supplier invoices table (NEW)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS supplier_invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        supplier_email VARCHAR(100) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_email) REFERENCES users(email)
    );
    """)
    # Supplier messages table (after users table)
    cursor.execute("""
CREATE TABLE IF NOT EXISTS supplier_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_email VARCHAR(100) NOT NULL,
    sender_name VARCHAR(100),
    sender_role VARCHAR(50),
    recipient_email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_email) REFERENCES users(email),
    FOREIGN KEY (recipient_email) REFERENCES users(email)
);
""")

    # Sale items table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sale_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sale_id INT,
        product_id INT,
        quantity INT,
        price FLOAT
    );
    """)

    # Customer table (add to create_tables function)
    cursor.execute("""
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    coin_points INT DEFAULT 0,
    offer_points INT DEFAULT 0,
    total_purchases FLOAT DEFAULT 0,
    last_purchase_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
""")

# Customer transaction history
    cursor.execute("""
CREATE TABLE IF NOT EXISTS customer_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    type ENUM('coin_adjustment', 'offer_adjustment', 'purchase', 'redemption') NOT NULL,
    amount FLOAT NOT NULL,
    description TEXT,
    staff_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (staff_id) REFERENCES users(id)
);
""")
    
    # Customer messages table
    cursor.execute("""
CREATE TABLE IF NOT EXISTS customer_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

    # Staff Schedule table
    cursor.execute("""
CREATE TABLE IF NOT EXISTS staff_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    staff_name VARCHAR(100),
    monday VARCHAR(50),
    tuesday VARCHAR(50),
    wednesday VARCHAR(50),
    thursday VARCHAR(50),
    friday VARCHAR(50),
    saturday VARCHAR(50),
    sunday VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(id)
);
""")

    # Supplier messages table
    cursor.execute("""
CREATE TABLE IF NOT EXISTS supplier_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_email VARCHAR(100) NOT NULL,
    sender_name VARCHAR(100),
    sender_role VARCHAR(50),
    recipient_email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_email) REFERENCES users(email),
    FOREIGN KEY (recipient_email) REFERENCES users(email)
);
""")

    conn.commit()
    cursor.close()
    conn.close()
    print("✅ All tables created successfully")
if __name__ == "__main__":
    create_tables()