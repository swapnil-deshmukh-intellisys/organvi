import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  ShoppingBag,
  X,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { getOrderById } from '../../data/ordersData';
import OrderTimeline from '../../components/OrderTimeline/OrderTimeline';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [order, setOrder] = useState(getOrderById(id));

  if (!order) {
    return (
      <div className="order-details-container">
        <div className="empty-state">
          <Package size={64} className="empty-state-icon" />
          <h2 className="empty-state-title">Order Not Found</h2>
          <p className="empty-state-description">The order you're looking for doesn't exist.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/account/orders')}
            className="empty-state-button"
          >
            Back to Orders
          </motion.button>
        </div>
      </div>
    );
  }

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (cancelReason.trim()) {
      setOrder(prev => ({ ...prev, status: 'Cancelled', cancelReason }));
      setShowCancelModal(false);
      setCancelReason('');
    }
  };

  const canCancelOrder = () => {
    return ['Order Placed', 'Shipped'].includes(order.status);
  };

  return (
    <div className="order-details-container">
      {/* Header */}
      <div className="order-details-header">
        <div className="order-details-header-content">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/account/orders')}
            className="order-details-back-button"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </motion.button>
          <div>
            <h1 className="order-details-title">Order Details</h1>
            <p className="order-details-subtitle">Order #{order.id}</p>
          </div>
        </div>
      </div>

      <div className="order-details-content">
        <div className="order-details-grid">
          {/* Left Column - Product Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Product Image */}
            <div className="order-details-section">
              <img
                src={order.image}
                alt={order.productName}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Product Information */}
            <div className="order-details-section">
              <div className="order-details-section-content">
                <h2 className="order-details-section-subtitle">{order.productName}</h2>
              
                <div className="order-details-info-grid">
                  <div className="order-details-info-item">
                    <span className="order-details-info-label">Weight:</span>
                    <span className="order-details-info-value">{order.weight}</span>
                  </div>
                  
                  <div className="order-details-info-item">
                    <span className="order-details-info-label">Price:</span>
                    <span className="order-details-info-value">₹{order.price}</span>
                  </div>
                  
                  <div className="order-details-info-item">
                    <span className="order-details-info-label">Quantity:</span>
                    <span className="order-details-info-value">{order.quantity}</span>
                  </div>
                  
                  <div className="order-details-info-item">
                    <span className="order-details-info-label">Purchase Date:</span>
                    <span className="order-details-info-value">{new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="order-details-info-item">
                    <span className="order-details-info-label">Expected Delivery:</span>
                    <span className="order-details-info-value">{new Date(order.expectedDelivery).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="order-details-info-item">
                    <span className="order-details-info-label">Payment Type:</span>
                    <span className="order-details-info-value">{order.paymentType}</span>
                  </div>
                  
                  <div className="order-details-info-item">
                    <span className="order-details-info-label">Total Amount:</span>
                    <span className="order-details-info-value-large">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="order-details-section">
              <div className="order-details-section-content">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={20} className="text-gray-600" />
                  <h3 className="order-details-section-title">Delivery Address</h3>
                </div>
                <p className="order-details-address">{order.address}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Order Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Order Status */}
            <div className="order-details-section">
              <div className="order-details-section-content">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="order-details-section-title">Order Status</h3>
                  <span className={`order-status ${
                    order.status === 'Order Placed' ? 'order-status-placed' :
                    order.status === 'Shipped' ? 'order-status-shipped' :
                    order.status === 'Out for Delivery' ? 'order-status-out-for-delivery' :
                    order.status === 'Delivered' ? 'order-status-delivered' :
                    'order-status-cancelled'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <OrderTimeline orderDate={order.orderDate} status={order.status} />
              </div>
            </div>

            {/* Cancel Order Section */}
            {canCancelOrder() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="order-details-section"
              >
                <div className="order-details-section-content">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={20} className="text-red-500" />
                    <h3 className="order-details-section-title">Cancel Order</h3>
                  </div>
                  <p className="order-details-address mb-4">
                    You can cancel this order until it's out for delivery.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelOrder}
                    className="order-action-button order-action-button-danger"
                  >
                    <X size={16} />
                    Cancel Order
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="order-details-section"
            >
              <div className="order-details-section-content">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="order-success-button"
                >
                  <ShoppingBag size={20} />
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-content"
          >
            <div className="modal-header">
              <AlertCircle size={24} className="text-red-500" />
              <h3 className="modal-title">Cancel Order</h3>
            </div>
            
            <p className="modal-description">
              Are you sure you want to cancel order <strong>{order.id}</strong>?
            </p>
            
            <div className="modal-form-group">
              <label className="modal-label">
                Reason for cancellation:
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation..."
                className="modal-textarea"
                rows={3}
              />
            </div>
            
            <div className="modal-actions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCancelModal(false)}
                className="modal-button modal-button-secondary"
              >
                Keep Order
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmCancelOrder}
                disabled={!cancelReason.trim()}
                className="modal-button modal-button-danger"
              >
                Cancel Order
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderDetails;
