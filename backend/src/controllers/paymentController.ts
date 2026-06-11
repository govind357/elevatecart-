// Payment controller - Razorpay integration
// This file contains the server-side helpers for creating Razorpay orders and
// verifying payment signatures returned by the Razorpay checkout flow.
//
// Notes:
// - Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your environment.
// - `createRazorpayOrder` will create an internal Order (in MongoDB) and then
//   create a corresponding Razorpay order. The frontend then uses the
//   Razorpay checkout widget to complete the payment.
// - `verifyRazorpayPayment` verifies the HMAC signature sent by Razorpay
//   and marks the internal order as paid when valid.

import crypto from 'crypto';
import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? '';

// If keys are not provided we disable live Razorpay calls and run in demo mode.
const RAZORPAY_DISABLED = !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET;

// Only initialize the Razorpay client when keys are available. When disabled,
// we will return demo/fake razorpayOrder objects so the app can continue to
// operate without reaching out to Razorpay.
let razorpay: any = null;
if (!RAZORPAY_DISABLED) {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

/**
 * Create a Razorpay order for the current user's cart.
 * Steps:
 * 1. Validate request body and ensure there is a non-empty cart.
 * 2. Reserve stock by decrementing product stock counts.
 * 3. Create an internal Order document with paymentStatus='pending'.
 * 4. Create a Razorpay order (amount in paise) and return it to the client.
 */
export const createRazorpayOrder = async (req: Request, res: Response): Promise<void> => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    res.status(400).json({ message: 'Missing shipping address or payment method' });
    return;
  }

  // Load user's cart and ensure it's not empty
  const cart = await Cart.findOne({ user: req.user?.id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400).json({ message: 'Cart is empty' });
    return;
  }

  // Build order items and update stock for each product
  const orderItems = await Promise.all(
    cart.items.map(async (item: { product: any; quantity: number }) => {
      const productId = item.product && typeof item.product === 'object' ? item.product._id : item.product;
      const product = await Product.findById(productId);
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

  // Create internal order record (payment pending)
  const order = await Order.create({
    user: req.user?.id,
    items: orderItems,
    shippingAddress,
    amount,
    paymentMethod,
    paymentStatus: 'pending',
    status: 'pending',
  });

  // Create Razorpay order (amount in smallest currency unit: paise)
  let razorpayOrder: any;
  if (razorpay) {
    // Live mode: create order on Razorpay
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: order.id,
      payment_capture: 1,
      notes: {
        orderId: order.id,
        userId: String(req.user?.id),
      },
    });
  } else {
    // Demo mode: do not call external API, return a fake order object
    razorpayOrder = {
      id: `order_demo_${order.id}`,
      entity: 'order',
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: order.id,
      status: 'created',
      attempts: 0,
      notes: {
        orderId: order.id,
        userId: String(req.user?.id),
      },
    };
  }

  res.status(201).json({
    message: 'Razorpay order created',
    order,
    razorpayOrder,
    keyId: RAZORPAY_KEY_ID,
    currency: 'INR',
  });
};

/**
 * Verify a Razorpay payment.
 * Razorpay returns `razorpay_payment_id`, `razorpay_order_id` and `razorpay_signature`.
 * We must verify the signature with our secret and then mark the internal
 * order as paid.
 */
export const verifyRazorpayPayment = async (req: Request, res: Response): Promise<void> => {
  // Accept an explicit `demo` flag to indicate simulated verification.
  // Body parameters:
  // - orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature
  // - demo (optional boolean) — when true, server will accept the payment
  //   without performing HMAC verification. This lets developers test the
  //   flow without Razorpay keys.
  const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature, demo } = req.body;

  if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    res.status(400).json({ message: 'Missing verification details' });
    return;
  }

  // If demo flag is true, accept without verifying signature.
  if (demo === true) {
    // proceed to mark order paid below
  } else {
    // In non-demo mode we must have configured Razorpay keys to verify.
    if (RAZORPAY_DISABLED) {
      res.status(503).json({ message: 'Razorpay not configured. Set demo=true to simulate verification in development.' });
      return;
    }

    // Perform HMAC verification using our secret
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      res.status(400).json({ message: 'Invalid Razorpay signature' });
      return;
    }
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  // Mark order as paid and clear the cart
  order.paymentStatus = 'paid';
  order.transactionId = razorpay_payment_id;
  order.paidAt = new Date();
  order.status = 'processing';
  await order.save();

  const cart = await Cart.findOne({ user: req.user?.id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({ message: 'Payment verified', order });
};

/**
 * Demo endpoint (no side-effects): returns a sample Razorpay order payload
 * and a small example of how the frontend would invoke the checkout.
 * This is useful during development to inspect the expected payloads.
 */
export const demoRazorpay = async (_req: Request, res: Response): Promise<void> => {
  // Example razorpayOrder shape (fields returned by Razorpay when creating an order)
  const exampleRazorpayOrder = {
    id: 'order_DBJOWzybf0sJbb',
    entity: 'order',
    amount: 19900,
    currency: 'INR',
    receipt: 'receipt#1',
    status: 'created',
    attempts: 0,
  };

  res.status(200).json({
    message: 'Razorpay demo payload',
    exampleRazorpayOrder,
    exampleFrontendSnippet: {
      description: 'Frontend should call the /api/payments/razorpay/order endpoint to create an order, then open the Razorpay checkout using the returned keyId and razorpayOrder.id.',
      sampleOptions: {
        key: 'RAZORPAY_KEY_ID_FROM_SERVER',
        amount: exampleRazorpayOrder.amount,
        currency: exampleRazorpayOrder.currency,
        order_id: exampleRazorpayOrder.id,
      },
    },
  });
};
