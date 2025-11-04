import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String },
  items: [{ name: String, sku: String, units: Number, selling_price: Number }],
  paymentId: String,
  shipmentId: String,
  status: { type: String, default: 'Payment Completed' },
  trackingDetails: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      location: String,
    }
  ],
  cancelReason: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;


