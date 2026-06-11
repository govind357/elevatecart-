import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'ecommerce_secret';

export interface JwtPayloadData {
  userId: string;
  role: string;
}

const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : req.cookies?.token;

    if (!token && !req.session?.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    let user;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadData;
      user = await User.findById(decoded.userId).select('-password');
      if (user && req.session) {
        req.session.userId = user.id;
        req.session.role = user.role;
      }
    } else if (req.session?.userId) {
      user = await User.findById(req.session.userId).select('-password');
    }

    if (!user || user.isBlocked) {
      res.status(401).json({ message: 'Invalid credentials or account blocked' });
      return;
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: (error as Error).message });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin authorization required' });
    return;
  }

  next();
};

export default protect;
