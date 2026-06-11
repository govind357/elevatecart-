import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { type UserRole } from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';

type AdminUserPayload = {
  id?: string;
  _id?: { toString(): string };
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
};

const toAdminUserResponse = (user: AdminUserPayload) => {
  const id = user.id ?? user._id?.toString();

  if (!id) {
    throw new Error('User document is missing an id');
  }

  return {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
  };
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).json({ message: 'Email already registered' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role === 'admin' ? 'admin' : 'user',
  });

  res.status(201).json({
    message: 'User created',
    user: toAdminUserResponse(user),
  });
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(Number(req.query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit ?? 5), 1), 100);

  const total = await User.countDocuments();

  const users = await User.find()
    .select('name email role isBlocked createdAt updatedAt')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    users: users.map(toAdminUserResponse),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
};
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const { role } = req.body;
  user.role = role;
  await user.save();

  res.status(200).json({
    message: 'User role updated',
    user: toAdminUserResponse(user),
  });
};

export const toggleUserBlock = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    message: user.isBlocked ? 'User blocked' : 'User unblocked',
    user: toAdminUserResponse(user),
  });
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, slug } = req.body;
  const existingCategory = await Category.findOne({ slug });

  if (existingCategory) {
    res.status(400).json({ message: 'Category slug already exists' });
    return;
  }

  const category = await Category.create({ name, slug });
  res.status(201).json({ message: 'Category created', category });
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const category = await Category.findByIdAndDelete(req.params.categoryId);

  if (!category) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }

  res.status(200).json({ message: 'Category deleted' });
};

export const getPendingReviews = async (_req: Request, res: Response): Promise<void> => {
  const reviews = await Review.find({ status: 'pending' })
    .populate('product', 'name')
    .populate('user', 'name email');

  res.status(200).json({ reviews });
};

export const approveReview = async (req: Request, res: Response): Promise<void> => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  if (review.status === 'approved') {
    res.status(400).json({ message: 'Review already approved' });
    return;
  }

  review.status = 'approved';
  await review.save();

  const product = await Product.findById(review.product);
  if (product) {
    product.reviewCount += 1;
    product.averageRating = Number(
      ((product.averageRating * (product.reviewCount - 1) + review.rating) / product.reviewCount).toFixed(2)
    );
    await product.save();
  }

  res.status(200).json({ message: 'Review approved', review });
};

export const rejectReview = async (req: Request, res: Response): Promise<void> => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  review.status = 'rejected';
  await review.save();
  res.status(200).json({ message: 'Review rejected', review });
};
