import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { syncWishlistToBackend } from '../../utils/syncUserData';
import API_ENDPOINTS from '../../config/api';
// import Filter from '../Filter/Filter';
import './Sweetner.css';
import ViewMoreDetails from '../Pulses/ViewMoreDetails';

// Import product images for sweeteners
import jaggeryImg from '../../assets/jeggary.png';
import jaggery2Img from '../../assets/jaggary2.jpg';
import jaggery3Img from '../../assets/jaggary3.png';
import jaggery4Img from '../../assets/jaggary4.jpg';
import jaggery5Img from '../../assets/jaggary5.jpg';
import jaggery6Img from '../../assets/jaggary6.png';
import downIcon from '../../assets/down.png';
import closeGif from '../../assets/close.gif';
import binIcon from '../../assets/bin.png';
import editIcon from '../../assets/editing.png';
import mastercardIcon from '../../assets/mastercard.png';
import rupayIcon from '../../assets/rupay.png';
import upiIcon from '../../assets/upi (1).png';
import visaIcon from '../../assets/visa.png';

// Sweetener Icon
const SweetenerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const Sweetener = () => {
  const navigate = useNavigate();
  const { userData, phoneNumber } = useUser();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantityDisplay, setQuantityDisplay] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [likedProducts, setLikedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [modalQuantity, setModalQuantity] = useState(1);
  const [showCartModal, setShowCartModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCartItem, setEditingCartItem] = useState(null);
  const [showViewMore, setShowViewMore] = useState(false);
  const [selectedViewMoreProduct, setSelectedViewMoreProduct] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    sortBy: 'name',
    availability: 'all',
    organicOnly: false,
    selectedCategory: 'sweeteners',
    selectedItems: [],
    selectedPackageTypes: []
  });

  // Sweetener products data - Each product is unique with distinct names and images
  const sweetenerProducts = [
    { 
      id: 1,
      name: 'Organic Jaggery Powder', 
      price: 140, 
      originalPrice: 155,
      discount: 8,
      weight: '500g',
      image: jaggeryImg,
      inStock: true, 
      organic: true 
    },
    { 
      id: 2,
      name: 'Premium Jaggery Cubes', 
      price: 70, 
      originalPrice: 80,
      discount: 6,
      weight: '250g',
      image: jaggery2Img,
      inStock: true, 
      organic: true 
    },
    { 
      id: 3,
      name: 'Raw Jaggery Block', 
      price: 70, 
      originalPrice: 80,
      discount: 10,
      weight: '1kg',
      image: jaggery3Img,
      inStock: true, 
      organic: true 
    },
    { 
      id: 4,
      name: 'Crystal Jaggery', 
      price: 200, 
      originalPrice: 220,
      discount: 9,
      weight: '500g',
      image: jaggery4Img,
      inStock: true, 
      organic: true 
    },
    { 
      id: 5,
      name: 'Dark Jaggery', 
      price: 160, 
      originalPrice: 175,
      discount: 9,
      weight: '1kg',
      image: jaggery5Img,
      inStock: true, 
      organic: true 
    },
    { 
      id: 6,
      name: 'Golden Jaggery', 
      price: 140, 
      originalPrice: 155,
      discount: 10,
      weight: '500g',
      image: jaggery6Img,
      inStock: true, 
      organic: true 
    }
  ];

  // Fetch admin-managed products from backend
  const [backendProducts, setBackendProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const fetchBackendProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await fetch(API_ENDPOINTS.PRODUCTS.BY_CATEGORY('sweetener'));
        if (response.ok) {
          const products = await response.json();
          const formatted = products.map((p, idx) => ({
            id: p._id || `s-${idx}`,
            name: p.name || 'Product',
            price: Number(p.price || 0),
            originalPrice: Number(p.originalPrice || p.price || 0),
            discount: Number(p.discount || 0),
            image: p.image || '',
            description: p.description || '',
            features: p.features || [],
            idealForMaking: p.idealForMaking || '',
            inStock: p.inStock !== undefined ? p.inStock : true,
            organic: p.organic !== undefined ? p.organic : true,
            weight: p.weight || '500g'
          }));
          setBackendProducts(formatted);
        }
      } catch (error) {
        console.error('Error fetching backend products:', error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchBackendProducts();
  }, []);

  const baseProducts = backendProducts.length > 0 ? backendProducts : sweetenerProducts;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Weight options for modal
  const weightOptions = [
    { value: '500g', label: '500g', multiplier: 1 },
    { value: '1kg', label: '1kg', multiplier: 2 }
  ];

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Sort By' },
    { value: 'name', label: 'Name, A-Z' },
    { value: 'name-desc', label: 'Name, Z-A' },
    { value: 'price', label: 'Price, low to high' },
    { value: 'price-desc', label: 'Price, high to low' }
  ];

  const handleSortChange = (sortValue) => {
    setFilters(prev => ({ ...prev, sortBy: sortValue }));
    setShowSortDropdown(false);
  };

  const getCurrentSortLabel = () => {
    const currentSort = sortOptions.find(option => option.value === filters.sortBy);
    return currentSort ? currentSort.label : 'Name, A-Z';
  };

  // Cart functionality
  const addToCart = (product, weight) => {
    const cartKey = `${product.id}-${weight}`;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartKey === cartKey);
      if (existingItem) {
        return prevCart.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const weightOption = weightOptions.find(w => w.value === weight);
        const price = Math.round(product.price * weightOption.multiplier);
        const originalPrice = Math.round(product.originalPrice * weightOption.multiplier);
        return [...prevCart, { 
          ...product, 
          quantity: 1, 
          cartKey,
          weight,
          price,
          originalPrice
        }];
      }
    });
  };

  const addToCartPage = (product, weight) => {
    // Check if quantity is 0 - don't add to cart if count is 0
    const cartKey = `${product.id}-${weight}`;
    const cartQuantity = quantityDisplay[cartKey] || 0;
    if (cartQuantity === 0) {
      return;
    }
    
    const weightOption = weightOptions.find(w => w.value === weight);
    const price = Math.round(product.price * weightOption.multiplier);
    const originalPrice = Math.round(product.originalPrice * weightOption.multiplier);
    
    // Create cart item for localStorage with the current quantity
    const cartItem = {
      id: `${product.id}-${weight}`,
      name: product.name,
      price: price,
      originalPrice: originalPrice,
      image: product.image,
      weight: weight,
      quantity: cartQuantity
    };
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex === -1) {
      // Add new item to cart
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // Update existing item quantity
      const updatedCart = existingCart.map(item =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + cartQuantity }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    // Update local cart state
    setTimeout(() => {
      const finalCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(finalCart);
      const uniqueItems = finalCart.length; // Count unique products, not quantities
      console.log('Cart updated - Unique items:', uniqueItems, 'Cart:', finalCart);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
      // Also trigger storage event for cross-tab compatibility
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(finalCart)
      }));
    }, 100);
    
    // Show success popup notification
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };


  const updateQuantity = (cartKey, newQuantity) => {
    console.log('updateQuantity called:', cartKey, newQuantity);
    if (newQuantity <= 0) {
      setQuantityDisplay(prev => {
        const newState = { ...prev };
        delete newState[cartKey];
        return newState;
      });
    } else {
      setQuantityDisplay(prev => ({
        ...prev,
        [cartKey]: newQuantity
      }));
    }
  };

  const getCartItemQuantity = (productId, weight) => {
    const cartKey = `${productId}-${weight}`;
    return quantityDisplay[cartKey] || 0;
  };


  const isProductLiked = (productId) => {
    return likedProducts.some(liked => liked.id === productId);
  };

  // Modal functions
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedWeight('500g');
    setModalQuantity(1);
    setIsEditing(false);
    setEditingCartItem(null);
    setShowModal(true);
  };

  const openEditModal = (cartItem) => {
    // Find the product from the sweetener data
    const product = baseProducts.find(p => p.id === cartItem.id);
    console.log('Editing cart item:', cartItem);
    console.log('Found product:', product);
    if (product) {
      setSelectedProduct(product);
      setSelectedWeight(cartItem.weight);
      setModalQuantity(cartItem.quantity);
      setIsEditing(true);
      setEditingCartItem(cartItem);
      setShowModal(true);
      setShowCartModal(false); // Close cart modal when opening edit modal
      console.log('Edit modal opened with product:', product.name);
    } else {
      console.log('Product not found for cart item:', cartItem);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSelectedWeight('500g');
    setModalQuantity(1);
    setIsEditing(false);
    setEditingCartItem(null);
  };

  const openViewMore = (product) => {
    setSelectedViewMoreProduct(product);
    setShowViewMore(true);
  };

  const closeViewMore = () => {
    setShowViewMore(false);
    setSelectedViewMoreProduct(null);
  };

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = modalQuantity + change;
    if (newQuantity >= 1) {
      setModalQuantity(newQuantity);
    }
  };

  const getModalPrice = () => {
    if (!selectedProduct) return 0;
    return selectedWeight === '1kg' ? selectedProduct.price * 2 : selectedProduct.price;
  };

  const getModalOriginalPrice = () => {
    if (!selectedProduct) return 0;
    return selectedWeight === '1kg' ? selectedProduct.originalPrice * 2 : selectedProduct.originalPrice;
  };

  const handleModalAddToCart = () => {
    if (selectedProduct) {
      const cartItem = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: getModalPrice(),
        originalPrice: getModalOriginalPrice(),
        weight: selectedWeight,
        quantity: modalQuantity,
        image: selectedProduct.image
      };
      
      if (isEditing && editingCartItem) {
        // Replace the existing item
        const updatedCart = cart.map(item => 
          item.id === editingCartItem.id && item.weight === editingCartItem.weight
            ? { ...cartItem }
            : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedCart }));
      } else {
        // Add new item directly to cart
        console.log('Adding to cart:', cartItem);
        
        // Get existing cart from localStorage
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if item already exists
        const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
        
        if (existingItemIndex === -1) {
          // Add new item
          const updatedCart = [...existingCart, cartItem];
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          setCart(updatedCart);
        } else {
          // Update existing item quantity
          const updatedCart = existingCart.map(item =>
            item.id === cartItem.id
              ? { ...item, quantity: item.quantity + cartItem.quantity }
              : item
          );
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          setCart(updatedCart);
        }
        
        // Update cart count in navbar
        const finalCart = JSON.parse(localStorage.getItem('cart')) || [];
        const uniqueItems = finalCart.length;
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
      }
      closeModal();
      setShowCartModal(true);
      console.log('Cart modal should be visible now');
    }
  };

  const openCartModal = () => {
    setShowCartModal(true);
  };


  const closeCartModal = () => {
    setShowCartModal(false);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const updateCartQuantity = (itemId, change) => {
    const updatedCart = cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update cart count in navbar
    const uniqueItems = updatedCart.length;
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update cart count in navbar
    const uniqueItems = updatedCart.length;
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
  };

  const toggleLike = async (product) => {
    const isLiked = likedProducts.some(liked => liked.id === product.id);
    
    let updatedLikes;
    if (isLiked) {
      // Remove from likes
      updatedLikes = likedProducts.filter(liked => liked.id !== product.id);
    } else {
      // Add to likes with default rating - ensure proper format for backend
      const wishlistItem = {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        weight: product.weight,
        rating: 4
      };
      updatedLikes = [...likedProducts, wishlistItem];
    }
    
    setLikedProducts(updatedLikes);
    localStorage.setItem('wishlist', JSON.stringify(updatedLikes));
    
    // Sync to backend
    const mobile = userData?.mobile || phoneNumber;
    if (mobile) {
      await syncWishlistToBackend(updatedLikes, mobile);
    }
    
    // Trigger wishlist count update in navbar
    const finalCount = updatedLikes.length;
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: finalCount }));
  };


  const applyFilters = (products, filterSettings) => {
    let filtered = [...products];

    // Filter by selected items (subcategories)
    if (filterSettings.selectedItems && filterSettings.selectedItems.length > 0) {
      const selectedProductNames = filterSettings.selectedItems.flatMap(item => item.products);
      filtered = filtered.filter(product => 
        selectedProductNames.some(selectedName => 
          product.name.toLowerCase().includes(selectedName.toLowerCase())
        )
      );
    }

    // Filter by package types
    if (filterSettings.selectedPackageTypes && filterSettings.selectedPackageTypes.length > 0) {
      filtered = filtered.filter(product => 
        filterSettings.selectedPackageTypes.some(packageType => 
          product.name.toLowerCase().includes(packageType.toLowerCase())
        )
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= filterSettings.priceRange[0] && 
      product.price <= filterSettings.priceRange[1]
    );

    // Filter by availability
    if (filterSettings.availability === 'in-stock') {
      filtered = filtered.filter(product => product.inStock);
    } else if (filterSettings.availability === 'out-of-stock') {
      filtered = filtered.filter(product => !product.inStock);
    }

    // Filter by organic only
    if (filterSettings.organicOnly) {
      filtered = filtered.filter(product => product.organic);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filterSettings.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
          return Math.random() - 0.5; // Random for demo
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredProductsList = applyFilters(baseProducts, filters);

  useEffect(() => {
    setFilteredProducts(applyFilters(baseProducts, filters));
    // Load liked products from localStorage
    const savedLikes = JSON.parse(localStorage.getItem('wishlist')) || [];
    setLikedProducts(savedLikes);
  }, [filters]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Listen for wishlist updates from other components
  useEffect(() => {
    const handleWishlistUpdated = () => {
      const savedLikes = JSON.parse(localStorage.getItem('wishlist')) || [];
      setLikedProducts(savedLikes);
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdated);
    window.addEventListener('storage', handleWishlistUpdated);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
      window.removeEventListener('storage', handleWishlistUpdated);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortDropdown && !event.target.closest('.sort-dropdown-container')) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown]);

  return (
    <div className="sweetener-page">
      <div className="sweetener-container">
        <div className="sweetener-content">
          <div className="sweetener-sidebar">
            {/* <Filter 
              onFilterChange={handleFilterChange}
              categories={[{ id: 'sweeteners', name: 'Sweeteners', products: baseProducts }]}
              selectedCategory="sweeteners"
            /> */}
          </div>
          
          <div className="sweetener-main">
            <div className="sweetener-header">
              <h1 className="sweetener-title">Sweeteners</h1>
              <p className="sweetener-subtitle">Discover our premium collection of organic sweeteners and jaggery</p>
            </div>
            
            <div className="sweetener-info">
              <div className="sweetener-info-content">
              <p className="sweetener-count">
                {filters.selectedItems && filters.selectedItems.length > 0 ? (
                  `Showing ${filteredProductsList.length} products from selected categories`
                ) : filters.selectedPackageTypes && filters.selectedPackageTypes.length > 0 ? (
                  `Showing ${filteredProductsList.length} products from selected package types`
                ) : (
                  `Showing ${filteredProductsList.length} of ${baseProducts.length} products`
                )}
              </p>
              
                {/* Sort Dropdown */}
                <div className="sort-dropdown-container">
                  <button 
                    className={`sort-dropdown-trigger ${showSortDropdown ? 'active' : ''}`}
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                  >
                    <span>{getCurrentSortLabel()}</span>
                    <img 
                      src={downIcon} 
                      alt="dropdown" 
                      className={`sort-arrow ${showSortDropdown ? 'open' : ''}`}
                    />
                  </button>
                  
                  {showSortDropdown && (
                    <div className="sort-dropdown-menu">
                      {sortOptions.map((option) => (
                        <button 
                          key={option.value}
                          className={`sort-option ${filters.sortBy === option.value ? 'active' : ''}`}
                          onClick={() => handleSortChange(option.value)}
                        >
                          {option.label}
                        </button>
                    ))}
                  </div>
                  )}
                  </div>
                </div>
              
            </div>
            
            <div className="sweetener-scroll-container">
              <div className="sweetener-grid">
                {filteredProductsList.map((product, index) => {
                  const cartQuantity = getCartItemQuantity(product.id, '1kg');
                  const currentPrice = product.price;
                  const currentOriginalPrice = product.originalPrice;
                  const cartKey = `${product.id}-1kg`;
                  
                  return (
                    <div key={product.id} className="sweetener-product-card">
                      {/* Discount Badge */}
                      <div className="discount-badge">
                        -{product.discount}%
                      </div>
                      
                      {/* Heart Icon */}
                      <button 
                        className={`heart-icon ${isProductLiked(product.id) ? 'liked' : ''}`}
                        onClick={() => toggleLike(product)}
                        title={isProductLiked(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>

                      {/* Product Image */}
                      <div className="product-image-container">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="product-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="product-image-placeholder" style={{display: 'none'}}>
                          <span className="product-emoji">🍯</span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="product-details">
                        <h3 className="product-name">{product.name}</h3>
                        
                        <div className="product-pricing">
                          <span className="current-price">
                            ₹{cartQuantity > 0 ? currentPrice * cartQuantity : currentPrice}
                          </span>
                          <span className="original-price">
                            ₹{cartQuantity > 0 ? currentOriginalPrice * cartQuantity : currentOriginalPrice}
                          </span>
                          <span className="discount-percentage">
                            ({product.discount}% Off)
                          </span>
                        </div>
                        
                        <div className="view-details-section">
                          <a 
                            href="#"
                            className="view-details-link"
                            onClick={(e) => {
                              e.preventDefault();
                              openViewMore(product);
                            }}
                          >
                            View More Details
                          </a>
                        </div>
                        
                        <div className="product-actions">
                          <button 
                            className="add-btn"
                            onClick={() => openModal(product)}
                          >
                            <span>Add To Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {filteredProductsList.length === 0 && (
              <div className="no-products">
                <p>No sweetener products found matching your filters.</p>
                <button 
                  className="clear-filters-btn"
                  onClick={() => handleFilterChange({
                    priceRange: [0, 1000],
                    sortBy: 'name',
                    availability: 'all',
                    organicOnly: false,
                    selectedCategory: 'sweeteners',
                    selectedItems: [],
                    selectedPackageTypes: []
                  })}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Success Notification Popup */}
      {showNotification && (
        <div className="success-notification">
          <div className="notification-content">
            <span className="notification-icon">✅</span>
            <span className="notification-text">Item added to cart successfully!</span>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} title="Close">
              <img src={closeGif} alt="Close" className="close-icon" />
            </button>
            
            <div className="modal-product-info">
              <div className="modal-product-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="modal-product-details">
                <h3 className="modal-product-name">{selectedProduct.name}</h3>
                <div className="modal-pricing">
                  <span className="modal-original-price">₹{getModalOriginalPrice().toFixed(2)}</span>
                  <span className="modal-current-price">₹{getModalPrice().toFixed(2)}</span>
                  <p className="modal-tax-info">(Inc. of all taxes)</p>
                </div>
              </div>
            </div>

            <div className="modal-size-section">
              <p className="modal-size-label">Size: {selectedWeight}</p>
              <div className="modal-weight-options">
                <button 
                  className={`modal-weight-btn ${selectedWeight === '500g' ? 'selected' : ''}`}
                  onClick={() => handleWeightChange('500g')}
                >
                  <span className="weight-text">500 g</span>
                  <div className="weight-pricing">
                    <span className="weight-original-price">₹{selectedProduct.originalPrice.toFixed(2)}</span>
                    <span className="weight-current-price">₹{selectedProduct.price.toFixed(2)}</span>
                  </div>
                  <div className="discount-badge-modal">4% OFF</div>
                </button>
                
                <button 
                  className={`modal-weight-btn ${selectedWeight === '1kg' ? 'selected' : ''}`}
                  onClick={() => handleWeightChange('1kg')}
                >
                  <span className="weight-text">1 kg</span>
                  <div className="weight-pricing">
                    <span className="weight-original-price">₹{(selectedProduct.originalPrice * 2).toFixed(2)}</span>
                    <span className="weight-current-price">₹{(selectedProduct.price * 2).toFixed(2)}</span>
                  </div>
                  <div className="discount-badge-modal">4% OFF</div>
                </button>
              </div>
            </div>

            <div className="modal-quantity-section">
              <div className="modal-quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="quantity-display">{modalQuantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-add-to-cart-btn" onClick={handleModalAddToCart}>
                {isEditing ? 'REPLACE ITEM' : 'ADD TO CART'}
              </button>
              <a href="#" className="modal-view-details" onClick={(e) => e.preventDefault()}>
                View full details →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Modal */}
      {showCartModal && (() => {
        console.log('Rendering cart modal, cart items:', cart);
        return (
        <div className="cart-modal-overlay" onClick={closeCartModal}>
          <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>SHOPPING CART</h2>
              <button 
                className="cart-close-btn"
                onClick={closeCartModal}
                title="Close"
              >
                <img src={closeGif} alt="Close" className="close-gif" />
              </button>
            </div>
            

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-weight">{item.weight}</p>
                    <div className="cart-item-pricing">
                      <span className="cart-original-price">₹{item.originalPrice.toFixed(2)}</span>
                      <span className="cart-current-price">₹{item.price.toFixed(2)}</span>
                    </div>
                    <div className="cart-quantity-controls">
                      <button 
                        className="cart-quantity-btn"
                        onClick={() => updateCartQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="cart-quantity">{item.quantity}</span>
                      <button 
                        className="cart-quantity-btn"
                        onClick={() => updateCartQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-actions">
                      <button 
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove"
                      >
                        <img src={binIcon} alt="Remove" />
                      </button>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            <div className="cart-summary">
              <div className="cart-subtotal">
                <span>Subtotal:</span>
                <span>₹{getCartSubtotal().toFixed(2)}</span>
              </div>
              <p className="cart-tax-info">Taxes and shipping calculated at checkout.</p>
              
              <div className="cart-actions">
                <button 
                  className="cart-view-btn"
                  onClick={() => {
                    closeCartModal();
                    navigate('/cart');
                  }}
                >
                  VIEW CART
                </button>
                <button 
                  className="cart-buy-btn"
                  onClick={() => {
                    closeCartModal();
                    navigate('/cart');
                  }}
                >
                  BUY NOW
                  <div className="payment-icons">
                    <img src={visaIcon} alt="Visa" />
                    <img src={mastercardIcon} alt="Mastercard" />
                    <img src={rupayIcon} alt="RuPay" />
                    <img src={upiIcon} alt="UPI" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {/* View More Details Component */}
      {showViewMore && selectedViewMoreProduct && (
        <ViewMoreDetails 
          product={selectedViewMoreProduct} 
          onClose={closeViewMore} 
        />
      )}
    </div>
  );
};

export default Sweetener;
