import { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

const findCategory = async (category: string) => {
  const categoryValue = String(category ?? '').trim();

  if (!categoryValue) {
    return null;
  }

  if (mongoose.Types.ObjectId.isValid(categoryValue)) {
    return Category.findById(categoryValue);
  }

  return Category.findOne({ slug: categoryValue });
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, category, stock, images } = req.body;
  const foundCategory = await findCategory(category);

  if (!foundCategory) {
    res.status(400).json({ message: 'Category not found' });
    return;
  }

  const product = await Product.create({
    name,
    description,
    price,
    category: foundCategory._id,
    stock: stock ?? 0,
    images: images ?? [],
  });

  res.status(201).json({ message: 'Product created', product });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const { name, description, price, category, stock, images, isActive } = req.body;

  if (category) {
    const foundCategory = await findCategory(category);
    if (!foundCategory) {
      res.status(400).json({ message: 'Category not found' });
      return;
    }
    product.category = foundCategory._id;
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (images) product.images = images;
  if (isActive !== undefined) product.isActive = isActive;

  await product.save();
  res.status(200).json({ message: 'Product updated', product });
};



export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await Product.findById(
    req.params.productId
  );

  if (!product) {
    res.status(404).json({
      message: 'Product not found'
    });
    return;
  }

  for (const imageUrl of product.images) {
    try {
      const fileName =
        imageUrl.split('/').pop();

      if (!fileName) continue;

      const filePath = path.join(
        process.cwd(),
        'uploads',
        'products',
        fileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(
          `Deleted image: ${fileName}`
        );
      }
    } catch (error) {
      console.error(
        'Image delete error:',
        error
      );
    }
  }

  await Product.findByIdAndDelete(
    req.params.productId
  );

  res.status(200).json({
    message: 'Product deleted successfully'
  });
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findById(req.params.productId).populate('category', 'name slug');

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  res.status(200).json({ product });
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(Number(req.query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit ?? 20), 1), 100);
  const search = req.query.q ? String(req.query.q).trim() : '';
  const categoryQuery = req.query.category ? String(req.query.category).trim() : '';
  
  const sortBy: { [key: string]: 1 | -1 } =
    req.query.sort === 'price_asc'
      ? { price: 1 }
      : req.query.sort === 'price_desc'
      ? { price: -1 }
      : { createdAt: -1 };

  const filters: { [key: string]: unknown } = { isActive: true };

  if (req.query.admin === 'true') {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : req.cookies?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'ecommerce_secret') as any;
        if (decoded) {
          let isAdmin = decoded.role === 'admin';
          if (!isAdmin && decoded.userId) {
            const user = await User.findById(decoded.userId);
            if (user && user.role === 'admin') {
              isAdmin = true;
            }
          }
          if (isAdmin) {
            delete filters.isActive;
          }
        }
      } catch (err) {
        // Keep isActive: true
      }
    }
  }

  if (search) {
    filters.name = { $regex: search, $options: 'i' };
  }

  if (categoryQuery) {
    if (mongoose.Types.ObjectId.isValid(categoryQuery)) {
      filters.category = categoryQuery;
    } else {
      const category = await Category.findOne({ slug: categoryQuery });
      if (category) {
        filters.category = category._id;
      } else {
        filters.category = null;
      }
    }
  }

  const total = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .populate('category', 'name slug')
    .sort(sortBy)
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    products,
  });
};

export const uploadProductImages = async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    res.status(400).json({ message: 'No images uploaded' });
    return;
  }

  const fileUrls = files.map(
  (file) => file.filename
);
  product.images = [...product.images, ...fileUrls];
  await product.save();

  res.status(200).json({ message: 'Images uploaded', images: product.images });
};

export const addReview = async (req: Request, res: Response): Promise<void> => {
  const { rating, title, comment } = req.body;
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const purchased = await Order.exists({ user: req.user?.id, 'items.product': product._id });
  if (!purchased) {
    res.status(403).json({ message: 'You can only review products you have purchased' });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ message: 'Rating must be between 1 and 5' });
    return;
  }

  const review = await Review.create({
    product: product._id,
    user: req.user?.id,
    rating,
    title,
    comment,
    status: 'pending',
  });

  res.status(201).json({ message: 'Review submitted and awaiting moderation', review });
};

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  const reviews = await Review.find({ product: req.params.productId, status: 'approved' })
    .sort({ createdAt: -1 })
    .populate('user', 'name');

  res.status(200).json({ reviews });
};
