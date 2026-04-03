import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { AuthRequest } from '../middleware/auth';
import { OrderModel } from '../models/OrderModel';
import { BillModel } from '../models/BillModel';
import { FinancialModel } from '../models/FinancialModel';
import { generateBillNumber, generateQRCode, generateWhatsAppMessage } from '../utils/bill';

export class AdminController {
  static async getDashboard(req: AuthRequest, res: Response) {
    const outletId = (req.query.outlet_id as string) || 'default-outlet-id';

    const emptyResponse = {
      today: {
        date: new Date(),
        total_income: 0,
        total_expense: 0,
        net_profit: 0,
        order_count: 0,
      },
      monthly: {
        outlet_id: outletId,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        total_income: 0,
        total_expense: 0,
        net_profit: 0,
      },
    };

    try {
      const todayReport = await FinancialModel.getDailyReport(outletId, new Date());
      const monthlyReport = await FinancialModel.getMonthlyReport(
        outletId,
        new Date().getFullYear(),
        new Date().getMonth() + 1
      );

      res.status(200).json({
        today: todayReport || emptyResponse.today,
        monthly: monthlyReport || emptyResponse.monthly,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      // Keep dashboard accessible even if DB report queries fail.
      res.status(200).json(emptyResponse);
    }
  }

  static async getOrders(req: AuthRequest, res: Response) {
    try {
      const outletId = req.query.outlet_id as string;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const orders = await OrderModel.findByOutletId(outletId, limit, offset);
      res.status(200).json(orders);
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ message: 'Failed to get orders' });
    }
  }

  static async getOrderDetails(req: AuthRequest, res: Response) {
    try {
      const orderId = req.params.order_id;
      const order = await OrderModel.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error('Get order details error:', error);
      res.status(500).json({ message: 'Failed to get order details' });
    }
  }

  static async updateOrderStatus(req: AuthRequest, res: Response) {
    try {
      const orderId = req.params.order_id;
      const { status, payment_status } = req.body;

      await OrderModel.updateStatus(orderId, status, payment_status);
      res.status(200).json({ message: 'Order status updated' });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ message: 'Failed to update order status' });
    }
  }

  static async generateBill(req: AuthRequest, res: Response) {
    try {
      const { order_id } = req.body;

      const order = await OrderModel.getOrderById(order_id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const billNumber = generateBillNumber();
      const qrCode = await generateQRCode(billNumber, order_id);

      const bill = {
        id: uuidv4(),
        order_id,
        bill_number: billNumber,
        qr_code: qrCode,
        created_at: new Date(),
        valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
        status: 'active',
      };

      await BillModel.create(bill);

      res.status(201).json({
        message: 'Bill generated successfully',
        bill,
      });
    } catch (error) {
      console.error('Generate bill error:', error);
      res.status(500).json({ message: 'Failed to generate bill' });
    }
  }

  static async sendBillWhatsapp(req: AuthRequest, res: Response) {
    try {
      const { order_id, phone_number } = req.body;

      const order = await OrderModel.getOrderById(order_id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const bill = await BillModel.findByOrderId(order_id);
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
      }

      const message = generateWhatsAppMessage(bill.bill_number, order.total_price, order.items);

      // This is where you would integrate with WhatsApp API
      // For now, we'll just return a success response
      const whatsappLink = `https://wa.me/${phone_number}?text=${encodeURIComponent(message)}`;

      res.status(200).json({
        message: 'WhatsApp message generated',
        whatsapp_link: whatsappLink,
        message_text: message,
        bill: bill,
      });
    } catch (error) {
      console.error('Send WhatsApp bill error:', error);
      res.status(500).json({ message: 'Failed to send WhatsApp message' });
    }
  }

  static async getFinancialReport(req: AuthRequest, res: Response) {
    try {
      const outletId = req.query.outlet_id as string;
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

      const report = await FinancialModel.getMonthlyReport(outletId, year, month);
      res.status(200).json(report);
    } catch (error) {
      console.error('Get financial report error:', error);
      res.status(500).json({ message: 'Failed to get financial report' });
    }
  }

  static async getFinancialHistory(req: AuthRequest, res: Response) {
    try {
      const outletId = req.query.outlet_id as string;
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;

      const history = await FinancialModel.getFinancialHistory(outletId, limit, offset);
      res.status(200).json(history);
    } catch (error) {
      console.error('Get financial history error:', error);
      res.status(500).json({ message: 'Failed to get financial history' });
    }
  }

  static async addExpense(req: AuthRequest, res: Response) {
    try {
      const { outlet_id, category, amount, description, invoice_number } = req.body;

      const financial = {
        id: uuidv4(),
        outlet_id,
        type: 'expense' as const,
        category,
        amount,
        description,
        date: new Date(),
        invoice_number,
      };

      await FinancialModel.create(financial);
      res.status(201).json({ message: 'Expense added successfully' });
    } catch (error) {
      console.error('Add expense error:', error);
      res.status(500).json({ message: 'Failed to add expense' });
    }
  }
}
