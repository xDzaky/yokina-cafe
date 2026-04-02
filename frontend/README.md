# Yokina Cafe Frontend

Frontend React untuk sistem manajemen Yokina Cafe dengan fitur admin dan customer.

## Features

- **Desain Aesthetic & Responsive** - Tailwind CSS dengan color scheme cokelat/amber
- **Admin Dashboard** - Dashboard keuangan real-time, manajemen pesanan
- **Customer Portal** - Pemesanan, loyalitas poin, integrasi multiple platform
- **State Management** - Zustand untuk manajemen state auth
- **Type Safety** - Full TypeScript support
- **Dark/Light Mode Ready** - Tailwind CSS responsive design

## Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

Edit `.env` dengan API URL yang tepat.

## Running

Development:
```bash
npm run dev
```

Build:
```bash
npm run build
```

Preview:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
│   ├── admin/    # Admin pages
│   └── customer/ # Customer pages
├── api/          # API client functions
├── stores/       # Zustand stores
├── types/        # TypeScript types
├── utils/        # Utility functions
├── layouts/      # Layout components
└── App.tsx       # Main app component
```

## Pages

### Admin
- `/admin/dashboard` - Dashboard overview
- `/admin/orders` - Order management
- `/admin/financial` - Financial management

### Customer
- `/customer/home` - Home/menu
- `/customer/orders` - Order cart & checkout
- `/customer/loyalty` - Loyalty points & vouchers

### Auth
- `/login` - Login page
- `/register` - Registration page

## Color Scheme

- Primary: #8B4513 (Saddle Brown)
- Accent: #D2691E (Chocolate)
- Light: #FFF8DC (Cornsilk)
- Success: #22C55E
- Warning: #EAB308
- Error: #EF4444
