import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackShipment, getShipmentDetails } from '../../utils/shiprocketUtils';
import './OrderTracking.css';
import truckIcon from '../../assets/truck.png';
import checkIcon from '../../assets/check.png';
import clockIcon from '../../assets/clock.png';
import homeIcon from '../../assets/home.png';
import phoneIcon from '../../assets/phone.png';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [shiprocketTracking, setShiprocketTracking] = useState(null);
  const [shiprocketError, setShiprocketError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const testShiprocketConnection = async () => {
    try {
      console.log('Testing Shiprocket connection...');
      const response = await fetch('http://localhost:5000/shiprocket-token');
      const result = await response.json();
      console.log('Shiprocket token response:', result);
      return result;
    } catch (error) {
      console.error('Shiprocket connection test failed:', error);
      setShiprocketError('Cannot connect to Shiprocket server. Please ensure the backend server is running.');
      return null;
    }
  };

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      // Test Shiprocket connection first
      await testShiprocketConnection();
      
      // In a real app, this would fetch from your backend
      const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      const foundOrder = storedOrders.find(o => o.orderId === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
        // Simulate tracking details
        const tracking = generateTrackingDetails(foundOrder);
        setTrackingDetails(tracking);

        // Fetch Shiprocket tracking if shipment ID exists
        if (foundOrder.shipmentId) {
          console.log('Found shipment ID:', foundOrder.shipmentId);
          try {
            const trackingResult = await trackShipment(foundOrder.shipmentId);
            console.log('Shiprocket tracking result:', trackingResult);
            if (trackingResult.success) {
              setShiprocketTracking(trackingResult.data);
            } else {
              console.error('Shiprocket tracking failed:', trackingResult.error);
              setShiprocketError(trackingResult.error);
            }
          } catch (error) {
            console.error('Error fetching Shiprocket tracking:', error);
            setShiprocketError(error.message);
          }
        } else {
          console.log('No shipment ID found for order:', foundOrder.orderId);
        }
      } else {
        // If order not found in localStorage, show error
        setOrder(null);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingDetails = (order) => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentStatus = order.status || 'pending';
    const currentIndex = statuses.indexOf(currentStatus);
    
    const trackingEvents = [];
    const now = new Date();
    
    // Generate tracking events based on current status
    if (currentIndex >= 0) {
      trackingEvents.push({
        status: 'pending',
        title: 'Order Placed',
        description: 'Your order has been successfully placed',
        timestamp: new Date(order.orderDate),
        completed: true
      });
    }
    
    if (currentIndex >= 1) {
      trackingEvents.push({
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared',
        timestamp: new Date(order.orderDate.getTime() + 30 * 60 * 1000), // 30 minutes later
        completed: true
      });
    }
    
    if (currentIndex >= 2) {
      trackingEvents.push({
        status: 'processing',
        title: 'Processing',
        description: 'Your order is being processed and packed',
        timestamp: new Date(order.orderDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
        completed: true
      });
    }
    
    if (currentIndex >= 3) {
      trackingEvents.push({
        status: 'shipped',
        title: 'Shipped',
        description: 'Your order has been shipped and is on its way',
        timestamp: new Date(order.orderDate.getTime() + 24 * 60 * 60 * 1000), // 1 day later
        completed: true
      });
    }
    
    if (currentIndex >= 4) {
      trackingEvents.push({
        status: 'in_transit',
        title: 'In Transit',
        description: 'Your order is in transit to your location',
        timestamp: new Date(order.orderDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days later
        completed: true
      });
    }
    
    if (currentIndex >= 5) {
      trackingEvents.push({
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Your order is out for delivery',
        timestamp: new Date(order.orderDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days later
        completed: true
      });
    }
    
    if (currentIndex >= 6) {
      trackingEvents.push({
        status: 'delivered',
        title: 'Delivered',
        description: 'Your order has been successfully delivered',
        timestamp: new Date(order.orderDate.getTime() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 3 days + 4 hours later
        completed: true
      });
    }

    return {
      trackingId: order.trackingId || `TRK${Date.now()}`,
      currentStatus,
      events: trackingEvents,
      estimatedDelivery: new Date(order.orderDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      carrier: 'Organvi Logistics',
      trackingUrl: `https://track.organvi.com/${order.trackingId || 'TRK' + Date.now()}`
    };
  };

  const getStatusIcon = (status, completed) => {
    if (completed) {
      return <img src={checkIcon} alt="Completed" className="status-icon completed" />;
    } else if (status === order?.status) {
      return <img src={truckIcon} alt="Current" className="status-icon current" />;
    } else {
      return <img src={clockIcon} alt="Pending" className="status-icon pending" />;
    }
  };

  const getStatusColor = (status, completed) => {
    if (completed) return '#4CAF50';
    if (status === order?.status) return '#2196F3';
    return '#E0E0E0';
  };

  if (loading) {
    return (
      <div className="order-tracking-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking-container">
        <div className="error-state">
          <h2>Order Not Found</h2>
          <p>The order you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/')} className="home-btn">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-container">
      <div className="order-tracking">
        {/* Header */}
        <div className="tracking-header">
          <h1>Track Your Order</h1>
          <div className="order-id-display">
            <span>Order ID: {order.orderId}</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <div className="order-header-info">
            <div className="order-id-section">
              <h2>#{order.orderId}</h2>
              <p className="order-date">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div className="order-status-section">
              <span 
                className={`status-badge status-${order.status}`}
                style={{ color: getStatusColor(order.status) }}
              >
                {getStatusIcon(order.status)}
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="tracking-timeline">
          <h2>Order Progress</h2>
          <div className="timeline-container">
            {trackingDetails?.events.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  {getStatusIcon(event.status, event.completed)}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3 className="timeline-title">{event.title}</h3>
                    <span className="timeline-time">
                      {event.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="timeline-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shiprocket Tracking */}
        {shiprocketTracking && (
          <div className="shiprocket-tracking">
            <h2>Shiprocket Tracking</h2>
            <div className="shiprocket-info">
              <div className="tracking-id">
                <strong>Tracking ID:</strong> {shiprocketTracking.tracking?.tracking_data?.awb || 'N/A'}
              </div>
              <div className="courier-info">
                <strong>Courier:</strong> {shiprocketTracking.tracking?.tracking_data?.courier_name || 'N/A'}
              </div>
              <div className="current-status">
                <strong>Status:</strong> {shiprocketTracking.tracking?.tracking_data?.status || 'N/A'}
              </div>
              {shiprocketTracking.tracking?.tracking_data?.tracking_history && (
                <div className="tracking-history">
                  <h3>Tracking History</h3>
                  {shiprocketTracking.tracking.tracking_data.tracking_history.map((event, index) => (
                    <div key={index} className="tracking-event">
                      <div className="event-date">{event.date}</div>
                      <div className="event-status">{event.status}</div>
                      <div className="event-location">{event.location}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shiprocket Error Display */}
        {shiprocketError && (
          <div className="shiprocket-error">
            <h2>Shiprocket Connection Issue</h2>
            <div className="error-message">
              <p><strong>Error:</strong> {shiprocketError}</p>
              <p><strong>Solution:</strong> Please ensure the backend server is running on port 5000</p>
              <button onClick={() => window.location.reload()}>Retry Connection</button>
            </div>
          </div>
        )}

        {/* Delivery Information */}
        <div className="delivery-info-card">
          <h2>Delivery Information</h2>
          <div className="delivery-details">
            <div className="delivery-address">
              <div className="address-header">
                <img src={homeIcon} alt="Address" />
                <span>Delivery Address</span>
              </div>
              <div className="address-content">
                <p><strong>{order.customerDetails.name}</strong></p>
                <p>{order.customerDetails.phone}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              </div>
            </div>
            
            <div className="delivery-timeline">
              <div className="timeline-header">
                <img src={truckIcon} alt="Delivery" />
                <span>Delivery Details</span>
              </div>
              <div className="timeline-content">
                <div className="delivery-item">
                  <span className="delivery-label">Estimated Delivery:</span>
                  <span className="delivery-value">{trackingDetails?.estimatedDelivery.toLocaleDateString()}</span>
                </div>
                <div className="delivery-item">
                  <span className="delivery-label">Carrier:</span>
                  <span className="delivery-value">{trackingDetails?.carrier}</span>
                </div>
                <div className="delivery-item">
                  <span className="delivery-label">Delivery Time:</span>
                  <span className="delivery-value">9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="product-card">
                <div className="product-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-weight">Size: {item.weight}</p>
                  <div className="product-price-section">
                    <span className="product-price">₹{item.price}</span>
                    <span className="product-quantity">Quantity: {item.quantity}</span>
                  </div>
                </div>
                <div className="product-total">
                  <span className="total-amount">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="contact-section">
          <h2>Need Help?</h2>
          <div className="contact-info">
            <div className="contact-item">
              <img src={phoneIcon} alt="Phone" />
              <span>Call us: +91 9876543210</span>
            </div>
            <div className="contact-item">
              <span>Email: support@organvi.com</span>
            </div>
            <div className="contact-item">
              <span>Live Chat: Available 24/7</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={() => navigate('/order-history')} className="view-orders-btn">
            View All Orders
          </button>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
