import { Request, Response, NextFunction } from 'express';

const requireSession = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : undefined;

  if (req.session?.userId || token) {
    next();
    return;
  }

  res.status(401).json({ message: 'Session required for access' });
};

export default requireSession;
