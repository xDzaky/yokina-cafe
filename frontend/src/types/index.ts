export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  phone?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  outlet_id: string;
  total_price: number;
  order_type: 'dine_in' | 'takeaway' | 'delivery' | 'whatsapp';
  payment_method: string;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'partial';
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: number;
  product_id: string;
  quantity: number;
  price: number;
  notes?: string;
  product_name?: string;
}

export interface Product {
  id: string;
  outlet_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
}

export interface LoyaltyPoint {
  customer_id: string;
  loyalty_points: number;
  available_vouchers: Voucher[];
}

export interface Voucher {
  id: string;
  code: string;
  discount_amount?: number;
  discount_percentage?: number;
  min_points_required: number;
}

export interface Bill {
  id: string;
  order_id: string;
  bill_number: string;
  qr_code: string;
  created_at: string;
  valid_until: string;
  status: 'active' | 'used' | 'expired';
}

export interface Financial {
  id: string;
  outlet_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  invoice_number?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}
