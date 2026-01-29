# 🍽️ Restaurant Order Trends – Full Stack Analytics Dashboard

A full-stack restaurant analytics platform that visualizes order trends, revenue insights, and performance metrics using **Laravel** (Backend API) and **Next.js** (Frontend Dashboard).

This project demonstrates backend data aggregation, performance optimization, and frontend data visualization.

---
## 🧱 Tech Stack:
## Backend
1. Laravel (PHP)
2. MySQL
3. Eloquent ORM
4. Carbon (date handling)

Frontend
1. Next.js (App Router)
2. React Hooks
3. Axios
4. Recharts
5. Tailwind CSS

## 🚀 Features

### 🏬 Restaurants
- View all restaurants
- Search, filter, and paginate restaurants
- View restaurant details (city, cuisine, rating)

### 📦 Orders
- Paginated restaurant orders
- Filters:
  - Date range
  - Amount range
  - Hour range

### 📊 Analytics Dashboard (Per Restaurant)
- For a selected date range:
  - 📅 **Daily Order Count**
  - 💰 **Daily Revenue**
  - 🧾 **Average Order Value**
  - ⏰ **Peak Order Hour per Day**
- Interactive charts using **Recharts**

### 🏆 Top Restaurants
- Top 3 restaurants by revenue
- Supports:
  - All time
  - Weekly
  - Monthly

---

## 🛠️ Tech Stack
- **Backend:** Laravel 10, MySQL
- **Frontend:** Next.js 13, Recharts
- **API:** RESTful endpoints
- **Styling:** TailwindCSS
- **Deployment:** Local development via XAMPP and Vercel/Node.js

---

## ⚡ Getting Started

1. Clone the repository:
```bash
git clone https://github.com/jonathandpenha1/KitchenSpur.git
```

## 🛠️ Setup Instructions

###2. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```
Start the backend server:
```bash
php artisan serve
```

###3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Ensure the API base URL is set in services/api.js:
```bash
baseURL: "http://127.0.0.1:8000/api"
```

4. Open your browser:
## Backend API: http://127.0.0.1:8000
## Frontend Dashboard: http://localhost:3000

🔗 API Endpoints
/restaurants – List all restaurants
/restaurants/{id} – Get restaurant details
/restaurants/{id}/orders – Paginated orders for a restaurant
/restaurants/{id}/analytics – Analytics for a restaurant
/analytics/top-restaurants – Top 3 restaurants by revenue

## Project Structure:
```bash
KitchenSpur/
│
├── backend/ (Laravel API)
│   ├── app/Models
│   ├── app/Http/Controllers
│   │     ├── RestaurantController.php
│   │     ├── OrderController.php
│   │     └── AnalyticsController.php
│   ├── routes/api.php
│   └── database/seeders
│
└── frontend/ (Next.js App)
    ├── app/restaurants
    ├── app/restaurants/[id]
    ├── app/restaurants/[id]/analytics
    ├── app/top-restaurants
    └── services/api.js
```


Jonathan D’Penha
