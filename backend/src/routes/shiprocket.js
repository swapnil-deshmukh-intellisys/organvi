import express from 'express';
import axios from 'axios';
import User from '../models/User.js';

const router = express.Router();

let shipToken = '';

router.get('/shiprocket-token', async (_req, res) => {
  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    });
    shipToken = response.data.token;
    res.json({ token: shipToken, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create-shipment', async (req, res) => {
  try {
    if (!shipToken) {
      const tokenResponse = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      });
      shipToken = tokenResponse.data.token;
    }

    const orderData = req.body;

    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      orderData,
      { headers: { Authorization: `Bearer ${shipToken}`, 'Content-Type': 'application/json' } }
    );

    // Persist order in user's orders array
    try {
      const userMobile = orderData.userId || orderData.userMobile;
      if (userMobile) {
        const digits = String(userMobile).replace(/\D/g, '');
        const orderToSave = {
          orderId: orderData.order_id,
          items: (orderData.order_items || []).map(i => ({
            name: i.name,
            sku: i.sku,
            units: i.units || i.quantity || 1,
            quantity: i.quantity || i.units || 1,
            selling_price: Number(i.selling_price || i.price || 0),
            price: Number(i.selling_price || i.price || 0),
            image: i.image,
            weight: i.weight
          })),
          paymentId: orderData.paymentId,
          shipmentId: response.data?.data?.shipment_id || response.data?.shipment_id,
          status: 'Payment Completed',
          trackingDetails: [{ status: 'Payment Completed', timestamp: new Date(), location: '' }],
          customerDetails: orderData.customerDetails || {},
          shippingAddress: orderData.shippingAddress || {},
          totalAmount: orderData.totalAmount || 0,
          paymentMethod: orderData.paymentMethod || 'razorpay',
          orderDate: new Date()
        };

        await User.findOneAndUpdate(
          { mobile: digits },
          { $push: { orders: orderToSave } },
          { new: true }
        );
      }
    } catch (err) {
      console.error('Failed to save order to user:', err);
    }

    res.json({ success: true, shipment: response.data, message: 'Shipment created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Shipment creation failed', details: err.response?.data || err.message });
  }
});

router.get('/track-shipment/:shipmentId', async (req, res) => {
  try {
    if (!shipToken) return res.status(400).json({ error: 'Shiprocket token missing' });
    const { shipmentId } = req.params;
    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`,
      { headers: { Authorization: `Bearer ${shipToken}` } }
    );
    res.json({ success: true, tracking: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Tracking failed', details: err.response?.data || err.message });
  }
});

router.get('/shipment-details/:orderId', async (req, res) => {
  try {
    if (!shipToken) return res.status(400).json({ error: 'Shiprocket token missing' });
    const { orderId } = req.params;
    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`,
      { headers: { Authorization: `Bearer ${shipToken}` } }
    );
    res.json({ success: true, order: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order details', details: err.response?.data || err.message });
  }
});

router.post('/cancel-order/:orderId', async (req, res) => {
  try {
    const { reason, userMobile } = req.body || {};
    const orderId = req.params.orderId;
    
    if (!userMobile) {
      return res.status(400).json({ error: 'User mobile required' });
    }

    const digits = String(userMobile).replace(/\D/g, '');
    const user = await User.findOne({ mobile: digits });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const orderIndex = user.orders.findIndex(o => o.orderId === orderId);
    if (orderIndex === -1) return res.status(404).json({ error: 'Order not found' });
    
    const order = user.orders[orderIndex];
    if (order.status === 'Delivered') {
      return res.status(400).json({ error: 'Cannot cancel delivered order' });
    }
    
    user.orders[orderIndex].status = 'Cancelled';
    user.orders[orderIndex].cancelReason = reason || 'No reason provided';
    user.orders[orderIndex].cancelledAt = new Date();
    
    await user.save();
    res.json(user.orders[orderIndex]);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;


