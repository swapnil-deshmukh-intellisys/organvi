import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products, optionally filtered by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/products - Request received:', { body: req.body });
    const { name, price, weight, category, image, originalPrice, discount, inStock, organic, description, features, idealForMaking, sku } = req.body;
    
    // Validation
    if (!name || !price || !category) {
      console.log('Validation failed:', { name: !!name, price: !!price, category: !!category });
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    
    if (!['pulses', 'sweetener', 'dryfruits', 'spices'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    // Process features array
    let featuresArray = [];
    if (Array.isArray(features)) {
      featuresArray = features.filter(f => f && f.trim()).map(f => f.trim());
    } else if (typeof features === 'string') {
      // If features is a string (comma-separated), split it
      featuresArray = features.split(',').map(f => f.trim()).filter(f => f);
    }

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      weight: weight?.trim() || '',
      category,
      image: image?.trim() || '',
      discount: discount ? Number(discount) : 0,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      organic: organic !== undefined ? Boolean(organic) : true,
      description: description?.trim() || '',
      features: featuresArray,
      idealForMaking: idealForMaking?.trim() || '',
      sku: sku?.trim() || ''
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, price, weight, category, image, originalPrice, discount, inStock, organic, description, features, idealForMaking, sku } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (price !== undefined) updateData.price = Number(price);
    if (originalPrice !== undefined) updateData.originalPrice = Number(originalPrice);
    if (weight !== undefined) updateData.weight = weight.trim();
    if (category !== undefined) {
      if (!['pulses', 'sweetener', 'dryfruits', 'spices'].includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      updateData.category = category;
    }
    if (image !== undefined) updateData.image = image.trim();
    if (discount !== undefined) updateData.discount = Number(discount);
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (organic !== undefined) updateData.organic = Boolean(organic);
    if (description !== undefined) updateData.description = description.trim();
    if (features !== undefined) {
      let featuresArray = [];
      if (Array.isArray(features)) {
        featuresArray = features.filter(f => f && f.trim()).map(f => f.trim());
      } else if (typeof features === 'string') {
        featuresArray = features.split(',').map(f => f.trim()).filter(f => f);
      }
      updateData.features = featuresArray;
    }
    if (idealForMaking !== undefined) updateData.idealForMaking = idealForMaking.trim();
    if (sku !== undefined) updateData.sku = sku.trim();
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Bulk delete products by category
router.delete('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    if (!['pulses', 'sweetener', 'dryfruits', 'spices'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    const result = await Product.deleteMany({ category });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error deleting products by category:', error);
    res.status(500).json({ error: 'Failed to delete products' });
  }
});

export default router;

