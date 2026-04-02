import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { AuthRequest } from '../middleware/auth';
import { OrderModel } from '../models/OrderModel';
import { UserModel } from '../models/UserModel';
import { LoyaltyModel } from '../models/LoyaltyModel';
import { ProductModel } from '../models/ProductModel';
import { calculateLoyaltyPoints } from '../utils/loyalty';

export class CustomerController {
  static async placeOrder(req: AuthRequest, res: Response) {
    try {
      const { outlet_id, items, order_type, payment_method } = req.body;

      let totalPrice = 0;
      const processedItems = [];

      for (const item of items) {
        const product = await ProductModel.getById(item.product_id);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.product_id} not found` });
        }

        const itemTotal = product.price * item.quantity;
        totalPrice += itemTotal;
        processedItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
          notes: item.notes,
        });
      }

      const orderId = uuidv4();
      const order = {
        id: orderId,
        customer_id: req.user!.id,
        outlet_id,
        total_price: totalPrice,
        order_type, // 'dine_in', 'takeaway', 'delivery', 'whatsapp'
        payment_method,
        status: 'pending' as const,
        payment_status: 'unpaid' as const,
        created_at: new Date(),
      };

      await OrderModel.create(order);
      await OrderModel.addOrderItems(orderId, processedItems);

      // Calculate and add loyalty points
      const points = calculateLoyaltyPoints(totalPrice);
      if (points > 0) {
        await LoyaltyModel.addPoints(req.user!.id, orderId, points);
      }

      res.status(201).json({
        message: 'Order placed successfully',
        order: {
          id: orderId,
          total_price: totalPrice,
          loyalty_points_earned: points,
        },
      });
    } catch (error) {
      console.error('Place order error:', error);
      res.status(500).json({ message: 'Failed to place order' });
    }
  }

  static async getMyOrders(req: AuthRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const [orderRows] = await Promise.all([
        // This is a simplified version, in production you'd use a proper query
        OrderModel.findByOutletId('default', limit, offset),
      ]);

      res.status(200).json(orderRows);
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ message: 'Failed to get orders' });
    }
  }

  static async getLoyaltyPoints(req: AuthRequest, res: Response) {
    try {
      const points = await UserModel.getLoyaltyPoints(req.user!.id);
      const vouchers = await LoyaltyModel.getAvailableVouchers(points);

      res.status(200).json({
        loyalty_points: points,
        available_vouchers: vouchers,
      });
    } catch (error) {
      console.error('Get loyalty points error:', error);
      res.status(500).json({ message: 'Failed to get loyalty points' });
    }
  }

  static async redeemVoucher(req: AuthRequest, res: Response) {
    try {
      const { voucher_id, points_to_use } = req.body;

      const voucher = await LoyaltyModel.getVoucherById(voucher_id);
      if (!voucher) {
        return res.status(404).json({ message: 'Voucher not found' });
      }

      const userPoints = await UserModel.getLoyaltyPoints(req.user!.id);
      if (userPoints < points_to_use) {
        return res.status(400).json({ message: 'Insufficient loyalty points' });
      }

      await LoyaltyModel.redeemPoints(req.user!.id, voucher_id, points_to_use);

      res.status(200).json({
        message: 'Voucher redeemed successfully',
        discount: voucher.discount_amount || voucher.discount_percentage,
      });
    } catch (error) {
      console.error('Redeem voucher error:', error);
      res.status(500).json({ message: 'Failed to redeem voucher' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await UserModel.findById(req.user!.id);
      const loyaltyPoints = await UserModel.getLoyaltyPoints(req.user!.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        ...user,
        loyalty_points: loyaltyPoints,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Failed to get profile' });
    }
  }
}
