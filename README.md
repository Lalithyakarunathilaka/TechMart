# TechMart — Electronics & Tech Gadgets Store

A full-stack e-commerce application for an electronics and tech gadgets store, built as a technical assessment for the DartCodes Software Engineer Intern position.

## Technologies Used

### Frontend
- **React 19** with Vite 8 
- **Tailwind CSS v4** 
- **React Router v7** 
- **Axios** 
- **Lucide React** 
- **React Hot Toast** 

### Backend
- **Laravel 11** 
- **Laravel Sanctum** 
- **MySQL** 

## Setup Process

### Prerequisites
- PHP 8.2+, Composer
- Node.js 18+, npm
- MySQL 8+

### Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Configure .env:
# DB_CONNECTION=mysql
# DB_DATABASE=techmart_db
# DB_USERNAME=root
# DB_PASSWORD=your_password
# FRONTEND_URL=http://localhost:5173
# PAYHERE_MERCHANT_ID=your_sandbox_merchant_id
# PAYHERE_MERCHANT_SECRET=your_sandbox_secret

# Generate app key
php artisan key:generate

# Create database
mysql -u root -p -e "CREATE DATABASE techmart_db;"

# Run migrations and seed demo data
php artisan migrate --seed

# Start server
php artisan serve
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```



