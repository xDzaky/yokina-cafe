import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.ts';
import { BillModel } from '../models/BillModel.ts';
import { OrderModel } from '../models/OrderModel.ts';

export class BillController {
  static async verifyBill(req: AuthRequest, res: Response) {
    try {
      const { bill_number, qr_code } = req.body;

      const bill = await BillModel.verifyBill(bill_number, qr_code);
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found or invalid' });
      }

      // Check if already used
      if (bill.status === 'used') {
        return res.status(400).json({ message: 'Bill has already been used' });
      }

      // Check if expired
      if (new Date(bill.valid_until) < new Date()) {
        return res.status(400).json({ message: 'Bill has expired' });
      }

      res.status(200).json({
        message: 'Bill verified successfully',
        bill,
      });
    } catch (error) {
      console.error('Verify bill error:', error);
      res.status(500).json({ message: 'Failed to verify bill' });
    }
  }

  static async redeemBill(req: AuthRequest, res: Response) {
    try {
      const { bill_id, bill_number, qr_code } = req.body;

      const bill = await BillModel.verifyBill(bill_number, qr_code);
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found or invalid' });
      }

      if (bill.status === 'used') {
        return res.status(400).json({ message: 'Bill has already been redeemed' });
      }

      await BillModel.markAsUsed(bill_id);

      res.status(200).json({
        message: 'Bill redeemed successfully',
      });
    } catch (error) {
      console.error('Redeem bill error:', error);
      res.status(500).json({ message: 'Failed to redeem bill' });
    }
  }

  static async getBillDetails(req: AuthRequest, res: Response) {
    try {
      const orderId = req.params.order_id;
      const bill = await BillModel.findByOrderId(orderId);

      if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
      }

      const order = await OrderModel.getOrderById(orderId);

      res.status(200).json({
        bill,
        order,
      });
    } catch (error) {
      console.error('Get bill details error:', error);
      res.status(500).json({ message: 'Failed to get bill details' });
    }
  }
}
