import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';
import checkIcon from '../../assets/check.png';
import truckIcon from '../../assets/truck.png';
import homeIcon from '../../assets/home.png';
import phoneIcon from '../../assets/phone.png';

const OrderConfirmation = ({ orderData, paymentResponse }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(orderData);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    if (orderData) {
      setOrder(orderData);
      // Calculate estimated delivery (3 days from order date)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      setEstimatedDelivery(deliveryDate.toLocaleDateString());
    }
  }, [orderData]);

  const handleTrackOrder = () => {
    navigate(`/order-tracking/${order?.orderId}`);
  };

  const handleContinueShopping = () => {
    // Redirect to our new OrderSuccess page instead of home
    navigate('/payment-success');
  };

  const handleViewOrderHistory = () => {
    navigate('/order-history');
  };

  if (!order) {
    return (
      <div className="order-confirmation-container">
        <div className="order-confirmation">
          <h2>Order Confirmation</h2>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-container">
      <div className="order-confirmation">
        {/* Success Header */}
        <div className="success-header">
          <h1>Order Placed Successfully!</h1>
          <p className="success-message">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h2>Order Items</h2>
          <div className="order-items-list">
            {order.items.map((item, index) => (
              <div key={index} className="order-item-card">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Size: {item.weight}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                </div>
                <div className="item-total">
                  <span>₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="delivery-info-section">
          <h2>Delivery Information</h2>
          <div className="delivery-address-row">
            <div className="address-content">
              <div className="address-line">
                <strong>{order.customerDetails.name}</strong>
                <span>{order.customerDetails.phone}</span>
              </div>
              <div className="address-line">
                <span>{order.shippingAddress.line1}</span>
                {order.shippingAddress.line2 && <span>{order.shippingAddress.line2}</span>}
              </div>
              {order.shippingAddress.landmark && (
                <div className="address-line">
                  <span>{order.shippingAddress.landmark}</span>
                </div>
              )}
              <div className="address-line">
                <span>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="order-details-section">
          <h2>Order Details</h2>
          <div className="order-info-grid">
            <div className="order-info-item">
              <span className="order-info-label">Order ID:</span>
              <span className="order-info-value">{order.orderId}</span>
            </div>
            <div className="order-info-item">
              <span className="order-info-label">Order Date:</span>
              <span className="order-info-value">{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div className="order-info-item">
              <span className="order-info-label">Payment ID:</span>
              <span className="order-info-value">{paymentResponse?.razorpay_payment_id || 'N/A'}</span>
            </div>
            <div className="order-info-item">
              <span className="order-info-label">Total Amount:</span>
              <span className="order-info-value">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="track-order-btn" onClick={handleTrackOrder}>
            Track Your Order
          </button>
          <button className="view-orders-btn" onClick={handleViewOrderHistory}>
            View Order History
          </button>
          <button className="continue-shopping-btn" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>

        {/* Contact Information */}
        <div className="contact-info">
          <h3>Need Help?</h3>
          <div className="contact-details">
            <div className="contact-item">
              <img src={phoneIcon} alt="Phone" />
              <span>Call us: +91 9876543210</span>
            </div>
            <div className="contact-item">
              <span>Email: support@organvi.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
