import pool from '../config/database.ts';
import type { Order, OrderItem } from '../types/index.ts';

export class OrderModel {
  static async create(order: Partial<Order>): Promise<string> {
    try {
      const [result] = await pool.query(
        `INSERT INTO orders (id, customer_id, outlet_id, total_price, order_type, payment_method, status, payment_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.id,
          order.customer_id,
          order.outlet_id,
          order.total_price,
          order.order_type,
          order.payment_method,
          order.status,
          order.payment_status,
          order.created_at,
        ]
      );
      const insertResult = result as any;
      return insertResult.insertId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async addOrderItems(orderId: string, items: OrderItem[]): Promise<void> {
    try {
      for (const item of items) {
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price, notes)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price, item.notes || null]
        );
      }
    } catch (error) {
      console.error('Error adding order items:', error);
      throw error;
    }
  }

  static async findById(orderId: string): Promise<Order | null> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );
      const orders = rows as any[];
      return orders.length > 0 ? orders[0] : null;
    } catch (error) {
      console.error('Error finding order:', error);
      throw error;
    }
  }

  static async findByOutletId(
    outletId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Order[]> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM orders WHERE outlet_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [outletId, limit, offset]
      );
      return rows as Order[];
    } catch (error) {
      console.error('Error finding orders:', error);
      throw error;
    }
  }

  static async updateStatus(orderId: string, status: string, paymentStatus?: string): Promise<void> {
    try {
      if (paymentStatus) {
        await pool.query(
          'UPDATE orders SET status = ?, payment_status = ? WHERE id = ?',
          [status, paymentStatus, orderId]
        );
      } else {
        await pool.query(
          'UPDATE orders SET status = ? WHERE id = ?',
          [status, orderId]
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  static async getOrderById(orderId: string): Promise<any> {
    try {
      const [orderRows] = await pool.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );
      const orders = orderRows as any[];
      if (orders.length === 0) return null;

      const order = orders[0];
      const [itemRows] = await pool.query(
        `SELECT oi.*, p.name as product_name FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId]
      );

      order.items = itemRows;
      return order;
    } catch (error) {
      console.error('Error getting order details:', error);
      throw error;
    }
  }
}
