import express from 'express';
import Razorpay from 'razorpay';

const router = express.Router();

// Lazy initialization - only create Razorpay instance when needed
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file');
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

router.post('/create-order', async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id } = req.body;
    res.json({ success: true, message: 'Payment verified successfully', orderId: razorpay_order_id, paymentId: razorpay_payment_id });
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

export default router;


