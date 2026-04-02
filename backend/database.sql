-- Create Database
CREATE DATABASE IF NOT EXISTS yokina_cafe;
USE yokina_cafe;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'customer') NOT NULL,
  phone VARCHAR(20),
  loyalty_points INT DEFAULT 0,
  total_spent DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Outlets table
CREATE TABLE IF NOT EXISTS outlets (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  operating_hours VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  outlet_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outlet_id) REFERENCES outlets(id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  outlet_id VARCHAR(36) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  order_type ENUM('dine_in', 'takeaway', 'delivery', 'whatsapp') NOT NULL,
  payment_method VARCHAR(50),
  status ENUM('pending', 'processing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid', 'partial') DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (outlet_id) REFERENCES outlets(id),
  KEY created_at (created_at)
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  notes TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Bills table
CREATE TABLE IF NOT EXISTS bills (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL UNIQUE,
  bill_number VARCHAR(50) NOT NULL UNIQUE,
  qr_code LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMP NULL,
  status ENUM('active', 'used', 'expired') DEFAULT 'active',
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Loyalty Points table
CREATE TABLE IF NOT EXISTS loyalty_points (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  order_id VARCHAR(36),
  points_earned INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
  id VARCHAR(36) PRIMARY KEY,
  outlet_id VARCHAR(36) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_amount DECIMAL(15,2),
  discount_percentage DECIMAL(5,2),
  min_points_required INT NOT NULL,
  max_usage INT,
  usage_count INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outlet_id) REFERENCES outlets(id)
);

-- Voucher Usage table
CREATE TABLE IF NOT EXISTS voucher_usage (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  voucher_id VARCHAR(36) NOT NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
);

-- Financials table
CREATE TABLE IF NOT EXISTS financials (
  id VARCHAR(36) PRIMARY KEY,
  outlet_id VARCHAR(36) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  category VARCHAR(100),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  invoice_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outlet_id) REFERENCES outlets(id),
  KEY date (date)
);

-- Create indexes for better performance
CREATE INDEX idx_outlet_id ON products(outlet_id);
CREATE INDEX idx_customer_id ON orders(customer_id);
CREATE INDEX idx_order_id ON order_items(order_id);
CREATE INDEX idx_loyalty_customer ON loyalty_points(customer_id);
CREATE INDEX idx_voucher_outlet ON vouchers(outlet_id);

-- Demo users (password: password123)
INSERT INTO users (id, email, password, name, role, phone, loyalty_points, total_spent)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@yokina.com', '$2a$10$y0fjBgOn/yGoXF93YvEi0eb.9xBi3VGIO95sELP8hoF8xwhYW.NAK', 'Demo Admin', 'admin', '081234567890', 0, 0),
  ('00000000-0000-0000-0000-000000000002', 'customer@yokina.com', '$2a$10$y0fjBgOn/yGoXF93YvEi0eb.9xBi3VGIO95sELP8hoF8xwhYW.NAK', 'Demo Customer', 'customer', '081234567891', 120, 250000)
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  name = VALUES(name),
  role = VALUES(role),
  phone = VALUES(phone),
  loyalty_points = VALUES(loyalty_points),
  total_spent = VALUES(total_spent);
