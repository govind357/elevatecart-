// import { Request, Response } from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const JWT_SECRET = process.env.JWT_SECRET ?? 'ecommerce_secret';
// const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN ?? '7d';

// const generateToken = (userId: string, role: string): string => {
//   return jwt.sign({ userId, role }, JWT_SECRET as jwt.Secret, {
//     expiresIn: TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
//   });
// };

// export const register = async (req: Request, res: Response): Promise<void> => {
//   const { name, email, password } = req.body;
//   console.log('Registration attempt:', email); 
//   const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     res.status(400).json({ message: 'Email already registered' });
//     return;
//   }

//   const hashedPassword = await bcrypt.hash(password, 12);
//   const user = await User.create({ name, email, password: hashedPassword });

//   if (req.session) {
//     req.session.userId = user.id;
//     req.session.role = user.role;
//   }
//   const token = generateToken(user.id, user.role);
//   res.status(201).json({
//     message: 'Registration successful',
//     user: { id: user.id, name: user.name, email: user.email, role: user.role },
//     token,
//   });
// };

// export const login = async (req: Request, res: Response): Promise<void> => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
// console.log('Login attempt:', email); 

//   if (!user) {
//     res.status(401).json({ message: 'Invalid email or password' });
//     return;
//   }

//   const passwordMatches = await bcrypt.compare(password, user.password);

//   if (!passwordMatches) {
//     res.status(401).json({ message: 'Invalid email or password' });
//     return;
//   }

//   if (user.isBlocked) {
//     res.status(403).json({ message: 'Account blocked by administrator' });
//     return;
//   }

//   if (req.session) {
//     req.session.userId = user.id;
//     req.session.role = user.role;
//   }

//   const token = generateToken(user.id, user.role);
//   res.status(200).json({
//     message: 'Login successful',
//     user: { id: user.id, name: user.name, email: user.email, role: user.role },
//     token,
//   });
// };

// export const logout = (req: Request, res: Response): void => {
//   if (req.session) {
//     req.session.destroy(() => {});
//   }
//   res.clearCookie('token');
//   res.status(200).json({ message: 'Logout successful' });
// };
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'ecommerce_secret';
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN ?? '7d';

const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET as jwt.Secret,
    {
      expiresIn: TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    }
  );
};

/**
 * Register User
 */
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    console.log('Registration attempt:', email);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        message: 'Email already registered',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      otp,
      otpExpiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });

    await sendOtpEmail(email, otp);

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email',
      email,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Registration failed',
    });
  }
};

/**
 * Verify OTP
 */
export const verifyOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }

    if (
      user.otp !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      res.status(400).json({
        message: 'Invalid or expired OTP',
      });
      return;
    }

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'OTP verification failed',
    });
  }
};

/**
 * Login
 */
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: 'Invalid email or password',
      });
      return;
    }

    if (!user.emailVerified) {
      res.status(403).json({
        message: 'Please verify your email first',
      });
      return;
    }

    if (user.isBlocked) {
      res.status(403).json({
        message: 'Account blocked by administrator',
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      res.status(401).json({
        message: 'Invalid email or password',
      });
      return;
    }

    if (req.session) {
      req.session.userId = user.id;
      req.session.role = user.role;
    }

    const token = generateToken(
      user.id,
      user.role
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Login failed',
    });
  }
};

/**
 * Logout
 */
export const logout = (
  req: Request,
  res: Response
): void => {
  if (req.session) {
    req.session.destroy(() => {});
  }

  res.clearCookie('token');

  res.status(200).json({
    message: 'Logout successful',
  });
};