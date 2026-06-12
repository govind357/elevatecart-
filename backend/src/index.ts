import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import {apiLimiter} from './middleware/rateLimitMiddleware.js';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDatabase from './config/database.js';
import createSessionMiddleware from './config/session.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';
import { seedDatabase } from './config/seeder.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);
await connectDatabase();
await seedDatabase();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];
if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(...process.env.FRONTEND_ORIGIN.split(','));
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(createSessionMiddleware());
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Ecommerce backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
