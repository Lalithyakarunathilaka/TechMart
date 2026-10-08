# TechMart — Electronics & Tech Gadgets Store

A full-stack e-commerce application for an electronics and tech gadgets store, built as a technical assessment for the DartCodes Software Engineer Intern position.

## Technologies Used

### Frontend
- **React 19** with Vite 8 (fast build tooling)
- **Tailwind CSS v4** (utility-first responsive styling)
- **React Router v7** (client-side routing)
- **Axios** (HTTP client for API communication)
- **Lucide React** (icon library)
- **React Hot Toast** (notification system)

### Backend
- **Laravel 11** (PHP framework)
- **Laravel Sanctum** (API token authentication)
- **MySQL** (relational database)

## Architecture

```
TechMart/
├── backend/              
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php        
│   │   │   │   ├── ProductController.php    
│   │   │   │   ├── CategoryController.php    
│   │   │   │   ├── CheckoutController.php    
│   │   │   │   └── Admin/
│   │   │   │       ├── DashboardController.php
│   │   │   │       ├── AdminProductController.php
│   │   │   │       ├── AdminCategoryController.php
│   │   │   │       └── AdminOrderController.php
│   │   │   └── Middleware/
│   │   │       └── AdminMiddleware.php       
│   │   └── Models/                           
│   ├── database/
│   │   ├── migrations/                       
│   │   └── seeders/                          
│   └── routes/api.php                        
│
└── frontend/               
    └── src/
        ├── components/     
        ├── pages/          
        ├── context/        
        └── services/      
```

## Database Design

### Tables

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| **users** | id, name, email, password, phone, role (admin/customer) | Authentication & authorization |
| **categories** | id, name, slug, description, image | Product categorization |
| **products** | id, category_id, name, slug, price, sale_price, stock, images (JSON), specifications (JSON), featured, status | Product catalog with variants |
| **orders** | id, user_id (nullable), order_number, customer_*, shipping_address, total, status, payment_method, payment_status | Order management (supports guest checkout) |
| **order_items** | id, order_id, product_id, product_name, price, quantity | Line items preserving price at time of purchase |

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

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@techmart.com | password |
| Customer | john@example.com | password |

## Important Technical Decisions

### 1. Client-Side Cart (Context + localStorage)
Cart state is managed in React Context and persisted to localStorage. This avoids unnecessary API calls for cart operations and works for both guests and logged-in users. Cart is converted to an order at checkout.

### 2. Sanctum Token Authentication
Chose token-based auth over session-based because the frontend and backend run on different ports. Tokens are stored in localStorage and sent via Authorization header.

### 3. Guest Checkout Support
Orders have a nullable user_id, allowing customers to place orders without creating an account. This reduces friction for first-time buyers.

### 4. PayHere Hash Generation Server-Side
The payment hash is generated on the backend to keep the merchant_secret secure. The frontend receives the hash and submits a form directly to PayHere.

### 5. WhatsApp Integration via wa.me
Uses the WhatsApp Click-to-Chat API (wa.me) to send formatted order messages. The order is also saved in the database for tracking.

## Security Approach

- **Authentication**: Laravel Sanctum token-based API authentication
- **Authorization**: AdminMiddleware checks user role before allowing admin operations
- **Password Hashing**: bcrypt (Laravel default, 12 rounds)
- **Input Validation**: Laravel Form Request validation on all API endpoints
- **CORS**: Configured to accept requests only from the frontend URL
- **Environment Variables**: All sensitive config (DB credentials, PayHere secrets) stored in .env, never committed
- **SQL Injection**: Protected by Eloquent ORM parameterized queries
- **PayHere IPN Verification**: Server-side MD5 signature verification on payment notifications
- **Stock Validation**: Server-side stock check during checkout in a database transaction

## Checkout Flow

### PayHere Payment
1. Customer fills checkout form → clicks "Pay with PayHere"
2. Frontend sends order data to backend API
3. Backend creates order, generates PayHere hash, returns payment data
4. Frontend submits hidden form to PayHere Sandbox
5. Customer completes payment on PayHere
6. PayHere sends IPN notification to backend → payment_status updated

### WhatsApp Order
1. Customer fills checkout form → clicks "Order via WhatsApp"
2. Frontend sends order data to backend API → order saved as pending
3. Frontend opens wa.me link with formatted order message
4. Customer sends message to business WhatsApp number

## Assumptions & Limitations

- Product images use placeholder URLs (placehold.co) — in production, would use file upload with cloud storage
- PayHere integration requires sandbox credentials to be configured in .env
- WhatsApp business number is hardcoded in the frontend — would be configurable via admin settings in production
- No email notifications implemented (would use Laravel Mail in production)
- Single currency (LKR) — multi-currency not implemented
- No product image upload UI — images are added via URL
