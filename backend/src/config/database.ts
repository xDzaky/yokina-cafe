import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connectionUrl =
  process.env.DB_URL ||
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  '';

const pool = connectionUrl
  ? mysql.createPool({
      uri: connectionUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  : mysql.createPool({
      // Support both custom DB_* variables and Railway MySQL plugin variables.
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
      port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
      user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'yokina_cafe',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

export const initDatabase = async (): Promise<void> => {
  // Ensure auth can work even if schema import was skipped in a fresh deployment.
  await pool.query(`
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
    )
  `);

  await pool.query(
    `
      INSERT INTO users (id, email, password, name, role, phone, loyalty_points, total_spent)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        password = VALUES(password),
        name = VALUES(name),
        role = VALUES(role),
        phone = VALUES(phone),
        loyalty_points = VALUES(loyalty_points),
        total_spent = VALUES(total_spent)
    `,
    [
      '00000000-0000-0000-0000-000000000001',
      'admin@yokina.com',
      '$2a$10$y0fjBgOn/yGoXF93YvEi0eb.9xBi3VGIO95sELP8hoF8xwhYW.NAK',
      'Demo Admin',
      'admin',
      '081234567890',
      0,
      0,
      '00000000-0000-0000-0000-000000000002',
      'customer@yokina.com',
      '$2a$10$y0fjBgOn/yGoXF93YvEi0eb.9xBi3VGIO95sELP8hoF8xwhYW.NAK',
      'Demo Customer',
      'customer',
      '081234567891',
      120,
      250000,
    ]
  );
};

export default pool;
