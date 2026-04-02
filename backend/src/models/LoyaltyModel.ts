import pool from '../config/database';

export class LoyaltyModel {
  static async addPoints(customerId: string, orderId: string, points: number): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO loyalty_points (id, customer_id, order_id, points_earned, created_at)
         VALUES (UUID(), ?, ?, ?, NOW())`,
        [customerId, orderId, points]
      );

      await pool.query(
        'UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?',
        [points, customerId]
      );
    } catch (error) {
      console.error('Error adding loyalty points:', error);
      throw error;
    }
  }

  static async redeemPoints(customerId: string, voucherId: string, pointsUsed: number): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET loyalty_points = loyalty_points - ? WHERE id = ?',
        [pointsUsed, customerId]
      );

      await pool.query(
        'UPDATE vouchers SET usage_count = usage_count + 1 WHERE id = ?',
        [voucherId]
      );

      await pool.query(
        `INSERT INTO voucher_usage (id, customer_id, voucher_id, used_at)
         VALUES (UUID(), ?, ?, NOW())`,
        [customerId, voucherId]
      );
    } catch (error) {
      console.error('Error redeeming points:', error);
      throw error;
    }
  }

  static async getAvailableVouchers(minPoints: number): Promise<any[]> {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM vouchers WHERE active = true AND min_points_required <= ? 
         ORDER BY discount_amount DESC`,
        [minPoints]
      );
      return rows as any[];
    } catch (error) {
      console.error('Error getting vouchers:', error);
      throw error;
    }
  }

  static async getVoucherById(voucherId: string): Promise<any> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM vouchers WHERE id = ?',
        [voucherId]
      );
      const vouchers = rows as any[];
      return vouchers.length > 0 ? vouchers[0] : null;
    } catch (error) {
      console.error('Error getting voucher:', error);
      throw error;
    }
  }
}
