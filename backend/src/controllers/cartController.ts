import { Request, Response } from 'express';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const findOrCreateCart = async (userId: string) => {
  const existing = await Cart.findOne({ user: userId });
  if (existing) return existing;
  return Cart.create({ user: userId, items: [] });
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const cart = await findOrCreateCart(req.user?.id!);
  await cart.populate('items.product', 'name price stock description images');
  res.status(200).json({ cart });
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    res.status(404).json({ message: 'Product not found or inactive' });
    return;
  }

  if (quantity <= 0) {
    res.status(400).json({ message: 'Quantity must be greater than zero' });
    return;
  }

  const cart = await findOrCreateCart(req.user?.id!);
  const item = cart.items.find((item: { product: { toString: () => string }; quantity: number }) =>
    item.product.toString() === productId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({ product: product._id, quantity });
  }

  await cart.save();
  await cart.populate('items.product', 'name price stock description images');
  res.status(200).json({ message: 'Cart updated', cart });
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  const { quantity } = req.body;
  const cart = await findOrCreateCart(req.user?.id!);
  const item = cart.items.find((item: { product: { toString: () => string }; quantity: number }) =>
    item.product.toString() === req.params.productId
  );

  if (!item) {
    res.status(404).json({ message: 'Cart item not found' });
    return;
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(
    (cartItem: { product: { toString: () => string }; quantity: number }) =>
      cartItem.product.toString() !== req.params.productId
  );
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product', 'name price stock description images');
  res.status(200).json({ message: 'Cart updated', cart });
};

export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  const cart = await findOrCreateCart(req.user?.id!);
  cart.items = cart.items.filter(
    (item: { product: { toString: () => string }; quantity: number }) =>
      item.product.toString() !== req.params.productId
  );

  await cart.save();
  await cart.populate('items.product', 'name price stock description images');
  res.status(200).json({ message: 'Item removed from cart', cart });
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  const cart = await findOrCreateCart(req.user?.id!);
  cart.items = [];
  await cart.save();
  res.status(200).json({ message: 'Cart cleared', cart });
};

export const checkoutCart = async (req: Request, res: Response): Promise<void> => {
  const { shippingAddress, paymentMethod } = req.body;
  const cart = await Cart.findOne({ user: req.user?.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400).json({ message: 'Cart is empty' });
    return;
  }

  const orderItems = await Promise.all(
    cart.items.map(async (item: { product: string; quantity: number }) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error('One or more products in this order do not exist');
      }
      if (product.stock < item.quantity) {
        throw new Error(`Product ${product.name} does not have enough stock`);
      }

      product.stock -= item.quantity;
      await product.save();

      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  const amount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({
    user: req.user?.id,
    items: orderItems,
    shippingAddress,
    amount,
    paymentMethod,
    paymentStatus: 'pending',
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({ message: 'Checkout completed', order });
};
