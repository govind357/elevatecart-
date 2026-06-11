import { IUser } from '../../models/User.js';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    role?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: Partial<IUser> & { id: string; role: string };
    }
  }
}
