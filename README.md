# shop_taqwa_react_fastapi




├─ backend/
│  ├─ main.py               ← FastAPI entry point
│  ├─ models.py             ← Database models (MySQL tables)
│  ├─ schemas.py            ← Pydantic schemas for request/response
│  ├─ database.py           ← MySQL connection
│  ├─ auth.py               ← Login, register, JWT token logic
│  └─ routes/
│     ├─ customer.py
│     ├─ staff.py
│     ├─ supplier.py
│     ├─ manager.py
│     └─ owner.py
├─ taqwa_discount_shop/               ← frontend
│  ├─ src/
│  └─ ...
└─ README.md

taqwa_discount_shop/
│
├─ backend/                  # FastAPI backend
│   ├─ venv/                 # Python virtual environment
│   ├─ main.py               # FastAPI app entry point
│   ├─ database.py           # MySQL connection
│   ├─ auth.py               # Login/Register routes
│   ├─ stock.py              # Stock CRUD routes
│   ├─ staff.py              # Optional staff-specific APIs
│   └─ models/               # (Optional) Pydantic models if complex
│       └─ user_models.py
│
├─ taqwa_discount_shop/      # React frontend
│   ├─ src/
│   │   ├─ App.jsx
│   │   ├─ main.jsx
│   │   ├─ home/             # Homepage
│   │   │   └─ Home.jsx
│   │   ├─ auth/             # Auth pages
│   │   │   ├─ Login.jsx
│   │   │   ├─ Register.jsx
│   │   │   └─ ForgotPassword.jsx
│   │   ├─ customer/
│   │   │   ├─ CustomerDashboard.jsx
│   │   │   ├─ views/
│   │   │   │   ├─ Header.jsx
│   │   │   │   ├─ Loyalty.jsx
│   │   │   │   ├─ Profile.jsx
│   │   │   │   └─ OrderHistory.jsx
│   │   │   └─ styles/customer.css
│   │   ├─ staff/
│   │   │   ├─ StaffDashboard.jsx
│   │   │   ├─ views/
│   │   │   │   ├─ StaffHeader.jsx
│   │   │   │   ├─ POS.jsx
│   │   │   │   ├─ ProductSearch.jsx
│   │   │   │   ├─ CustomerForm.jsx
│   │   │   │   ├─ SalesSummary.jsx
│   │   │   │   ├─ Performance.jsx
│   │   │   │   └─ Stock.jsx          # Connected to backend
│   │   │   └─ styles/staff.css
│   │   ├─ supplier/
│   │   │   ├─ SupplierDashboard.jsx
│   │   │   ├─ views/
│   │   │   │   ├─ SupplierHeader.jsx
│   │   │   │   ├─ Orders.jsx
│   │   │   │   ├─ InvoiceUpload.jsx
│   │   │   │   └─ Messages.jsx
│   │   │   └─ styles/supplier.css
│   │   ├─ manager/
│   │   │   ├─ ManagerDashboard.jsx
│   │   │   ├─ views/
│   │   │   │   ├─ ManagerHeader.jsx
│   │   │   │   ├─ DailySales.jsx
│   │   │   │   ├─ LiveStock.jsx
│   │   │   │   ├─ Target.jsx
│   │   │   │   ├─ Schedule.jsx
│   │   │   │   ├─ Feedback.jsx
│   │   │   │   └─ PendingOrders.jsx
│   │   │   └─ styles/manager.css
│   │   ├─ owner/
│   │   │   ├─ OwnerDashboard.jsx
│   │   │   ├─ views/
│   │   │   │   ├─ OwnerHeader.jsx
│   │   │   │   ├─ Overview.jsx
│   │   │   │   ├─ SalesGraph.jsx
│   │   │   │   ├─ ProfitLoss.jsx
│   │   │   │   ├─ StockOverview.jsx
│   │   │   │   ├─ ActivityLog.jsx
│   │   │   │   └─ Notifications.jsx
│   │   │   └─ styles/owner.css
│   │   └─ styles/global.css



---
frontend
---
1.node -v
npm -v

2.npm create vite@latest taqwa_discount_shop
cd taqwa_discount_shop
npm install

3.npm install axios react-router-dom

4.npm install jwt-decode
npm install react-icons
npm install chart.js react-chartjs-2

5.npm run dev


---
Backend (FastAPI)
---
1.python -m venv venv

2.venv\Scripts\activate

3.pip install fastapi uvicorn

4.pip install pymysql

5.pip install python-jose passlib[bcrypt]

6.pip install python-multipart

7.uvicorn main:app --reload
