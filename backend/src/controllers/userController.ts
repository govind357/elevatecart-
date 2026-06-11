import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Order from '../models/Order.js';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id).select('-password');

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json({ user });
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();
  res.status(200).json({ message: 'Profile updated', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const { currentPassword, newPassword } = req.body;
  const matches = await bcrypt.compare(currentPassword, user.password);

  if (!matches) {
    res.status(401).json({ message: 'Current password is incorrect' });
    return;
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.status(200).json({ message: 'Password changed successfully' });
};

export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  const orders = await Order.find({ user: req.user?.id }).populate('items.product', 'name price');
  res.status(200).json({ orders });
};

export const getAddresses = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id).select('addresses');
  res.status(200).json({ addresses: user?.addresses ?? [] });
};

export const addAddress = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ message: 'Address added', address: user.addresses.at(-1) });
};

export const updateAddress = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404).json({ message: 'Address not found' });
    return;
  }

  address.set(req.body);
  await user.save();
  res.status(200).json({ message: 'Address updated', address });
};

export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404).json({ message: 'Address not found' });
    return;
  }

  address.remove();
  await user.save();
  res.status(200).json({ message: 'Address deleted' });
};
