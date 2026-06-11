import { Request, Response } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { items, shippingAddress, paymentMethod } = req.body;

  const orderItems = await Promise.all(
    items.map(async (item: { product: string; quantity: number }) => {
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

  const amount = orderItems.reduce((sum: number, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user: req.user?.id,
    items: orderItems,
    shippingAddress,
    amount,
    paymentMethod,
    paymentStatus: 'pending',
  });

  res.status(201).json({ message: 'Order placed', order });
};

export const updateOrderPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  const { paymentStatus, transactionId } = req.body;
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid') {
      order.paidAt = new Date();
    }
  }

  if (transactionId) {
    order.transactionId = transactionId;
  }

  await order.save();
  res.status(200).json({ message: 'Payment status updated', order });
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const order = await Order.findById(req.params.orderId)
    .populate('user', 'name email')
    .populate('items.product', 'name price');

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  if (order.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  res.status(200).json({ order });
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const orders = req.user?.role === 'admin'
    ? await Order.find().populate('user', 'name email').populate('items.product', 'name price')
    : await Order.find({ user: req.user?.id }).populate('items.product', 'name price');

  res.status(200).json({ orders });
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  const { status } = req.body;
  order.status = status;
  await order.save();

  res.status(200).json({ message: 'Order status updated', order });
};

export const getOrderInvoice = async (req: Request, res: Response): Promise<void> => {
  const order = await Order.findById(req.params.orderId)
    .populate('user', 'name email')
    .populate('items.product', 'name price');

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  if (order.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  const items = order.items.map((item: { product: any; price: number; quantity: number }) => ({
    name: item.product?.name ?? 'Product',
    unitPrice: item.price,
    quantity: item.quantity,
    total: item.quantity * item.price,
  }));
  const tax = Number((order.amount * 0.05).toFixed(2));
  const total = Number((order.amount + tax).toFixed(2));

  const invoice = {
    invoiceNumber: `INV-${order.id.slice(-8).toUpperCase()}`,
    orderId: order.id,
    customer: {
      name: (order.user as any).name,
      email: (order.user as any).email,
    },
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    items,
    subtotal: order.amount,
    tax,
    total,
    issuedAt: order.createdAt,
  };

  res.status(200).json({ invoice });
};
