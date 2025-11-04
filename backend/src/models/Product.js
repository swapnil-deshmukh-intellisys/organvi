import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    weight: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['pulses', 'sweetener', 'dryfruits', 'spices'],
      index: true
    },
    image: { type: String, trim: true }, // Can be base64 data URL or regular URL
    discount: { type: Number, default: 0, min: 0, max: 100 },
    inStock: { type: Boolean, default: true },
    organic: { type: Boolean, default: true },
    description: { type: String, trim: true },
    features: [{ type: String, trim: true }], // Array of product features
    idealForMaking: { type: String, trim: true }, // Ideal uses/recipes for the product
    sku: { type: String, trim: true }
  },
  { timestamps: true }
);

// Index for faster category queries
productSchema.index({ category: 1, createdAt: -1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;

