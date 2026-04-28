import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { syncWishlistToBackend } from '../../utils/syncUserData';
import './BestSellers.css';
import ViewMoreDetails from '../Pulses/ViewMoreDetails';
import closeGif from '../../assets/close.gif';
import binIcon from '../../assets/bin.png';
import editIcon from '../../assets/editing.png';
import mastercardIcon from '../../assets/mastercard.png';
import rupayIcon from '../../assets/rupay.png';
import upiIcon from '../../assets/upi (1).png';
import visaIcon from '../../assets/visa.png';
import almondImage from '../../assets/almond.png';
import cashewnutImage from '../../assets/cashewnut.png';
import jeggaryImage from '../../assets/jeggary.png';
import chanadalImage from '../../assets/chanadal.png';
import chilly2Image from '../../assets/chilly2.png';
import termeric5Image from '../../assets/termeric5.png';
import pistaImage from '../../assets/pista1.png';
import raisinImage from '../../assets/rainse1.png';

const BestSellers = () => {
  const navigate = useNavigate();
  const { userData, phoneNumber } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [showViewMore, setShowViewMore] = useState(false);
  const [selectedViewMoreProduct, setSelectedViewMoreProduct] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [modalQuantity, setModalQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCartItem, setEditingCartItem] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const trendingProducts = [
    {
      id: 1,
      name: 'Almonds',
      price: 450,
      originalPrice: 500,
      image: almondImage,
      discount: 10,
      inStock: true,
      organic: true,
      weight: '250g',
      description: 'Premium quality organic almonds, rich in protein and healthy fats. Perfect for snacking and cooking.',
      rating: 4.9,
      reviews: '2k+'
    },
    {
      id: 2,
      name: 'Cashews',
      price: 500,
      originalPrice: 550,
      image: cashewnutImage,
      discount: 9,
      inStock: true,
      organic: true,
      weight: '250g',
      description: 'Creamy and delicious organic cashews. Rich in nutrients and perfect for healthy snacking.',
      rating: 4.9,
      reviews: '1.5k+'
    },
    {
      id: 3,
      name: 'Chana Dal',
      price: 75,
      originalPrice: 85,
      image: chanadalImage,
      discount: 12,
      inStock: true,
      organic: true,
      weight: '500g',
      description: 'High-protein organic chana dal. Perfect for traditional Indian dishes and healthy meals.',
      rating: 4.8,
      reviews: '800+'
    },
    {
      id: 4,
      name: 'Red Chilly Powder',
      price: 75,
      originalPrice: 80,
      image: chilly2Image,
      discount: 6,
      inStock: true,
      organic: true,
      weight: '100g',
      description: 'Spicy and bold organic red chili powder. Adds flavor and heat to your favorite dishes.',
      rating: 4.7,
      reviews: '600+'
    },
    {
      id: 5,
      name: 'Jaggery',
      price: 70,
      originalPrice: 80,
      image: jeggaryImage,
      discount: 12,
      inStock: true,
      organic: true,
      weight: '1kg',
      description: 'Natural sweetener made from organic sugarcane. Rich in minerals and perfect for healthy cooking.',
      rating: 4.9,
      reviews: '1.2k+'
    },
    {
      id: 6,
      name: 'Turmeric Powder',
      price: 95,
      originalPrice: 110,
      image: termeric5Image,
      discount: 14,
      inStock: true,
      organic: true,
      weight: '250g',
      description: 'Pure organic turmeric powder. Known for its health benefits and vibrant golden color.',
      rating: 4.8,
      reviews: '900+'
    },
    {
      id: 7,
      name: 'Pistachios',
      price: 600,
      originalPrice: 650,
      image: pistaImage,
      discount: 8,
      inStock: true,
      organic: true,
      weight: '250g',
      description: 'Premium quality organic pistachios. Rich in nutrients and perfect for healthy snacking.',
      rating: 4.9,
      reviews: '1k+'
    },
    {
      id: 8,
      name: 'Raisins',
      price: 200,
      originalPrice: 220,
      image: raisinImage,
      discount: 9,
      inStock: true,
      organic: true,
      weight: '500g',
      description: 'Sweet and chewy organic raisins. Perfect for snacking, baking, and adding to your meals.',
      rating: 4.7,
      reviews: '700+'
    }
  ];

  const [productsPerPage, setProductsPerPage] = useState(4);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      if (width <= 480) {
        setProductsPerPage(1);
      } else if (width <= 768) {
        setProductsPerPage(2);
      } else if (width <= 1200) {
        setProductsPerPage(3);
      } else {
        setProductsPerPage(4);
      }
      
      // Reset currentIndex when screen size changes to prevent cards from disappearing
      setCurrentIndex(0);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, trendingProducts.length - productsPerPage);

  const handleNext = () => {
    if (!isTransitioning && currentIndex < maxIndex) {
      const moveBy = windowWidth <= 768 ? 1 : 1;
      setCurrentIndex((prev) => Math.min(prev + moveBy, maxIndex));
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  };

  const handlePrevious = () => {
    if (!isTransitioning && currentIndex > 0) {
      const moveBy = windowWidth <= 768 ? 1 : 1;
      setCurrentIndex((prev) => Math.max(prev - moveBy, 0));
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  };

  // Don't slice - we'll show all products and slide them

  // Load liked products from localStorage or backend
  useEffect(() => {
    const mobile = userData?.mobile || phoneNumber;
    if (mobile && userData?.wishlist && userData.wishlist.length > 0) {
      // Load from backend if available
      setLikedProducts(userData.wishlist);
      localStorage.setItem('wishlist', JSON.stringify(userData.wishlist));
    } else {
      // Fallback to localStorage
      const savedLikes = JSON.parse(localStorage.getItem('wishlist')) || [];
      setLikedProducts(savedLikes);
      // Sync to backend if user is logged in
      if (mobile && savedLikes.length > 0) {
        syncWishlistToBackend(savedLikes, mobile);
      }
    }
  }, [userData, phoneNumber]);

  const addToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      weight: product.weight,
      quantity: 1
    };
    
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex === -1) {
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = existingCart.map(item =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    // Update local cart state
    const finalCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(finalCart);
    
    // Update cart count in navbar
    const uniqueItems = finalCart.length;
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
    
    // Show cart modal instead of alert
    setShowCartModal(true);
  };

  const toggleLike = async (productId) => {
    console.log('toggleLike called with productId:', productId);
    
    // Find the product from trendingProducts array
    const product = trendingProducts.find(p => p.id === productId);
    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    console.log('Product found:', product);

    // Check if product is already liked (support both ID-only and full object formats)
    const isLiked = likedProducts.some(item => {
      if (typeof item === 'string' || typeof item === 'number') {
        return item === productId;
      }
      return item.id === productId || item.id === productId.toString();
    });

    console.log('Is product liked?', isLiked);
    console.log('Current likedProducts:', likedProducts);

    let updatedLikes;
    
    if (isLiked) {
      // Remove from wishlist
      updatedLikes = likedProducts.filter(item => {
        if (typeof item === 'string' || typeof item === 'number') {
          return item !== productId;
        }
        return item.id !== productId && item.id !== productId.toString();
      });
      console.log('Removing from wishlist. Updated likes:', updatedLikes);
    } else {
      // Add to wishlist as full product object (backend format)
      const wishlistItem = {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        weight: product.weight,
        discount: product.discount || 10,
        rating: product.rating || 4,
        reviews: product.reviews || '0',
        inStock: product.inStock,
        organic: product.organic
      };
      updatedLikes = [...likedProducts, wishlistItem];
      console.log('Adding to wishlist. Updated likes:', updatedLikes);
    }
    
    setLikedProducts(updatedLikes);
    localStorage.setItem('wishlist', JSON.stringify(updatedLikes));
    console.log('Wishlist saved to localStorage');
    
    // Sync to backend if user is logged in
    const mobile = userData?.mobile || phoneNumber;
    if (mobile) {
      try {
        await syncWishlistToBackend(updatedLikes, mobile);
        console.log('Wishlist synced to backend');
      } catch (error) {
        console.error('Error syncing wishlist to backend:', error);
      }
    } else {
      console.log('User not logged in, wishlist saved to localStorage only');
    }
    
    // Update wishlist count in navbar
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: updatedLikes.length }));
    console.log('Wishlist updated event dispatched with count:', updatedLikes.length);
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleImageClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const openViewMore = (product) => {
    setSelectedViewMoreProduct(product);
    setShowViewMore(true);
  };

  const closeViewMore = () => {
    setShowViewMore(false);
    setSelectedViewMoreProduct(null);
  };

  const openCartModal = () => {
    setShowCartModal(true);
  };

  const closeCartModal = () => {
    setShowCartModal(false);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const updateCartQuantity = (itemId, change) => {
    const updatedCart = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update cart count in navbar
    const uniqueItems = updatedCart.length;
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update cart count in navbar
    const uniqueItems = updatedCart.length;
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
  };

  // Weight options and pricing
  const weightOptions = [
    { value: '500g', label: '500g', multiplier: 1 },
    { value: '1kg', label: '1 kg', multiplier: 2 }
  ];

  // Modal functions
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedWeight('500g');
    setModalQuantity(1);
    setIsEditing(false);
    setEditingCartItem(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSelectedWeight('500g');
    setModalQuantity(1);
    setIsEditing(false);
    setEditingCartItem(null);
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
        const updatedCart = cartItems.map(item => 
          item.id === editingCartItem.id && item.weight === editingCartItem.weight
            ? { ...cartItem }
            : item
        );
        setCartItems(updatedCart);
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
          // Add new item to cart
          const updatedCart = [...existingCart, cartItem];
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          setCartItems(updatedCart);
        } else {
          // Update existing item quantity
          const updatedCart = existingCart.map(item =>
            item.id === cartItem.id
              ? { ...item, quantity: item.quantity + cartItem.quantity }
              : item
          );
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          setCartItems(updatedCart);
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

  return (
    <section className="best-sellers">
      <div className="best-sellers-container">
        <div className="best-sellers-content">
          <div className="best-sellers-main">
            <div className="best-sellers-header">
              <div className="best-sellers-header-content">
                <h2 className="best-sellers-title">Trending Now</h2>
              </div>
            </div>
            
            
            <div className="trending-carousel-container">
              <div className="trending-carousel-wrapper">
                {trendingProducts.length > productsPerPage && (
                  <button 
                    className="trending-carousel-arrow trending-arrow-left" 
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </button>
                )}
                
                <div className="trending-carousel-slider">
                  <div 
                    className="trending-products-grid"
                    style={{
                      transform: windowWidth <= 480 
                        ? `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 0.75}rem))`
                        : windowWidth <= 768
                        ? `translateX(calc(-${currentIndex * 50}% - ${currentIndex * 0.5}rem))`
                        : windowWidth <= 1200
                        ? `translateX(calc(-${currentIndex * 33.333}% - ${currentIndex * 0.5}rem))`
                        : `translateX(calc(-${currentIndex * 25}% - ${currentIndex * 0.375}rem))`,
                      transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                      willChange: 'transform'
                    }}
                  >
                    {trendingProducts.map((product) => {
                    const isLiked = likedProducts.some(item => {
                      if (typeof item === 'string' || typeof item === 'number') {
                        return item === product.id;
                      }
                      return item.id === product.id || item.id === product.id.toString();
                    });

                    return (
                      <div key={product.id} className="trending-product-card">
                        <div className="trending-product-image-container">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="trending-product-image"
                            onClick={() => handleImageClick(product)}
                            style={{ cursor: 'pointer' }}
                          />
                          
                          {/* Hover Icons */}
                          <div className="trending-hover-icons">
                            <button
                              type="button"
                              className={`trending-hover-icon trending-like-icon ${isLiked ? 'liked' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Heart icon clicked for product:', product.id);
                                toggleLike(product.id);
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? "#e74c3c" : "none"} stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                              </svg>
                            </button>
                            
                            <button
                              className="trending-hover-icon trending-view-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(product);
                              }}
                              title="View Details"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </button>
                            
                            <button
                              className="trending-hover-icon trending-cart-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/cart');
                              }}
                              title="Go to Cart"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1"/>
                                <circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="trending-product-details">
                          <h3 className="trending-product-name">{product.name}</h3>
                          
                          <div className="trending-product-pricing">
                            <span className="trending-original-price">₹{product.originalPrice}</span>
                            <span className="trending-current-price">₹{product.price}</span>
                          </div>
                          
                          <div className="trending-product-rating">
                            <div className="trending-stars">
                              {[...Array(5)].map((_, i) => {
                                const rating = product.rating;
                                const fullStars = Math.floor(rating);
                                const hasHalfStar = rating % 1 >= 0.5;
                                
                                if (i < fullStars) {
                                  return <span key={i} className="star-filled">★</span>;
                                } else if (i === fullStars && hasHalfStar) {
                                  return <span key={i} className="star-half">★</span>;
                                } else {
                                  return <span key={i} className="star-empty">★</span>;
                                }
                              })}
                            </div>
                            <span className="trending-rating-text">{product.reviews} reviews</span>
                          </div>
                          
                          <div className="trending-product-actions">
                            <button 
                              className="trending-add-to-cart-btn"
                              onClick={() => openModal(product)}
                            >
                              <span>ADD TO CART</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                </div>
                
                {trendingProducts.length > productsPerPage && (
                  <button 
                    className="trending-carousel-arrow trending-arrow-right" 
                    onClick={handleNext}
                    disabled={currentIndex >= maxIndex}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* View More Details Modal */}
      {showViewMore && selectedViewMoreProduct && (
        <ViewMoreDetails 
          product={selectedViewMoreProduct} 
          onClose={closeViewMore} 
        />
      )}

      {/* Weight Selection Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal} style={{ zIndex: 99999, position: 'fixed' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ zIndex: 99999 }}>
            <button className="modal-close" onClick={closeModal} title="Close">
              <img src={closeGif} alt="Close" className="close-icon" />
            </button>
            
            <div className="modal-product-info-row">
              <div className="modal-product-image-left">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="modal-pricing-right">
                <h3 className="modal-product-name">{selectedProduct.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="modal-original-price">₹{getModalOriginalPrice().toFixed(2)}</span>
                  <span className="modal-current-price">₹{getModalPrice().toFixed(2)}</span>
                </div>
                <p className="modal-tax-info">(Inc. of all taxes)</p>
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
                  <div className="discount-badge-modal">{selectedProduct.discount}% OFF</div>
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
                  <div className="discount-badge-modal">{selectedProduct.discount}% OFF</div>
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
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Modal */}
      {showCartModal && (
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
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
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
                        className="cart-edit-btn"
                        onClick={() => {
                          setEditingCartItem(item);
                          setSelectedProduct({
                            id: item.id,
                            name: item.name,
                            price: item.price / item.quantity,
                            originalPrice: item.originalPrice / item.quantity,
                            image: item.image
                          });
                          setSelectedWeight(item.weight);
                          setModalQuantity(item.quantity);
                          setIsEditing(true);
                          closeCartModal();
                          setShowModal(true);
                        }}
                        title="Edit"
                      >
                        <img src={editIcon} alt="Edit" />
                      </button>
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
      )}
    </section>
  );
};

export default BestSellers;
