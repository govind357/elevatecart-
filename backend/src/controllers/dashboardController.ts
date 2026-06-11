import { Request, Response } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

export const dashboardSummary = async (_req: Request, res: Response): Promise<void> => {
  const userCount = await User.countDocuments();
  const productCount = await Product.countDocuments();
  const orderCount = await Order.countDocuments();
  const revenueResult = await Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$amount' } } }]);

  res.status(200).json({
    userCount,
    productCount,
    orderCount,
    totalRevenue: revenueResult[0]?.totalRevenue ?? 0,
  });
};

export const pendingOrdersCount = async (_req: Request, res: Response): Promise<void> => {
  const pendingOrders = await Order.countDocuments({ status: { $in: ['pending', 'processing'] } });
  res.status(200).json({ pendingOrders });
};

export const salesByCategory = async (_req: Request, res: Response): Promise<void> => {
  const sales = await Order.aggregate([
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $lookup: {
        from: 'categories',
        localField: 'product.category',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $group: {
        _id: '$category._id',
        categoryName: { $first: '$category.name' },
        totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
      },
    },
    { $sort: { totalSales: -1 } },
  ]);

  res.status(200).json({ sales });
};

export const recentOrders = async (_req: Request, res: Response): Promise<void> => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name email')
    .populate('items.product', 'name price');

  res.status(200).json({ orders });
};

export const topSellingProducts = async (_req: Request, res: Response): Promise<void> => {
  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' } } },
    { $sort: { totalSold: -1 } },
    { $limit: 8 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    { $project: { totalSold: 1, 'product.name': 1, 'product.price': 1 } },
  ]);

  res.status(200).json({ topProducts });
};
