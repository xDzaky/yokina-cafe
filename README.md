# Yokina Cafe - Sistem Manajemen Cafe & Loyalitas Pelanggan

Aplikasi web full-stack untuk manajemen cafe Yokina dengan fitur lengkap admin panel dan customer portal.

## 📁 Struktur Project

```
Yokina Cafe/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth & validation middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   └── index.ts         # Main server file
│   ├── database.sql         # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   └── customer/    # Customer pages
│   │   ├── stores/           # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── package.json
│   └── README.md
│
└── README.md (ini)
```

## 🎯 Fitur Utama

### Admin Panel
✅ Dashboard dengan overview keuangan real-time
✅ Manajemen pesanan masuk
✅ Generate bill dengan QR code unik (tidak bisa ditiru)
✅ Kirim bill via WhatsApp
✅ Tracking pendapatan & pengeluaran
✅ Rekap keuangan bulanan

### Customer Portal
✅ Pemesanan di tempat (dine-in)
✅ Takeaway online (ambil ke outlet)
✅ Order via WhatsApp
✅ Integrasi dengan Go-Food, Grab-Food, Shopee-Food
✅ Informasi lokasi outlet
✅ Sistem akumulasi poin loyalitas
✅ Tukar poin dengan voucher diskon

### Sistem Loyalitas
✅ Otomatis hitung poin dari setiap pembelian
✅ Tampilkan poin customer
✅ Voucher redeemable dengan poin
✅ Tracking riwayat poin

### Keamanan
✅ JWT authentication
✅ Password encryption (bcrypt)
✅ Role-based access (admin/customer)
✅ QR code verification untuk bill

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL 5.7+
- npm atau yarn

### Setup Backend

1. Buka terminal di folder backend:
```bash
cd backend
npm install
```

2. Setup database MySQL:
```bash
mysql -u root -p
CREATE DATABASE yokina_cafe;
USE yokina_cafe;
source database.sql;
```

3. Setup environment:
```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi MySQL Anda:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=yokina_cafe
JWT_SECRET=your_secret_key_here
```

4. Jalankan development server:
```bash
npm run dev
```

Server berjalan di: `http://localhost:5000`

### Setup Frontend

1. Buka terminal di folder frontend:
```bash
cd frontend
npm install
```

2. Setup environment:
```bash
cp .env.example .env
```

Edit `.env` jika API URL berbeda dari default.

3. Jalankan development server:
```bash
npm run dev
```

Frontend berjalan di: `http://localhost:5173`

## 📊 Database Schema

### Tables Utama
- **users** - User admin dan customer
- **orders** - Pesanan dari customer
- **order_items** - Item detail dari setiap pesanan
- **products** - Menu yang tersedia
- **bills** - Bill dengan QR code
- **loyalty_points** - Riwayat poin customer
- **vouchers** - Voucher yang tersedia
- **financials** - Tracking keuangan (income/expense)
- **outlets** - Lokasi outlet cafe

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register/admin       - Register admin
POST   /api/auth/register/customer    - Register customer
POST   /api/auth/login                - Login
GET    /api/auth/profile              - Get profile
```

### Admin
```
GET    /api/admin/dashboard           - Dashboard data
GET    /api/admin/orders              - List orders
GET    /api/admin/orders/:id          - Order details
POST   /api/admin/bills/generate      - Generate bill
POST   /api/admin/bills/send-whatsapp - Send via WhatsApp
GET    /api/admin/financial/report    - Monthly report
GET    /api/admin/financial/history   - History
POST   /api/admin/financial/expense   - Add expense
```

### Customer
```
POST   /api/customer/orders/place     - Place order
GET    /api/customer/orders           - My orders
GET    /api/customer/loyalty          - Loyalty points
POST   /api/customer/loyalty/redeem   - Redeem voucher
GET    /api/customer/profile          - My profile
```

### Bills
```
POST   /api/bills/verify              - Verify bill
POST   /api/bills/redeem              - Redeem bill
GET    /api/bills/:order_id           - Bill details
```

## 🎨 UI/UX Design

### Color Palette
- **Primary:** Saddle Brown (#8B4513) - Main brand color
- **Secondary:** Chocolate (#D2691E) - Accent
- **Light:** Cornsilk (#FFF8DC) - Background
- **Success:** Green (#22C55E)
- **Warning:** Yellow (#EAB308)
- **Error:** Red (#EF4444)

### Responsive Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

### Font
- Display: Bold (headings)
- Body: Regular (content)
- Accent: Semibold (highlights)

## 📈 Sistem Poin Loyalitas

```
Formula Perhitungan:
1 Poin = Rp 100 pembelian

Contoh:
- Pembelian Rp 50.000 = 500 poin
- 1000 poin dapat ditukar dengan Rp 10.000 diskon
- 2500 poin dapat ditukar dengan Rp 25.000 diskon
```

## 🔧 Customization

### Mengganti Color Scheme
Edit file `frontend/tailwind.config.ts` dan `frontend/src/index.css`

### Integrasi WhatsApp API
Di `backend/src/controllers/AdminController.ts`, gunakan WhatsApp Business API:
```typescript
// Implementasikan integrasi WhatsApp API di sini
```

### Integrasi Payment Gateway
Tambahkan payment gateway (Midtrans, Stripe, dll) di order controller

### Integrasi Food Delivery Platform
Webhook integration untuk Go-Food, Grab, Shopee di order routes

## 📝 Demo Accounts

```
Admin:
Email: admin@yokina.com
Password: password123

Customer:
Email: customer@yokina.com
Password: password123
```

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database
- Cek MySQL service berjalan
- Verify DB credentials di .env
- Import database.sql

### Frontend API timeout
- Ensure backend server running di port 5000
- Check VITE_API_URL di .env

### QR Code tidak generate
- Install library qrcode: `npm install qrcode`
- Restart backend server

## 📚 Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MySQL
- **Auth:** JWT + bcryptjs
- **QR Code:** qrcode library

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Icons:** Lucide React

## 📄 License

Property of Yokina Cafe

## 👨‍💼 Support

Untuk pertanyaan atau bug reports, hubungi tim development.

---

**Version:** 1.0.0  
**Last Updated:** April 1, 2026
# yokina-cafe
