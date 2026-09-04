# Taqwa Discount Shop

A full-stack retail management system built with **FastAPI** and **React**, featuring role-based dashboards for customers, staff, managers, suppliers, and owners.

**Live Demo:** [https://shop-taqwa-react-fastapi.vercel.app/](https://shop-taqwa-react-fastapi.vercel.app/)

---

## Overview

Taqwa Discount Shop is a complete retail operations platform designed to streamline day-to-day activities across sales, inventory, customer loyalty, supplier management, and business analytics. The system provides dedicated dashboards and workflows for each user role.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Python, FastAPI, SQLAlchemy, JWT Auth, Pydantic |
| **Frontend** | React 19, Vite 7, React Router 7, Axios |
| **Database** | MySQL |
| **Charts** | Chart.js, Recharts |
| **Icons** | Lucide React, React Icons |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## Features

### Customer
- Registration and login
- Product browsing and search
- Loyalty points and rewards tracking
- Order history and profile management

### Staff
- Point-of-sale (POS) workflow
- Customer management at checkout
- Stock and product search
- Sales summary and performance tracking
- Schedule management

### Manager
- Daily sales monitoring
- Live inventory visibility
- Target tracking and feedback
- Purchase order oversight
- Staff scheduling

### Supplier
- Invoice uploads and record tracking
- Order management
- Shop information access
- Notifications

### Owner
- Business overview dashboard
- Profit & loss reporting
- Stock overview
- Performance scorecards
- Activity logs and notifications
- Sales analytics with charts

---

## Project Structure

```
shop_taqwa_react_fastapi/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── dependencies.py
│   └── routes/
│       ├── customers.py
│       ├── invoices.py
│       ├── loyalty.py
│       ├── manager_dashboard.py
│       ├── messages.py
│       ├── owner.py
│       ├── pos.py
│       ├── products.py
│       ├── purchase.py
│       ├── sales.py
│       ├── schedule.py
│       ├── staff_pos.py
│       ├── staff_stock.py
│       └── supplier.py
├── taqwa_discount_shop/
│   ├── src/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── staff/
│   │   ├── manager/
│   │   ├── supplier/
│   │   ├── owner/
│   │   └── home/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── init_db.py
├── render.yaml
├── requirements.txt
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL

### Environment Variables

**Backend** (`.env`):

```env
SECRET_KEY=your_secret_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=taqwa_shop
CORS_ORIGINS=http://localhost:5173
```

**Frontend** (`.env`):

```env
VITE_API_URL=http://localhost:8000
```

### Installation

**Backend:**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m main                  # Starts on port 8000
```

**Frontend:**

```bash
cd taqwa_discount_shop
npm install
npm run dev                     # Starts on port 5173
```

**Database:**

```bash
python init_db.py
```

---

## Deployment

The project is configured for deployment via [render.yaml](render.yaml):

- **Backend** — FastAPI service on Render
- **Frontend** — React SPA on Vercel

Ensure your MySQL database is accessible from the deployment environment and set the required environment variables accordingly.

---

## License

See [LICENSE](LICENSE) for details.
