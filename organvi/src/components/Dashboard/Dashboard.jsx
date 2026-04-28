import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../../config/api';
import { 
  Grid3X3, 
  MapPin, 
  Heart, 
  LogOut, 
  Check,
  User,
  Package,
  Truck,
  Clock,
  X,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import Address from './Address';
import './Dashboard.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();
  const { userData, phoneNumber, countryCode, logoutUser, refreshUserData } = useUser();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Check authentication and redirect if not logged in - only run once on mount
  useEffect(() => {
    const checkAuth = () => {
      // Check both context state and localStorage
      const storedUser = localStorage.getItem('userData');
      const mobile = userData?.mobile || phoneNumber;
      
      // If no user data in both context and localStorage, redirect to home
      if (!userData && !storedUser && !mobile) {
        navigate('/');
        return;
      }
      
      // If we have a mobile number, load user data (only once on mount)
      if (mobile) {
        refreshUserData(mobile);
        fetchOrdersFromBackend(mobile);
      } else if (storedUser) {
        // If we have stored user but no mobile in context, try to parse and use it
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.mobile) {
            refreshUserData(parsed.mobile);
            fetchOrdersFromBackend(parsed.mobile);
          }
        } catch (e) {
          // Invalid stored data, redirect to home
          navigate('/');
        }
      } else {
        // No user data at all, redirect to home
        navigate('/');
      }
    };
    
    checkAuth();
    
    // Listen for logout events
    const handleLogout = () => {
      navigate('/');
    };
    
    window.addEventListener('userLogout', handleLogout);
    
    return () => {
      window.removeEventListener('userLogout', handleLogout);
    };
    // Only run once on mount - don't depend on userData/phoneNumber to prevent loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep wishlist in sync immediately on events, then refresh from backend
  useEffect(() => {
    const loadWishlist = () => {
      // Initialize from userData when available
      if (userData?.wishlist && userData.wishlist.length > 0) {
        setWishlistItems(userData.wishlist);
        localStorage.setItem('wishlist', JSON.stringify(userData.wishlist));
      } else {
        try {
          const local = JSON.parse(localStorage.getItem('wishlist')) || [];
          setWishlistItems(local);
        } catch {}
      }
    };

    loadWishlist();

    const handleWishlistUpdated = (event) => {
      try {
        const local = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlistItems(local);
        // If event has detail (count), we know it was updated
        if (event && typeof event.detail === 'number') {
          // Wishlist was updated, ensure we have the latest data
          const latest = JSON.parse(localStorage.getItem('wishlist')) || [];
          setWishlistItems(latest);
        }
      } catch {}
      // Don't call refreshUserData here - it causes infinite loops
      // The wishlist is already synced to backend by the component that updated it
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdated);
    window.addEventListener('storage', handleWishlistUpdated);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
      window.removeEventListener('storage', handleWishlistUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const fetchOrdersFromBackend = async (mobile) => {
    try {
      const digits = String(mobile).replace(/\D/g, '');
      const response = await fetch(API_ENDPOINTS.ORDERS.BY_USER(digits));
      if (response.ok) {
        const backendOrders = await response.json();
        setOrders(backendOrders || []);
        // Also sync to localStorage for backward compatibility
        localStorage.setItem('orders', JSON.stringify(backendOrders || []));
      } else {
        // Fallback to localStorage if backend fails
        const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        setOrders(storedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders from backend:', error);
      // Fallback to localStorage
      const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      setOrders(storedOrders);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;
    
    // Logout user (this will clear state and localStorage)
    logoutUser();
    
    // Force navigation to home
    navigate('/', { replace: true });
    
    // Force a page reload to ensure all components reset
    window.location.href = '/';
  };

  const handleMakeFirstOrder = () => {
    navigate('/allcategories');
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    const mobile = userData?.mobile || phoneNumber;
    if (!mobile) {
      alert('User not logged in');
      return;
    }

    try {
      const digits = String(mobile).replace(/\D/g, '');
      const response = await fetch(API_ENDPOINTS.ORDERS.CANCEL(selectedOrder.orderId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason: cancelReason,
          userMobile: digits
        })
      });

      if (response.ok) {
        // Refresh orders from backend
        await fetchOrdersFromBackend(mobile);
        setShowCancelModal(false);
        setCancelReason('');
        setSelectedOrder(null);
        alert('Order cancelled successfully');
      } else {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <Check size={16} className="status-icon delivered" />;
      case 'shipped':
      case 'in_transit':
      case 'out_for_delivery':
        return <Truck size={16} className="status-icon shipped" />;
      case 'cancelled':
        return <X size={16} className="status-icon cancelled" />;
      default:
        return <Clock size={16} className="status-icon processing" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#FF9800',
      'confirmed': '#2196F3',
      'processing': '#9C27B0',
      'shipped': '#4CAF50',
      'in_transit': '#FF5722',
      'out_for_delivery': '#795548',
      'delivered': '#4CAF50',
      'cancelled': '#f44336',
      'returned': '#607D8B'
    };
    return colors[status] || '#666';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Order Placed',
      'confirmed': 'Order Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'in_transit': 'In Transit',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'returned': 'Returned'
    };
    return statusMap[status] || status;
  };

  const canCancelOrder = (order) => {
    return ['pending', 'confirmed', 'processing'].includes(order.status);
  };

  // Early return if not authenticated - don't render anything
  const storedUser = localStorage.getItem('userData');
  const mobile = userData?.mobile || phoneNumber;
  if (!userData && !storedUser && !mobile) {
    return null; // Will redirect via useEffect
  }

  const fullName = userData 
    ? (userData.firstName || userData.lastName 
        ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
        : phoneNumber || 'User')
    : 'User';
  const email = userData?.email || '';
  const displayMobile = phoneNumber || userData?.mobile || '';

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="header-title">MY ACCOUNT</h1>
      </div>

      <div className="dashboard-content">
        {/* Left Sidebar */}
        <div className="sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <Grid3X3 size={20} />
              <span>Dashboard</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              <Package size={20} />
              <span>Orders ({orders.length})</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveSection('addresses')}
            >
              <MapPin size={20} />
              <span>Addresses ({userData?.addresses?.length || 0})</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'wishlist' ? 'active' : ''}`}
              onClick={() => {
                // Refresh wishlist when clicking on wishlist section
                const local = JSON.parse(localStorage.getItem('wishlist')) || [];
                setWishlistItems(local);
                setActiveSection('wishlist');
              }}
            >
              <Heart size={20} />
              <span>Wishlist ({wishlistItems.length})</span>
            </button>
            
            <button className="nav-item logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>

        </div>

        {/* Main Content */}
        <div className="main-content">
          {activeSection === 'dashboard' && (
            <div className="dashboard-section">
              {/* Welcome Message */}
              <div className="welcome-section">
                <p className="welcome-text">
                  Hello {fullName} (not {fullName}? <button className="logout-link" onClick={handleLogout}>Log out</button>)
                </p>
              </div>

              {/* Dashboard now shows only account information. Orders have a dedicated section. */}

              {/* Account Details */}
              <div className="account-details-section">
                <h2 className="section-title">Account details:</h2>
                <div className="account-info">
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{fullName}</span>
                  </div>
                  {displayMobile && (
                    <div className="info-row">
                      <span className="info-label">Mobile:</span>
                      <span className="info-value">{countryCode} {displayMobile}</span>
                    </div>
                  )}
                  {email && (
                    <div className="info-row">
                      <span className="info-label">E-mail:</span>
                      <span className="info-value">{email}</span>
                    </div>
                  )}
                  {(!email && fullName === mobile) && (
                    <div className="info-row" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                      <span className="info-value" style={{ fontSize: '0.9rem', color: '#666' }}>
                        Complete your profile to add name and email
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div className="orders-section">
              <h2 className="section-title">All Orders</h2>
              {orders.length === 0 ? (
                <div className="empty-orders">
                  <Package size={48} className="empty-icon" />
                  <p className="empty-text">No orders found</p>
                  <button className="start-shopping-btn" onClick={handleMakeFirstOrder}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.orderId} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <span className="order-id">#{order.orderId}</span>
                          <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="order-status">
                          {getStatusIcon(order.status)}
                          <span 
                            className="status-text"
                            style={{ color: getStatusColor(order.status) }}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="order-content">
                        <div className="order-items">
                          <h4>Items ({order.items.length})</h4>
                          <div className="items-preview">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="item-preview">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-info">
                                  <span className="item-name">{item.name}</span>
                                  <span className="item-quantity">Qty: {item.quantity}</span>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="more-items">+{order.items.length - 2} more</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="order-summary">
                          <div className="summary-row">
                            <span>Total Amount:</span>
                            <span className="total-amount">₹{order.totalAmount}</span>
                          </div>
                          <div className="summary-row">
                            <span>Payment Method:</span>
                            <span>{order.paymentMethod}</span>
                          </div>
                          <div className="summary-row">
                            <span>Delivery Address:</span>
                            <span className="delivery-address">
                              {order.shippingAddress?.line1}, {order.shippingAddress?.city}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="order-actions">
                        <button 
                          className="view-order-btn"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        {canCancelOrder(order) && (
                          <button 
                            className="cancel-order-btn"
                            onClick={() => handleCancelOrder(order)}
                          >
                            <X size={16} />
                            Cancel Order
                          </button>
                        )}
                        <button 
                          className="track-order-btn"
                          onClick={() => navigate(`/order-tracking/${order.orderId}`)}
                        >
                          <Truck size={16} />
                          Track Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'addresses' && (
            <div className="addresses-section">
              <Address />
            </div>
          )}

          {activeSection === 'wishlist' && (
            <div className="wishlist-section">
              <h2 className="section-title">Wishlist ({wishlistItems.length})</h2>
              {(wishlistItems.length === 0) ? (
                <div className="empty-wishlist">
                  <Heart size={48} className="empty-icon" />
                  <p className="empty-text">Your wishlist is empty</p>
                  <p className="empty-subtext">Click the heart icon on any product to add it to your wishlist</p>
                </div>
              ) : (
                <div className="wishlist-items">
                  {wishlistItems.map((item, index) => {
                    // Handle both object and string/number formats
                    const itemId = typeof item === 'object' ? item.id : item;
                    const itemName = typeof item === 'object' ? item.name : 'Product';
                    const itemImage = typeof item === 'object' ? item.image : null;
                    const itemPrice = typeof item === 'object' ? item.price : null;
                    const itemWeight = typeof item === 'object' ? item.weight : null;
                    
                    return (
                      <div key={itemId || index} className="wishlist-item-card">
                        {itemImage && (
                          <img src={itemImage} alt={itemName} className="wishlist-item-image" />
                        )}
                        <div className="wishlist-item-details">
                          <h4>{itemName}</h4>
                          {itemPrice && <p className="wishlist-item-price">₹{itemPrice}</p>}
                          {itemWeight && <p className="wishlist-item-weight">{itemWeight}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="order-modal">
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.orderId}</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowOrderModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="unified-order-modal">
              <h4>Order Details</h4>
              <div className="order-info-section">
                <div className="detail-row">
                  <span>Order ID:</span>
                  <span>{selectedOrder.orderId}</span>
                </div>
                <div className="detail-row">
                  <span>Order Date:</span>
                  <span>{new Date(selectedOrder.orderDate).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span 
                    className="status-badge"
                    style={{ color: getStatusColor(selectedOrder.status) }}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Total Amount:</span>
                  <span className="amount">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>

              <div className="customer-info-section">
                <div className="detail-row">
                  <span>Name:</span>
                  <span>{selectedOrder.customerDetails?.name}</span>
                </div>
                <div className="detail-row">
                  <span>Email:</span>
                  <span>{selectedOrder.customerDetails?.email}</span>
                </div>
                <div className="detail-row">
                  <span>Phone:</span>
                  <span>{selectedOrder.customerDetails?.phone}</span>
                </div>
                <div className="detail-row">
                  <span>Delivery Address:</span>
                  <span>
                    {selectedOrder.shippingAddress?.line1}
                    {selectedOrder.shippingAddress?.line2 && `, ${selectedOrder.shippingAddress.line2}`}
                    <br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                  </span>
                </div>
              </div>

              <div className="order-items-section">
                <h5>Order Items</h5>
                <div className="items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <h6>{item.name}</h6>
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

              {selectedOrder.cancelReason && (
                <div className="cancellation-section">
                  <h5>Cancellation Details</h5>
                  <div className="detail-row">
                    <span>Reason:</span>
                    <span>{selectedOrder.cancelReason}</span>
                  </div>
                  {selectedOrder.cancelledAt && (
                    <div className="detail-row">
                      <span>Cancelled At:</span>
                      <span>{new Date(selectedOrder.cancelledAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="track-order-btn"
                onClick={() => {
                  setShowOrderModal(false);
                  navigate(`/order-tracking/${selectedOrder.orderId}`);
                }}
              >
                <Truck size={16} />
                Track Order
              </button>
              {canCancelOrder(selectedOrder) && (
                <button 
                  className="cancel-order-btn"
                  onClick={() => {
                    setShowOrderModal(false);
                    handleCancelOrder(selectedOrder);
                  }}
                >
                  <X size={16} />
                  Cancel Order
                </button>
              )}
              
            </div>
          </div>
        </div>
      )}

      {/* Removed separate Cancel Order Modal */}
    </div>
  );
};

export default Dashboard;
