import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from routes.staff_pos import router as staff_pos_router
from routes.pos import router as pos_router
from routes.staff_stock import router as staff_stock_router
from routes.sales import router as sales_router
from routes.customers import router as customer_router
from routes.purchase import router as purchase_router
from routes.loyalty import router as loyalty_router
from routes import messages
from routes import products
from routes.schedule import router as schedule_router
from routes import owner
from routes.manager_dashboard import router as manager_dashboard_router



from routes import supplier, invoices  # import invoices route






from models import create_tables

load_dotenv()

app = FastAPI()

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(purchase_router)

app.include_router(pos_router)
app.include_router(sales_router)
app.include_router(customer_router)
app.include_router(staff_stock_router)
app.include_router(auth_router)
app.include_router(staff_pos_router)
app.include_router(loyalty_router)
app.include_router(products.router)
app.include_router(manager_dashboard_router)
app.include_router(schedule_router)

app.include_router(invoices.router)  # <-- new route
app.include_router(supplier.router)
app.include_router(owner.router)

app.include_router(messages.router)

@app.on_event("startup")
def startup_event():
    try:
        create_tables()
    except Exception as error:
        print(f"Database initialization failed: {error}")

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

@app.post("/init-db")
def init_db_endpoint():
    """Manual database initialization endpoint"""
    try:
        create_tables()
        return {"msg": "Database initialized successfully"}
    except Exception as e:
        return {"error": str(e)}