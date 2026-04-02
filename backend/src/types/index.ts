// User types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
  phone?: string;
  loyalty_points?: number;
  total_spent?: number;
  createdAt?: Date;
}

export interface Admin extends User {
  role: 'admin';
  outlet_id: string;
}

export interface Customer extends User {
  role: 'customer';
  loyalty_points: number;
  total_spent: number;
}

// Order types
export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  outlet_id: string;
  items: OrderItem[];
  total_price: number;
  order_type: 'dine_in' | 'takeaway' | 'delivery' | 'whatsapp';
  payment_method: string;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'partial';
  created_at: Date;
  completed_at?: Date;
}

// Financial types
export interface Financial {
  id: string;
  outlet_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  invoice_number?: string;
}

export interface MonthlySummary {
  outlet_id: string;
  month: number;
  year: number;
  total_income: number;
  total_expense: number;
  net_profit: number;
}

// Product types
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

// Loyalty types
export interface LoyaltyPoint {
  id: string;
  customer_id: string;
  order_id: string;
  points_earned: number;
  created_at: Date;
}

export interface Voucher {
  id: string;
  outlet_id: string;
  code: string;
  discount_amount: number;
  discount_percentage?: number;
  min_points_required: number;
  max_usage?: number;
  usage_count: number;
  active: boolean;
  created_at: Date;
}

// Bill types
export interface Bill {
  id: string;
  order_id: string;
  bill_number: string;
  qr_code: string;
  created_at: Date;
  valid_until: Date;
  status: 'active' | 'used' | 'expired';
}

// Outlet types
export interface Outlet {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  operating_hours: string;
  active: boolean;
}
