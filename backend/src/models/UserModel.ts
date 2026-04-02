import pool from '../config/database.ts';
import type { User } from '../types/index.ts';

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      const users = rows as any[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<User | null> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      const users = rows as any[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  static async create(user: Partial<User>): Promise<string> {
    try {
      const [result] = await pool.query(
        'INSERT INTO users (id, email, password, name, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
        [user.id, user.email, user.password, user.name, user.role, user.phone]
      );
      const insertResult = result as any;
      return insertResult.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateLoyaltyPoints(userId: string, points: number): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ? AND role = "customer"',
        [points, userId]
      );
    } catch (error) {
      console.error('Error updating loyalty points:', error);
      throw error;
    }
  }

  static async getLoyaltyPoints(userId: string): Promise<number> {
    try {
      const [rows] = await pool.query(
        'SELECT loyalty_points FROM users WHERE id = ?',
        [userId]
      );
      const users = rows as any[];
      return users.length > 0 ? users[0].loyalty_points : 0;
    } catch (error) {
      console.error('Error getting loyalty points:', error);
      throw error;
    }
  }
}
