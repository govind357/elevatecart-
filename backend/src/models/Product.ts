import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  stock: number;
  images: string[];
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    stock: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true, index: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5, index: true },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
export default Product;
