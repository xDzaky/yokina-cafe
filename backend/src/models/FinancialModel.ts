import pool from '../config/database';
import type { Financial, MonthlySummary } from '../types/index';

export class FinancialModel {
  static async create(financial: Partial<Financial>): Promise<string> {
    try {
      const [result] = await pool.query(
        `INSERT INTO financials (id, outlet_id, type, category, amount, description, date, invoice_number)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          financial.id,
          financial.outlet_id,
          financial.type,
          financial.category,
          financial.amount,
          financial.description,
          financial.date,
          financial.invoice_number,
        ]
      );
      const insertResult = result as any;
      return insertResult.insertId;
    } catch (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }
  }

  static async getMonthlyReport(outletId: string, year: number, month: number): Promise<MonthlySummary | null> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const [incomeRows] = await pool.query(
        `SELECT SUM(amount) as total FROM financials 
         WHERE outlet_id = ? AND type = 'income' AND date >= ? AND date <= ?`,
        [outletId, startDate, endDate]
      );

      const [expenseRows] = await pool.query(
        `SELECT SUM(amount) as total FROM financials 
         WHERE outlet_id = ? AND type = 'expense' AND date >= ? AND date <= ?`,
        [outletId, startDate, endDate]
      );

      const totalIncome = (incomeRows as any[])[0]?.total || 0;
      const totalExpense = (expenseRows as any[])[0]?.total || 0;

      return {
        outlet_id: outletId,
        month,
        year,
        total_income: totalIncome,
        total_expense: totalExpense,
        net_profit: totalIncome - totalExpense,
      };
    } catch (error) {
      console.error('Error getting monthly report:', error);
      throw error;
    }
  }

  static async getFinancialHistory(
    outletId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<Financial[]> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM financials WHERE outlet_id = ? ORDER BY date DESC LIMIT ? OFFSET ?',
        [outletId, limit, offset]
      );
      return rows as Financial[];
    } catch (error) {
      console.error('Error getting financial history:', error);
      throw error;
    }
  }

  static async getDailyReport(outletId: string, date: Date): Promise<any> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const [orderRows] = await pool.query(
        `SELECT SUM(total_price) as total, COUNT(*) as count FROM orders 
         WHERE outlet_id = ? AND created_at >= ? AND created_at <= ? AND payment_status = 'paid'`,
        [outletId, startOfDay, endOfDay]
      );

      const [expenseRows] = await pool.query(
        `SELECT SUM(amount) as total FROM financials 
         WHERE outlet_id = ? AND type = 'expense' AND date >= ? AND date <= ?`,
        [outletId, startOfDay, endOfDay]
      );

      const totalIncome = (orderRows as any[])[0]?.total || 0;
      const orderCount = (orderRows as any[])[0]?.count || 0;
      const totalExpense = (expenseRows as any[])[0]?.total || 0;

      return {
        date,
        total_income: totalIncome,
        total_expense: totalExpense,
        net_profit: totalIncome - totalExpense,
        order_count: orderCount,
      };
    } catch (error) {
      console.error('Error getting daily report:', error);
      throw error;
    }
  }
}
