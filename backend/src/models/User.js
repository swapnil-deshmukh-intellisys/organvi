import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
);

const cartItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String },
    weight: { type: String },
    quantity: { type: Number, default: 1 },
    sku: { type: String }
  },
  { _id: true }
);

const wishlistItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number },
    originalPrice: { type: Number },
    image: { type: String },
    weight: { type: String },
    rating: { type: Number },
    sku: { type: String }
  },
  { _id: true }
);

const trackingDetailSchema = new mongoose.Schema(
  {
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    location: { type: String }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    items: [{
      id: String,
      name: String,
      sku: String,
      units: Number,
      quantity: Number,
      selling_price: Number,
      price: Number,
      image: String,
      weight: String
    }],
    paymentId: { type: String },
    shipmentId: { type: String },
    status: { type: String, default: 'Payment Completed' },
    trackingDetails: { type: [trackingDetailSchema], default: [] },
    cancelReason: { type: String },
    customerDetails: {
      name: String,
      email: String,
      phone: String
    },
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    totalAmount: { type: Number },
    paymentMethod: { type: String },
    orderDate: { type: Date, default: Date.now },
    cancelledAt: { type: Date }
  },
  { _id: true, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    mobile: { type: String, required: true, unique: true, trim: true },
    countryCode: { type: String, default: '+91' },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, index: true, sparse: true },
    password: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    addresses: { type: [addressSchema], default: [] },
    cart: { type: [cartItemSchema], default: [] },
    wishlist: { type: [wishlistItemSchema], default: [] },
    orders: { type: [orderSchema], default: [] },
    preferences: { type: Object, default: {} },
    profile: { type: Object, default: {} }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;


