import express from 'express';
import type { Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AdminController } from '../controllers/AdminController';
import { CustomerController } from '../controllers/CustomerController';
import { BillController } from '../controllers/BillController';
import { verifyToken, verifyAdmin, verifyCustomer } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Auth Routes
router.post('/auth/register/admin', AuthController.registerAdmin);
router.post('/auth/register/customer', AuthController.registerCustomer);
router.post('/auth/login', AuthController.login);
router.get('/auth/profile', verifyToken, AuthController.getProfile);

// Admin Routes
router.get('/admin/dashboard', verifyToken, verifyAdmin, AdminController.getDashboard);
router.get('/admin/orders', verifyToken, verifyAdmin, AdminController.getOrders);
router.get('/admin/orders/:order_id', verifyToken, verifyAdmin, AdminController.getOrderDetails);
router.put('/admin/orders/:order_id/status', verifyToken, verifyAdmin, AdminController.updateOrderStatus);
router.post('/admin/bills/generate', verifyToken, verifyAdmin, AdminController.generateBill);
router.post('/admin/bills/send-whatsapp', verifyToken, verifyAdmin, AdminController.sendBillWhatsapp);
router.get('/admin/financial/report', verifyToken, verifyAdmin, AdminController.getFinancialReport);
router.get('/admin/financial/history', verifyToken, verifyAdmin, AdminController.getFinancialHistory);
router.post('/admin/financial/expense', verifyToken, verifyAdmin, AdminController.addExpense);

// Customer Routes
router.post('/customer/orders/place', verifyToken, verifyCustomer, CustomerController.placeOrder);
router.get('/customer/orders', verifyToken, verifyCustomer, CustomerController.getMyOrders);
router.get('/customer/loyalty', verifyToken, verifyCustomer, CustomerController.getLoyaltyPoints);
router.post('/customer/loyalty/redeem', verifyToken, verifyCustomer, CustomerController.redeemVoucher);
router.get('/customer/profile', verifyToken, verifyCustomer, CustomerController.getProfile);

// Bill Routes
router.post('/bills/verify', BillController.verifyBill);
router.post('/bills/redeem', BillController.redeemBill);
router.get('/bills/:order_id', BillController.getBillDetails);

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

export default router;
