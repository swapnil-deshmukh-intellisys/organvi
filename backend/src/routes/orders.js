import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/orders', async (req, res) => {
  try {
    const userMobile = req.query.userMobile || req.body.userMobile;
    if (!userMobile) {
      return res.status(400).json({ error: 'User mobile required' });
    }
    
    const digits = String(userMobile).replace(/\D/g, '');
    const user = await User.findOne({ mobile: digits }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const orders = (user.orders || []).sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const userMobile = req.query.userMobile || req.body.userMobile;
    if (!userMobile) {
      return res.status(400).json({ error: 'User mobile required' });
    }
    
    const digits = String(userMobile).replace(/\D/g, '');
    const user = await User.findOne({ mobile: digits }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const order = (user.orders || []).find(o => o.orderId === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, userMobile } = req.body;
    if (!userMobile) {
      return res.status(400).json({ error: 'User mobile required' });
    }
    
    const digits = String(userMobile).replace(/\D/g, '');
    const user = await User.findOne({ mobile: digits });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const orderIndex = user.orders.findIndex(o => o.orderId === req.params.id);
    if (orderIndex === -1) return res.status(404).json({ error: 'Order not found' });
    
    user.orders[orderIndex].status = status;
    await user.save();
    
    res.json({ success: true, order: user.orders[orderIndex] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

router.get('/orders/status/:status', async (req, res) => {
  try {
    const userMobile = req.query.userMobile || req.body.userMobile;
    if (!userMobile) {
      return res.status(400).json({ error: 'User mobile required' });
    }
    
    const digits = String(userMobile).replace(/\D/g, '');
    const user = await User.findOne({ mobile: digits }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const filteredOrders = (user.orders || []).filter(o => o.status === req.params.status);
    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders by status' });
  }
});

router.get('/orders/search/:query', async (req, res) => {
  try {
    const userMobile = req.query.userMobile || req.body.userMobile;
    if (!userMobile) {
      return res.status(400).json({ error: 'User mobile required' });
    }
    
    const digits = String(userMobile).replace(/\D/g, '');
    const user = await User.findOne({ mobile: digits }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const q = String(req.params.query || '').toLowerCase();
    const results = (user.orders || []).filter(order => 
      order.orderId?.toLowerCase().includes(q) ||
      order.items?.some(item => item.name?.toLowerCase().includes(q))
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search orders' });
  }
});

router.get('/orders/stats', async (req, res) => {
  try {
    const userMobile = req.query.userMobile || req.body.userMobile;
    if (!userMobile) {
      return res.status(400).json({ error: 'User mobile required' });
    }
    
    const digits = String(userMobile).replace(/\D/g, '');
    const user = await User.findOne({ mobile: digits }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const orders = user.orders || [];
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      ordersByStatus: orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {})
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

export default router;


