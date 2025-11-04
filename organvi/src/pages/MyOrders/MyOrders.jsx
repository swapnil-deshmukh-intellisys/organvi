import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  X, 
  Eye,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { ordersData } from '../../data/ordersData';

const MyOrders = () => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [orders, setOrders] = useState(ordersData);

  const handleOrderClick = (orderId) => {
    navigate(`/account/orders/${orderId}`);
  };

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (cancelReason.trim()) {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === selectedOrder.id 
            ? { ...order, status: 'Cancelled', cancelReason }
            : order
        )
      );
      setShowCancelModal(false);
      setSelectedOrder(null);
      setCancelReason('');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'order-status-placed';
      case 'Shipped':
        return 'order-status-shipped';
      case 'Out for Delivery':
        return 'order-status-out-for-delivery';
      case 'Delivered':
        return 'order-status-delivered';
      case 'Cancelled':
        return 'order-status-cancelled';
      default:
        return 'order-status-placed';
    }
  };

  const canCancelOrder = (status) => {
    return ['Order Placed', 'Shipped'].includes(status);
  };

  return (
    <div className="my-orders-container">
      <div className="my-orders-header">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="my-orders-title">My Orders</h1>
          <p className="my-orders-subtitle">Track and manage your orders</p>
        </motion.div>
      </div>

        {/* Orders List */}
        <div className="orders-list">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="order-card"
            >
              <div className="order-card-content">
                <div className="order-card-layout">
                  {/* Product Image */}
                  <div className="order-product-image">
                    <img
                      src={order.image}
                      alt={order.productName}
                    />
                  </div>

                  {/* Order Details */}
                  <div className="order-details">
                    <div className="order-details-layout">
                      <div className="flex-1">
                        <h3 className="order-product-name">
                          {order.productName}
                        </h3>
                        
                        <div className="order-details-grid">
                          <div className="order-detail-item">
                            <Package size={16} className="order-detail-icon" />
                            <span>Weight: {order.weight}</span>
                          </div>
                          <div className="order-detail-item">
                            <span className="font-medium">₹{order.price}</span>
                          </div>
                          <div className="order-detail-item">
                            <span>Order ID: {order.id}</span>
                          </div>
                          <div className="order-detail-item">
                            <Calendar size={16} className="order-detail-icon" />
                            <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                          </div>
                          <div className="order-detail-item">
                            <Calendar size={16} className="order-detail-icon" />
                            <span>Expected: {new Date(order.expectedDelivery).toLocaleDateString()}</span>
                          </div>
                          <div className="order-detail-item">
                            <CreditCard size={16} className="order-detail-icon" />
                            <span>{order.paymentType}</span>
                          </div>
                        </div>

                        <div className="order-address">
                          <MapPin size={16} className="order-detail-icon" />
                          <span>{order.address}</span>
                        </div>

                        <div className="order-total-section">
                          <div className="order-total-label">
                            <span>Total: </span>
                            <span className="order-total-amount">₹{order.totalAmount}</span>
                          </div>
                          <span className={`order-status ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="order-actions">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOrderClick(order.id)}
                          className="order-action-button order-action-button-primary"
                        >
                          <Eye size={16} />
                          View Details
                        </motion.button>
                        
                        {canCancelOrder(order.status) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancelOrder(order)}
                            className="order-action-button order-action-button-danger"
                          >
                            <X size={16} />
                            Cancel Order
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <Package size={64} className="empty-state-icon" />
            <h3 className="empty-state-title">No orders found</h3>
            <p className="empty-state-description">You haven't placed any orders yet.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="empty-state-button"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        )}

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
              Are you sure you want to cancel order <strong>{selectedOrder?.id}</strong>?
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

export default MyOrders;
