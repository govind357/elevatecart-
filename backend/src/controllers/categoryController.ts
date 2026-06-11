import { Request, Response } from 'express';
import Category from '../models/Category.js';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({ categories });
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }

  res.status(200).json({ category });
};
