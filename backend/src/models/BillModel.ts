import pool from '../config/database';

export class BillModel {
  static async create(bill: any): Promise<string> {
    try {
      const [result] = await pool.query(
        `INSERT INTO bills (id, order_id, bill_number, qr_code, created_at, valid_until, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [bill.id, bill.order_id, bill.bill_number, bill.qr_code, bill.created_at, bill.valid_until, bill.status]
      );
      const insertResult = result as any;
      return insertResult.insertId;
    } catch (error) {
      console.error('Error creating bill:', error);
      throw error;
    }
  }

  static async findByOrderId(orderId: string): Promise<any> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM bills WHERE order_id = ?',
        [orderId]
      );
      const bills = rows as any[];
      return bills.length > 0 ? bills[0] : null;
    } catch (error) {
      console.error('Error finding bill:', error);
      throw error;
    }
  }

  static async verifyBill(billNumber: string, qrCode: string): Promise<any> {
    try {
      const [rows] = await pool.query(
        `SELECT b.*, o.customer_id, o.total_price FROM bills b
         JOIN orders o ON b.order_id = o.id
         WHERE b.bill_number = ? AND b.qr_code = ? AND b.status = 'active'`,
        [billNumber, qrCode]
      );
      const bills = rows as any[];
      return bills.length > 0 ? bills[0] : null;
    } catch (error) {
      console.error('Error verifying bill:', error);
      throw error;
    }
  }

  static async markAsUsed(billId: string): Promise<void> {
    try {
      await pool.query(
        'UPDATE bills SET status = "used" WHERE id = ?',
        [billId]
      );
    } catch (error) {
      console.error('Error marking bill as used:', error);
      throw error;
    }
  }
}
