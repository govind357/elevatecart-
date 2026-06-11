import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts. Try again later.'
  }});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
   message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  }
});