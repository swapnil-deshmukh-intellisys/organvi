import express from 'express';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const emailLower = email.trim().toLowerCase();
    
    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email: emailLower });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(200).json({ 
          message: 'You are already subscribed to our newsletter!',
          subscriber: existingSubscriber 
        });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();
        return res.status(200).json({ 
          message: 'Welcome back! Your subscription has been reactivated.',
          subscriber: existingSubscriber 
        });
      }
    }
    
    // Create new subscriber
    const subscriber = new Subscriber({
      email: emailLower,
      isActive: true
    });
    
    await subscriber.save();
    
    console.log('New subscriber added:', emailLower);
    res.status(201).json({ 
      message: 'Successfully subscribed to newsletter!',
      subscriber 
    });
  } catch (err) {
    console.error('Subscription error:', err);
    if (err.code === 11000) {
      // Duplicate key error (email already exists)
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

// Test route to verify subscribers router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Subscribers route is working!' });
});

// Get all subscribers (for admin panel)
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .lean();
    
    res.json({ subscribers, count: subscribers.length });
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Get all subscribers including inactive (for admin panel)
router.get('/all', async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
      .sort({ subscribedAt: -1 })
      .lean();
    
    res.json({ subscribers, count: subscribers.length });
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Unsubscribe (optional - can be used later)
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const emailLower = email.trim().toLowerCase();
    const subscriber = await Subscriber.findOne({ email: emailLower });
    
    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }
    
    subscriber.isActive = false;
    await subscriber.save();
    
    res.json({ message: 'Successfully unsubscribed', subscriber });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export default router;

