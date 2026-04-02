import api from './client';
import { AuthResponse, User } from '../types';

export const authApi = {
  registerAdmin: (email: string, password: string, name: string, phone: string) =>
    api.post<AuthResponse>('/auth/register/admin', { email, password, name, phone }),
  
  registerCustomer: (email: string, password: string, name: string, phone: string) =>
    api.post<AuthResponse>('/auth/register/customer', { email, password, name, phone }),
  
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  
  getProfile: () =>
    api.get<User>('/auth/profile'),
};

export const orderApi = {
  placeOrder: (outlet_id: string, items: any[], order_type: string, payment_method: string) =>
    api.post('/customer/orders/place', { outlet_id, items, order_type, payment_method }),
  
  getMyOrders: (limit = 20, offset = 0) =>
    api.get(`/customer/orders?limit=${limit}&offset=${offset}`),
};

export const loyaltyApi = {
  getLoyaltyPoints: () =>
    api.get('/customer/loyalty'),
  
  redeemVoucher: (voucher_id: string, points_to_use: number) =>
    api.post('/customer/loyalty/redeem', { voucher_id, points_to_use }),
};

export const billApi = {
  generateBill: (order_id: string) =>
    api.post('/admin/bills/generate', { order_id }),
  
  sendBillWhatsapp: (order_id: string, phone_number: string) =>
    api.post('/admin/bills/send-whatsapp', { order_id, phone_number }),
  
  verifyBill: (bill_number: string, qr_code: string) =>
    api.post('/bills/verify', { bill_number, qr_code }),
};

export const adminApi = {
  getDashboard: (outlet_id: string) =>
    api.get(`/admin/dashboard?outlet_id=${outlet_id}`),
  
  getOrders: (outlet_id: string, limit = 50, offset = 0) =>
    api.get(`/admin/orders?outlet_id=${outlet_id}&limit=${limit}&offset=${offset}`),
  
  getOrderDetails: (order_id: string) =>
    api.get(`/admin/orders/${order_id}`),
  
  updateOrderStatus: (order_id: string, status: string, payment_status?: string) =>
    api.put(`/admin/orders/${order_id}/status`, { status, payment_status }),
  
  getFinancialReport: (outlet_id: string, year: number, month: number) =>
    api.get(`/admin/financial/report?outlet_id=${outlet_id}&year=${year}&month=${month}`),
  
  getFinancialHistory: (outlet_id: string, limit = 100, offset = 0) =>
    api.get(`/admin/financial/history?outlet_id=${outlet_id}&limit=${limit}&offset=${offset}`),
  
  addExpense: (outlet_id: string, category: string, amount: number, description: string) =>
    api.post('/admin/financial/expense', { outlet_id, category, amount, description }),
};
