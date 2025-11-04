import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package,
  ShoppingBag,
  Mail,
  Users,
  LogOut,
  ChevronDown,
  ChevronRight,
  Star
} from 'lucide-react';
import Products from './components/Products';
import Orders from './components/Orders';
import SupportMails from './components/SupportMails';
import Subscribers from './components/Subscribers';
import Reviews from './components/Reviews';
import AdminLogin from './components/AdminLogin';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [activeSection, setActiveSection] = useState('products');
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const navigate = useNavigate();

  // Check if admin is authenticated
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession) {
        const session = JSON.parse(adminSession);
        // Check if session is valid (you can add expiration logic here)
        if (session.email === 'organvi7820@gmai.com') {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminSession');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error checking auth:', err);
      localStorage.removeItem('adminSession');
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;
    
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="admin-container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          fontSize: '1.1rem',
          color: '#6B7280'
        }}>
          Checking authentication...
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h1 className="header-title">ADMIN PANEL</h1>
      </div>

      <div className="admin-content">
        {/* Left Sidebar */}
        <div className="sidebar">
          <nav className="sidebar-nav">
            {/* Products Dropdown */}
            <div className="dropdown-wrapper">
              <button 
                className={`nav-item ${activeSection.startsWith('products') ? 'active' : ''}`}
                onClick={() => {
                  // On mobile, show modal; on desktop, toggle dropdown
                  if (window.innerWidth <= 768) {
                    setShowProductsModal(true);
                  } else {
                    setShowProductsDropdown(!showProductsDropdown);
                  }
                }}
              >
                <ShoppingBag size={20} />
                <span>Products</span>
                {showProductsDropdown ? (
                  <ChevronDown size={16} className="dropdown-arrow" />
                ) : (
                  <ChevronRight size={16} className="dropdown-arrow" />
                )}
              </button>
              {showProductsDropdown && (
                <div className="dropdown-menu">
                  <button
                    className={`dropdown-item ${activeSection === 'products-pulses' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection('products-pulses');
                      setShowProductsDropdown(false);
                    }}
                  >
                    Pulses & Dal
                  </button>
                  <button
                    className={`dropdown-item ${activeSection === 'products-sweetener' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection('products-sweetener');
                      setShowProductsDropdown(false);
                    }}
                  >
                    Sweetner
                  </button>
                  <button
                    className={`dropdown-item ${activeSection === 'products-dryfruits' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection('products-dryfruits');
                      setShowProductsDropdown(false);
                    }}
                  >
                    Dry Fruits & Nuts
                  </button>
                  <button
                    className={`dropdown-item ${activeSection === 'products-spices' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection('products-spices');
                      setShowProductsDropdown(false);
                    }}
                  >
                    Spices & Masalas
                  </button>
                </div>
              )}
            </div>
            
            <button 
              className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              <Package size={20} />
              <span>Orders</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'support' ? 'active' : ''}`}
              onClick={() => setActiveSection('support')}
            >
              <Mail size={20} />
              <span>Support Mails</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'subscribers' ? 'active' : ''}`}
              onClick={() => setActiveSection('subscribers')}
            >
              <Users size={20} />
              <span>Subscribers</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveSection('reviews')}
            >
              <Star size={20} />
              <span>Reviews</span>
            </button>
            
            <button className="nav-item logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {activeSection.startsWith('products') && (
            <Products category={activeSection} />
          )}

          {activeSection === 'orders' && (
            <Orders />
          )}

          {activeSection === 'support' && (
            <SupportMails />
          )}

          {activeSection === 'subscribers' && (
            <Subscribers />
          )}

          {activeSection === 'reviews' && (
            <Reviews />
          )}
        </div>
      </div>

      {/* Products Category Selection Modal for Mobile */}
      {showProductsModal && (
        <div className="products-modal-overlay" onClick={() => setShowProductsModal(false)}>
          <div className="products-modal" onClick={(e) => e.stopPropagation()}>
            <div className="products-modal-header">
              <h3>Select Product Category</h3>
              <button className="products-modal-close" onClick={() => setShowProductsModal(false)}>×</button>
            </div>
            <div className="products-modal-content">
              <button
                className={`products-modal-item ${activeSection === 'products-pulses' ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection('products-pulses');
                  setShowProductsModal(false);
                }}
              >
                <ShoppingBag size={24} />
                <span>Pulses & Dal</span>
              </button>
              <button
                className={`products-modal-item ${activeSection === 'products-sweetener' ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection('products-sweetener');
                  setShowProductsModal(false);
                }}
              >
                <ShoppingBag size={24} />
                <span>Sweetner</span>
              </button>
              <button
                className={`products-modal-item ${activeSection === 'products-dryfruits' ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection('products-dryfruits');
                  setShowProductsModal(false);
                }}
              >
                <ShoppingBag size={24} />
                <span>Dry Fruits & Nuts</span>
              </button>
              <button
                className={`products-modal-item ${activeSection === 'products-spices' ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection('products-spices');
                  setShowProductsModal(false);
                }}
              >
                <ShoppingBag size={24} />
                <span>Spices & Masalas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
