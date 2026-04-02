import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/UserModel';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export class AuthController {
  static async registerAdmin(req: AuthRequest, res: Response) {
    try {
      const { email, password, name, phone, outlet_id } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const userId = uuidv4();
      const hashedPassword = await hashPassword(password);

      const user = {
        id: userId,
        email,
        password: hashedPassword,
        name,
        role: 'admin' as const,
        phone,
      };

      await UserModel.create(user);

      const token = generateToken(userId, email, 'admin');
      res.status(201).json({
        message: 'Admin registered successfully',
        token,
        user: { id: userId, email, name, role: 'admin' },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  }

  static async registerCustomer(req: AuthRequest, res: Response) {
    try {
      const { email, password, name, phone } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const userId = uuidv4();
      const hashedPassword = await hashPassword(password);

      const user = {
        id: userId,
        email,
        password: hashedPassword,
        name,
        role: 'customer' as const,
        phone,
      };

      await UserModel.create(user);

      const token = generateToken(userId, email, 'customer');
      res.status(201).json({
        message: 'Customer registered successfully',
        token,
        user: { id: userId, email, name, role: 'customer', loyalty_points: 0 },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  }

  static async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const passwordMatch = await comparePassword(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = generateToken(user.id, user.email, user.role);
      res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await UserModel.findById(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Failed to get profile' });
    }
  }
}
