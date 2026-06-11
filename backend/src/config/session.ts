import session from 'express-session';
import MongoStore from 'connect-mongo';

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not defined');
}

const createSessionMiddleware = (): import('express').RequestHandler => {
  const store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/ecommerce-backend',
    collectionName: 'sessions',
  });

  return session({
    secret: SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  });
};

export default createSessionMiddleware;
