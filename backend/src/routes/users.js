import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Login with email/mobile + password (for returning users)
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or mobile
    
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Mobile and password are required' });
    }
    
    // Check if identifier is email (contains @) or mobile (digits only)
    const isEmail = identifier.includes('@');
    let user;
    
    if (isEmail) {
      // Login with email
      const emailLower = identifier.trim().toLowerCase();
      user = await User.findOne({ email: emailLower }).lean();
    } else {
      // Login with mobile
      const digits = String(identifier).replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        return res.status(400).json({ error: 'Invalid mobile number' });
      }
      user = await User.findOne({ mobile: digits }).lean();
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if user has password set
    if (!user.password) {
      return res.status(401).json({ error: 'Password not set. Please complete your profile.' });
    }
    
    // Verify password (plain text comparison for now)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Ensure mobile field is always present in response
    if (user) {
      user.mobile = user.mobile || user.mobile;
    }
    
    console.log('User login successful:', { 
      identifier: isEmail ? 'email' : 'mobile', 
      userId: user._id 
    });
    res.json({ user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Login with mobile only (for first-time users)
router.post('/login-mobile', async (req, res) => {
  try {
    const digits = String(req.body?.mobile || '').replace(/\D/g, '');
    if (!digits || digits.length < 10 || digits.length > 15) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }
    
    const update = { $setOnInsert: { mobile: digits } };
    const setFields = {};
    
    if (req.body?.countryCode) setFields.countryCode = String(req.body.countryCode);
    if (req.body?.firstName) setFields.firstName = String(req.body.firstName);
    if (req.body?.lastName) setFields.lastName = String(req.body.lastName);
    if (req.body?.email) setFields.email = String(req.body.email);
    if (req.body?.profile && typeof req.body.profile === 'object') setFields.profile = req.body.profile;
    
    if (Object.keys(setFields).length > 0) {
      update.$set = setFields;
    }
    
    const user = await User.findOneAndUpdate(
      { mobile: digits },
      update,
      { new: true, upsert: true }
    ).lean();
    
    // Ensure mobile field is always present in response
    if (user) {
      user.mobile = user.mobile || digits;
    }
    
    console.log('User login successful:', { mobile: digits, userId: user._id, hasProfile: !!(user.firstName || user.email) });
    res.json({ user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Update or create full profile for a user
router.put('/profile', async (req, res) => {
  try {
    const digits = String(req.body?.mobile || '').replace(/\D/g, '');
    if (!digits) return res.status(400).json({ error: 'Mobile required' });

    const allowedFields = ['countryCode', 'firstName', 'lastName', 'email', 'password', 'avatarUrl', 'addresses', 'preferences', 'profile'];
    const $set = {};
    for (const key of allowedFields) {
      if (key in req.body) {
        // Convert email to lowercase for case-insensitive matching
        if (key === 'email') {
          $set[key] = String(req.body[key]).trim().toLowerCase();
        } else {
          $set[key] = req.body[key];
        }
      }
    }
    const user = await User.findOneAndUpdate(
      { mobile: digits },
      { $set: $set, $setOnInsert: { mobile: digits } },
      { new: true, upsert: true }
    ).lean();
    
    // Ensure mobile field is always present in response
    if (user) {
      user.mobile = user.mobile || digits;
    }
    
    console.log('Profile updated:', { mobile: digits, userId: user._id });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sync cart to user document
router.put('/cart', async (req, res) => {
  try {
    const digits = String(req.body?.mobile || '').replace(/\D/g, '');
    if (!digits) return res.status(400).json({ error: 'Mobile required' });
    
    const user = await User.findOneAndUpdate(
      { mobile: digits },
      { $set: { cart: req.body.cart || [] }, $setOnInsert: { mobile: digits } },
      { new: true, upsert: true }
    ).lean();
    
    res.json({ success: true, cart: user.cart || [] });
  } catch (err) {
    console.error('Cart sync error:', err);
    res.status(500).json({ error: 'Failed to sync cart' });
  }
});

// Sync wishlist to user document
router.put('/wishlist', async (req, res) => {
  try {
    const digits = String(req.body?.mobile || '').replace(/\D/g, '');
    if (!digits) return res.status(400).json({ error: 'Mobile required' });
    
    const user = await User.findOneAndUpdate(
      { mobile: digits },
      { $set: { wishlist: req.body.wishlist || [] }, $setOnInsert: { mobile: digits } },
      { new: true, upsert: true }
    ).lean();
    
    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (err) {
    console.error('Wishlist sync error:', err);
    res.status(500).json({ error: 'Failed to sync wishlist' });
  }
});

// Add or update address
router.put('/addresses', async (req, res) => {
  try {
    const digits = String(req.body?.mobile || '').replace(/\D/g, '');
    if (!digits) return res.status(400).json({ error: 'Mobile required' });
    
    const user = await User.findOne({ mobile: digits });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const address = req.body.address;
    if (address._id) {
      // Update existing address
      const index = user.addresses.findIndex(a => a._id.toString() === address._id);
      if (index !== -1) {
        Object.assign(user.addresses[index], address);
        // If setting as default, unset others
        if (address.isDefault) {
          user.addresses.forEach((addr, idx) => {
            if (idx !== index) addr.isDefault = false;
          });
        }
      }
    } else {
      // Add new address
      if (address.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
      }
      user.addresses.push(address);
    }
    
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error('Address update error:', err);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete address
router.delete('/addresses/:addressId', async (req, res) => {
  try {
    const digits = String(req.body?.mobile || req.query.mobile || '').replace(/\D/g, '');
    if (!digits) return res.status(400).json({ error: 'Mobile required' });
    
    const user = await User.findOne({ mobile: digits });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error('Address delete error:', err);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Fetch user by email
router.get('/email/:email', async (req, res) => {
  try {
    const emailLower = decodeURIComponent(req.params.email || '').trim().toLowerCase();
    const user = await User.findOne({ email: emailLower }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch user by mobile - MUST be last to avoid conflicts with other routes
router.get('/mobile/:mobile', async (req, res) => {
  try {
    const digits = String(req.params.mobile || '').replace(/\D/g, '');
    const user = await User.findOne({ mobile: digits }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Keep /:mobile as a fallback but check if it's a valid mobile number
router.get('/:mobile', async (req, res) => {
  try {
    // Check if this is one of our reserved routes
    const reserved = ['login-mobile', 'profile', 'cart', 'wishlist', 'addresses'];
    if (reserved.includes(req.params.mobile)) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    const digits = String(req.params.mobile || '').replace(/\D/g, '');
    if (digits.length < 10) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = await User.findOne({ mobile: digits }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


