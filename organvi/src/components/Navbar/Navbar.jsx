import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Search,
  MapPin,
  ChevronDown,
  Heart,
  Package,
  MessageCircle,
  Instagram,
  Linkedin,
  ExternalLink,
  Grid3X3,
  Wheat,
  Nut,
  Candy,
  ChefHat,
  Gift,
  Droplets,
  Apple,
  Coffee,
  LogOut,
  UserCheck,
  Shield
} from 'lucide-react';
import './Navbar.css';
import logo from '../../assets/organvilogo1.png';
import LoginModal from '../../pages/LoginModal/LoginModal';
import { useUser } from '../../context/UserContext';
// Import category GIF icons
import dalGif from '../../assets/Dal.gif';
import almondsGif from '../../assets/almonds-17904960-unscreen.gif';
import bambooGif from '../../assets/bamboo-16390380-unscreen.gif';
import grindGif from '../../assets/grind-14324580-unscreen.gif';


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartMessage, setCartMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { userData, phoneNumber, countryCode, logoutUser } = useUser();

  // Handle logo click
  const handleLogoClick = () => {
    setShowLocationDropdown(false);
    setShowUserDropdown(false);
    setShowSearchArea(false);
    setShowLoginModal(false);
    setShowSearchResults(false);
    setShowMobileSearch(false);
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    // Clear dropdown first
    setShowUserDropdown(false);

    // Logout user (this will clear state and localStorage)
    logoutUser();

    // Force navigation to home
    navigate('/', { replace: true });

    // Force a page reload to ensure all components reset
    window.location.href = '/';
  };

  // Universal search functionality with real product data
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 1) {
      // Real product data from AllCategories
      const allProducts = [
        // Almonds
        { id: 1, name: 'Organic Almonds', category: 'Dry Fruits', price: 450, weight: '250g', image: '/src/assets/almond.png' },

        // Cashews
        { id: 2, name: 'Organic Cashews', category: 'Dry Fruits', price: 500, weight: '250g', image: '/src/assets/cashewnut.png' },

        // Chana Dal
        { id: 3, name: 'Organic Chana Dal', category: 'Pulses', price: 95, weight: '500g', image: '/src/assets/chanadal.png' },

        // Chilly (3 types)
        { id: 4, name: 'Organic Red Chilly Powder', category: 'Spices', price: 75, weight: '100g', image: '/src/assets/chilly.jpg' },
        { id: 5, name: 'Organic Green Chilly Powder', category: 'Spices', price: 80, weight: '100g', image: '/src/assets/chilly1.jpg' },
        { id: 6, name: 'Organic Kashmiri Chilly Powder', category: 'Spices', price: 85, weight: '100g', image: '/src/assets/chilly2.png' },

        // Jaggery (6 types)
        { id: 7, name: 'Organic Jaggery (Type 1)', category: 'Sweeteners', price: 80, weight: '1kg', image: '/src/assets/jaggary2.jpg' },
        { id: 8, name: 'Organic Jaggery (Type 2)', category: 'Sweeteners', price: 85, weight: '1kg', image: '/src/assets/jaggary3.png' },
        { id: 9, name: 'Organic Jaggery (Type 3)', category: 'Sweeteners', price: 90, weight: '1kg', image: '/src/assets/jaggary4.jpg' },
        { id: 10, name: 'Organic Jaggery (Type 4)', category: 'Sweeteners', price: 95, weight: '1kg', image: '/src/assets/jaggary5.jpg' },
        { id: 11, name: 'Organic Jaggery (Type 5)', category: 'Sweeteners', price: 100, weight: '1kg', image: '/src/assets/jaggary6.png' },
        { id: 12, name: 'Organic Jaggery (Type 6)', category: 'Sweeteners', price: 105, weight: '1kg', image: '/src/assets/jeggary.png' },

        // Masoor Dal
        { id: 13, name: 'Organic Masoor Dal', category: 'Pulses', price: 85, weight: '500g', image: '/src/assets/Masoor Dal.png' },

        // Turmeric (5 types)
        { id: 14, name: 'Organic Turmeric (Type 1)', category: 'Spices', price: 120, weight: '250g', image: '/src/assets/termeric.png' },
        { id: 15, name: 'Organic Turmeric (Type 2)', category: 'Spices', price: 125, weight: '250g', image: '/src/assets/termeric2.jpg' },
        { id: 16, name: 'Organic Turmeric (Type 3)', category: 'Spices', price: 130, weight: '250g', image: '/src/assets/termeric3.jpg' },
        { id: 17, name: 'Organic Turmeric (Type 4)', category: 'Spices', price: 135, weight: '250g', image: '/src/assets/termeric4.jpg' },
        { id: 18, name: 'Organic Turmeric (Type 5)', category: 'Spices', price: 140, weight: '250g', image: '/src/assets/termeric5.png' },

        // Mix Sprouts
        { id: 19, name: 'Organic Mix Sprouts', category: 'Vegetables', price: 95, weight: '250g', image: '/src/assets/Mix Sprouts.png' },

        // Moong Dal
        { id: 20, name: 'Organic Moong Dal', category: 'Pulses', price: 90, weight: '500g', image: '/src/assets/moongdal.png' },

        // Pistachios
        { id: 21, name: 'Organic Pistachios', category: 'Dry Fruits', price: 600, weight: '250g', image: '/src/assets/pista1.png' },

        // Raisins
        { id: 22, name: 'Organic Raisins', category: 'Dry Fruits', price: 200, weight: '500g', image: '/src/assets/rainse1.png' },

        // Toor Dal
        { id: 23, name: 'Organic Toor Dal', category: 'Pulses', price: 100, weight: '500g', image: '/src/assets/toordal.png' },

        // Urad Dal
        { id: 24, name: 'Organic Urad Dal', category: 'Pulses', price: 110, weight: '500g', image: '/src/assets/uraldal.png' },

        // Roasted Chana
        { id: 25, name: 'Organic Roasted Chana', category: 'Snacks', price: 85, weight: '250g', image: '/src/assets/roastchana1.png' }
      ];

      const results = allProducts.filter(product => {
        const searchTerm = query.toLowerCase();
        const productName = product.name.toLowerCase();
        const categoryName = product.category.toLowerCase();

        // Remove common prefixes for better matching
        const cleanProductName = productName
          .replace(/^organic\s+/i, '')
          .replace(/^natural\s+/i, '')
          .replace(/^fresh\s+/i, '')
          .replace(/^pure\s+/i, '');

        // Create keyword variations and mappings
        const keywordMappings = {
          'dal': ['chana dal', 'moong dal', 'toor dal', 'urad dal', 'masoor dal'],
          'rice': ['basmati rice', 'brown rice'],
          'nuts': ['almonds', 'cashews', 'pistachios', 'walnuts'],
          'spices': ['turmeric', 'chilly', 'chilli', 'chili', 'garam masala'],
          'sweeteners': ['jaggery', 'honey', 'sugar'],
          'dry fruits': ['almonds', 'cashews', 'pistachios', 'raisins', 'dates']
        };

        // Get expanded keywords
        let expandedKeywords = [searchTerm];
        for (const [key, values] of Object.entries(keywordMappings)) {
          if (searchTerm.includes(key)) {
            expandedKeywords = [...expandedKeywords, ...values];
          }
        }

        // Create keyword variations
        const keywords = [
          ...expandedKeywords,
          searchTerm.replace(/\s+/g, ''), // Remove spaces
          searchTerm.replace(/\s+/g, ' '), // Normalize spaces
        ];

        // Check if any keyword matches
        const matches = keywords.some(keyword => {
          return cleanProductName.includes(keyword) ||
            productName.includes(keyword) ||
            categoryName.includes(keyword);
        });

        return matches;
      }).slice(0, 8); // Limit to 8 results

      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to AllCategories page and highlight the searched product
      navigate('/allcategories');
      setShowSearchResults(false);
      setShowMobileSearch(false);
      setSearchQuery(''); // Clear the search query

      // Store the search query for highlighting on the AllCategories page
      localStorage.setItem('searchHighlight', JSON.stringify({
        searchQuery: searchQuery,
        timestamp: Date.now()
      }));
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const uniqueItems = cart.length;
      setCartCount(uniqueItems);
    };

    const handleCartUpdated = (event) => {
      console.log('Cart updated event received:', event.detail, event.message);
      setCartCount(event.detail);
      if (event.message) {
        console.log('Setting cart message:', event.message);
        setCartMessage(event.message);
        // Hide message after 3 seconds
        setTimeout(() => {
          setCartMessage('');
        }, 3000);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistCount(wishlist.length);
    };

    const handleWishlistUpdated = (event) => {
      // Update count from event detail or localStorage
      if (event && typeof event.detail === 'number') {
        setWishlistCount(event.detail);
      } else {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlistCount(wishlist.length);
      }
    };

    updateWishlistCount();
    window.addEventListener('storage', updateWishlistCount);
    window.addEventListener('wishlistUpdated', handleWishlistUpdated);
    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
    };
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <>
      {/* Main Navbar - White background, positioned below green bar */}
      <header className={`main-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-content">

            {/* Left Side - Logo */}
            <div className="navbar-left">
              {/* Logo - No border or outline on click */}
              <Link
                to="/"
                className="navbar-logo"
                onClick={handleLogoClick}
                title="Go to Homepage"
              >
                <img
                  src={logo}
                  alt="organvi"
                  className="logo-image"
                />
              </Link>
            </div>
            {/* Center - Navigation Links */}
            <div className="navbar-center">
              <nav className="navbar-nav">
                <Link to="/" className="nav-link">Home</Link>

                {/* All Categories with Dropdown */}
                <div
                  className="nav-link-dropdown"
                  onMouseEnter={() => setShowCategoryDropdown(true)}
                  onMouseLeave={() => {
                    // Delay closing to allow mouse to move to dropdown
                    setTimeout(() => {
                      if (!document.querySelector('.category-dropdown-menu:hover')) {
                        setShowCategoryDropdown(false);
                      }
                    }, 200);
                  }}
                >
                  <span className="nav-link" style={{ cursor: 'pointer' }}>
                    All Categories
                    <ChevronDown size={16} className="dropdown-chevron" />
                  </span>
                  {showCategoryDropdown && (
                    <div
                      className="category-dropdown-menu"
                      onMouseEnter={() => setShowCategoryDropdown(true)}
                      onMouseLeave={() => setShowCategoryDropdown(false)}
                    >
                      <Link
                        to="/pulses"
                        className="category-dropdown-item"
                      >
                        <div className="category-icon-wrapper">
                          <img src={dalGif} alt="Pulses & Dal" className="category-dropdown-icon" />
                        </div>
                        <span className="category-dropdown-name">Pulses & Dal</span>
                      </Link>
                      <Link
                        to="/sweetener"
                        className="category-dropdown-item"
                      >
                        <div className="category-icon-wrapper">
                          <img src={bambooGif} alt="Sweetener" className="category-dropdown-icon" />
                        </div>
                        <span className="category-dropdown-name">Sweetener</span>
                      </Link>
                      <Link
                        to="/spices"
                        className="category-dropdown-item"
                      >
                        <div className="category-icon-wrapper">
                          <img src={grindGif} alt="Spices" className="category-dropdown-icon" />
                        </div>
                        <span className="category-dropdown-name">Spices</span>
                      </Link>
                      <Link
                        to="/dryfruits"
                        className="category-dropdown-item"
                      >
                        <div className="category-icon-wrapper">
                          <img src={almondsGif} alt="Dry Fruits" className="category-dropdown-icon" />
                        </div>
                        <span className="category-dropdown-name">Dry Fruits</span>
                      </Link>
                    </div>
                  )}
                </div>

                <Link to="/blog" className="nav-link">Blogs</Link>
                <Link to="/allcategories" className="nav-link">Combo Offer</Link>
                <Link to="/track-order" className="nav-link">Track Order</Link>
              </nav>
            </div>

            {/* Right Side - Search, Login, Like, Cart */}
            <div className="navbar-right">
              {/* Search Icon */}
              <button
                className="navbar-icon search-icon-btn"
                onClick={() => {
                  // Toggle search input visibility or navigate to search
                  navigate('/search');
                }}
                title="Search"
              >
                <Search size={26} />
              </button>

              {/* Login */}
              {userData ? (
                <Link
                  to="/account"
                  className="navbar-icon user-icon"
                  onClick={() => {
                    setShowUserDropdown(false);
                    setShowLocationDropdown(false);
                    setShowSearchArea(false);
                    setShowMobileSearch(false);
                  }}
                >
                  <User size={26} />
                </Link>
              ) : (
                <button
                  className="nav-link login-link"
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </button>
              )}

              {/* Heart Icon (Like) */}
              <Link
                to="/like"
                className="navbar-icon heart-icon"
              >
                <Heart size={26} />
                <span className="icon-badge">
                  {wishlistCount}
                </span>
              </Link>

              {/* Cart Icon with Badge */}
              <div className="cart-icon-container">
                <Link
                  to="/cart"
                  className="navbar-icon cart-icon"
                  title={cartMessage || `Cart (${cartCount} items)`}
                >
                  <ShoppingCart size={26} />
                  <span className="icon-badge">
                    {cartCount}
                  </span>
                </Link>
                {cartMessage && (
                  <div className="cart-success-message">
                    {cartMessage}
                  </div>
                )}
              </div>

              {/* Admin Panel Link */}
              <Link
                to="/admin"
                className="navbar-icon admin-icon"
                title="Admin Panel"
                onClick={() => {
                  setShowUserDropdown(false);
                  setShowLocationDropdown(false);
                  setShowSearchArea(false);
                  setShowMobileSearch(false);
                }}
              >
                <Shield size={26} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="mobile-search-container">
          <div className="mobile-search-bar">
            <form onSubmit={handleSearchSubmit} className="mobile-search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search the product"
                className="mobile-search-input"
                autoFocus
              />
              <button
                type="submit"
                className="mobile-search-button"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Mobile Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="mobile-search-results">
                <div className="mobile-search-results-header">
                  <span>{searchResults.length} results found</span>
                </div>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="mobile-search-result-item"
                    onClick={() => {
                      navigate('/allcategories');
                      setShowSearchResults(false);
                      setSearchQuery('');
                      setShowMobileSearch(false);

                      // Store the search query for highlighting on the AllCategories page
                      localStorage.setItem('searchHighlight', JSON.stringify({
                        searchQuery: result.name,
                        timestamp: Date.now()
                      }));
                    }}
                  >
                    <img
                      src={result.image}
                      alt={result.name}
                      className="mobile-search-result-image"
                    />
                    <div className="mobile-search-result-details">
                      <span className="mobile-search-result-name">{result.name}</span>
                      <div className="mobile-search-result-meta">
                        <span className="mobile-search-result-price">₹{result.price}</span>
                        <span className="mobile-search-result-weight">{result.weight}</span>
                        <span className="mobile-search-result-category">{result.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Dropdown */}
      {showLocationDropdown && (
        <div
          className="dropdown-overlay"
          onClick={() => setShowLocationDropdown(false)}
        >
          <div
            className="location-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dropdown-content">
              <button
                className="search-area-button"
                onClick={() => setShowSearchArea(!showSearchArea)}
              >
                + Search new area
              </button>

              {showSearchArea && (
                <div className="search-area-container">
                  <input
                    type="text"
                    placeholder="Search your area/ apartment/ pincode"
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    className="location-search-input"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Dropdown */}
      {showUserDropdown && (
        <div
          className="dropdown-overlay"
          onClick={() => setShowUserDropdown(false)}
        >
          <div
            className="user-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dropdown-content">
              {userData ? (
                // User is logged in - show user info and logout
                <div className="user-section">
                  <div className="user-info">
                    <div className="user-avatar">
                      <UserCheck size={20} />
                    </div>
                    <div className="user-details">
                      <p className="user-name">
                        {userData.firstName || userData.lastName
                          ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
                          : phoneNumber || 'User'}
                      </p>
                      {userData.email ? (
                        <p className="user-email">{userData.email}</p>
                      ) : phoneNumber ? (
                        <p className="user-email">{countryCode} {phoneNumber}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="user-actions">
                    <Link
                      to="/dashboard"
                      className="dashboard-link"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <Grid3X3 size={16} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/account/orders"
                      className="dashboard-link"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <Package size={16} />
                      <span>My Orders</span>
                    </Link>
                    <button
                      className="logout-button"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                // User is not logged in - show login/signup options
                <div className="auth-section">
                  <button
                    className="signin-button"
                    onClick={() => {
                      setShowLoginModal(true);
                      setShowUserDropdown(false);
                    }}
                  >
                    Sign in
                  </button>
                  <div className="signup-section">
                    <span className="new-customer-text">New Customer? </span>
                    <button
                      className="signup-link"
                      onClick={() => {
                        setShowLoginModal(true);
                        setShowUserDropdown(false);
                      }}
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

    </>
  );
};

export default Navbar;