import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderHistory.css';
import searchIcon from '../../assets/search.png';
import filterIcon from '../../assets/filter.png';
import eyeIcon from '../../assets/eye.png';
import truckIcon from '../../assets/truck.png';
import checkIcon from '../../assets/check.png';
import clockIcon from '../../assets/clock.png';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, sortBy]);

  const fetchOrders = () => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      setOrders(storedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.orderDate) - new Date(a.orderDate);
        case 'oldest':
          return new Date(a.orderDate) - new Date(b.orderDate);
        case 'amount_high':
          return b.totalAmount - a.totalAmount;
        case 'amount_low':
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <img src={checkIcon} alt="Delivered" className="status-icon delivered" />;
      case 'shipped':
      case 'in_transit':
      case 'out_for_delivery':
        return <img src={truckIcon} alt="Shipped" className="status-icon shipped" />;
      default:
        return <img src={clockIcon} alt="Processing" className="status-icon processing" />;
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

  const handleViewOrder = (orderId) => {
    navigate(`/order-tracking/${orderId}`);
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/order-tracking/${orderId}`);
  };

  if (loading) {
    return (
      <div className="order-history-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <div className="order-history">
        {/* Header */}
        <div className="history-header">
          <h1>Order History</h1>
          <p>Track and manage all your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-bar">
            <img src={searchIcon} alt="Search" className="search-icon" />
            <input
              type="text"
              placeholder="Search orders by ID, name, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <img src={filterIcon} alt="Filter" className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="sort-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Amount: High to Low</option>
                <option value="amount_low">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-section">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h2>No Orders Found</h2>
              <p>
                {searchTerm || statusFilter !== 'all' 
                  ? 'No orders match your current filters.' 
                  : 'You haven\'t placed any orders yet.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button 
                  onClick={() => navigate('/')} 
                  className="start-shopping-btn"
                >
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order.orderId} className="order-card">
                  <div className="order-header">
                    <div className="order-id-section">
                      <h3>Order #{order.orderId}</h3>
                      <span className="order-date">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
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
                    <div className="order-items-preview">
                      <h4>Items ({order.items.length})</h4>
                      <div className="items-list">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="item-preview">
                            <img src={item.image} alt={item.name} className="item-image" />
                            <div className="item-info">
                              <span className="item-name">{item.name}</span>
                              <span className="item-quantity">Qty: {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="more-items">
                            +{order.items.length - 3} more items
                          </div>
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
                      onClick={() => handleViewOrder(order.orderId)}
                    >
                      <img src={eyeIcon} alt="View" />
                      View Details
                    </button>
                    <button 
                      className="track-order-btn"
                      onClick={() => handleTrackOrder(order.orderId)}
                    >
                      <img src={truckIcon} alt="Track" />
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredOrders.length > 0 && (
          <div className="summary-stats">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <span className="stat-number">{filteredOrders.length}</span>
            </div>
            <div className="stat-card">
              <h3>Total Spent</h3>
              <span className="stat-number">
                ₹{filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)}
              </span>
            </div>
            <div className="stat-card">
              <h3>Delivered Orders</h3>
              <span className="stat-number">
                {filteredOrders.filter(order => order.status === 'delivered').length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
