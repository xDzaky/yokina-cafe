import pool from '../config/database';

export class ProductModel {
  static async create(product: any): Promise<string> {
    try {
      const [result] = await pool.query(
        `INSERT INTO products (id, outlet_id, name, description, price, category, image_url, available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.outlet_id,
          product.name,
          product.description,
          product.price,
          product.category,
          product.image_url,
          product.available,
        ]
      );
      const insertResult = result as any;
      return insertResult.insertId;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async getByOutletId(outletId: string): Promise<any[]> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM products WHERE outlet_id = ? AND available = true',
        [outletId]
      );
      return rows as any[];
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  static async getById(productId: string): Promise<any> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM products WHERE id = ?',
        [productId]
      );
      const products = rows as any[];
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  static async update(productId: string, product: any): Promise<void> {
    try {
      await pool.query(
        `UPDATE products SET name = ?, description = ?, price = ?, category = ?, available = ? 
         WHERE id = ?`,
        [
          product.name,
          product.description,
          product.price,
          product.category,
          product.available,
          productId,
        ]
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async delete(productId: string): Promise<void> {
    try {
      await pool.query(
        'DELETE FROM products WHERE id = ?',
        [productId]
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}
