import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import paymentsRouter from './src/routes/payments.js';
import shiprocketRouter from './src/routes/shiprocket.js';
import ordersRouter from './src/routes/orders.js';
import usersRouter from './src/routes/users.js';
import productsRouter from './src/routes/products.js';
import subscribersRouter from './src/routes/subscribers.js';
import reviewsRouter from './src/routes/reviews.js';

dotenv.config();

const app = express();
app.use(cors());
// Increase body size limit to 10MB (to handle base64 images)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'organvi';

mongoose
  .connect(mongoUri, { dbName })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

app.get('/', (_req, res) => res.json({ status: 'ok' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Mount routes (backwards-compatible paths kept)
app.use('/', paymentsRouter); // /create-order, /verify-payment
app.use('/', shiprocketRouter); // /shiprocket-token, /create-shipment, /track-shipment/:id, /shipment-details/:orderId, /cancel-order/:orderId
app.use('/', ordersRouter); // /orders... (optional)
app.use('/api/users', usersRouter); // /api/users/login-mobile
app.use('/api/products', productsRouter); // /api/products
app.use('/api/subscribers', subscribersRouter); // /api/subscribers/subscribe, /api/subscribers
app.use('/api/reviews', reviewsRouter); // /api/reviews/submit, /api/reviews/product/:productId, /api/reviews/all
console.log('Subscribers routes registered at /api/subscribers');
console.log('Reviews routes registered at /api/reviews');

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on port ${port}`));


