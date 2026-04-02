# Yokina Cafe Backend

Backend API untuk sistem manajemen Yokina Cafe dengan fitur admin dan customer.

## Features

- **Admin Panel**: Dashboard keuangan, manajemen pesanan, generate bill dengan QR code
- **Customer Portal**: Tempat pesan, takeaway online, order via WhatsApp, integrasi Go-food/Grab-food/Shopee-food
- **Loyalty System**: Akumulasi poin dari setiap pembelian, dapat ditukar dengan voucher diskon
- **Bill Management**: Generate bill unik dengan QR code, tidak bisa ditiru, dapat dikirim via WhatsApp
- **Financial Management**: Tracking pendapatan, pengeluaran, dan rekap bulanan

## Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi database dan API keys Anda.

3. Setup database:
```sql
-- Create database
CREATE DATABASE yokina_cafe;

-- Import schema (akan disediakan di bagian selanjutnya)
```

## Running

Development:
```bash
npm run dev
```

Build:
```bash
npm run build
```

Production:
```bash
npm run start
```

## API Endpoints

### Authentication
- `POST /api/auth/register/admin` - Register admin
- `POST /api/auth/register/customer` - Register customer
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Admin
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/:order_id` - Order details
- `POST /api/admin/bills/generate` - Generate bill
- `POST /api/admin/bills/send-whatsapp` - Send bill via WhatsApp
- `GET /api/admin/financial/report` - Financial report
- `GET /api/admin/financial/history` - Financial history
- `POST /api/admin/financial/expense` - Add expense

### Customer
- `POST /api/customer/orders/place` - Place order
- `GET /api/customer/orders` - My orders
- `GET /api/customer/loyalty` - Loyalty points & vouchers
- `POST /api/customer/loyalty/redeem` - Redeem voucher
- `GET /api/customer/profile` - Profile

### Bills
- `POST /api/bills/verify` - Verify bill
- `POST /api/bills/redeem` - Redeem bill
- `GET /api/bills/:order_id` - Bill details
