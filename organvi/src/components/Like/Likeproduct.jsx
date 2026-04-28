import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { syncWishlistToBackend } from '../../utils/syncUserData';
import '../All_Categories/AllCategories.css';
import '../BestSellers/BestSellers.css';
import './Likeproduct.css';
import ViewMoreDetails from '../Pulses/ViewMoreDetails';
import closeGif from '../../assets/close.gif';
import binIcon from '../../assets/bin.png';
import editIcon from '../../assets/editing.png';
import mastercardIcon from '../../assets/mastercard.png';
import rupayIcon from '../../assets/rupay.png';
import upiIcon from '../../assets/upi (1).png';
import visaIcon from '../../assets/visa.png';

const Likeproduct = () => {
  const navigate = useNavigate();
  const { userData, phoneNumber } = useUser();
  const [likedProducts, setLikedProducts] = useState([]);
  const [showViewMore, setShowViewMore] = useState(false);
  const [selectedViewMoreProduct, setSelectedViewMoreProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [modalQuantity, setModalQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load liked products from backend or localStorage
    const mobile = userData?.mobile || phoneNumber;
    if (mobile && userData?.wishlist && userData.wishlist.length > 0) {
      setLikedProducts(userData.wishlist);
      localStorage.setItem('wishlist', JSON.stringify(userData.wishlist));
    } else {
      const savedLikes = JSON.parse(localStorage.getItem('wishlist')) || [];
      setLikedProducts(savedLikes);
    }
  }, [userData, phoneNumber]);


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

  const removeFromLikes = async (productId) => {
    const updatedLikes = likedProducts.filter(product => {
      // Handle both string/number IDs and object IDs
      const id = typeof product === 'object' ? product.id : product;
      const compareId = typeof productId === 'string' || typeof productId === 'number' ? productId : productId.id;
      return String(id) !== String(compareId);
    });
    
    setLikedProducts(updatedLikes);
    localStorage.setItem('wishlist', JSON.stringify(updatedLikes));
    
    // Sync to backend
    const mobile = userData?.mobile || phoneNumber;
    if (mobile) {
      await syncWishlistToBackend(updatedLikes, mobile);
    }
    
    // Trigger wishlist count update in navbar
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: updatedLikes.length }));
  };

  // Load cart items
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(savedCart);
    };
    loadCart();

    const handleCartUpdated = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(savedCart);
    };

    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedWeight('500g');
    setModalQuantity(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSelectedWeight('500g');
    setModalQuantity(1);
  };

  const openCartModal = () => {
    setShowCartModal(true);
  };

  const closeCartModal = () => {
    setShowCartModal(false);
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
      
      closeModal();
      setShowCartModal(true);
    }
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedCart.length }));
  };

  const openViewMore = (product) => {
    setSelectedViewMoreProduct(product);
    setShowViewMore(true);
  };

  const closeViewMore = () => {
    setShowViewMore(false);
    setSelectedViewMoreProduct(null);
  };


  return (
    <div className="all-categories-page">
      <div className="all-categories-container">
        <div className="all-products-content">
          <div className="all-products-main">
            <div className="all-products-header">
              <div className="all-products-info">
                <div className="all-products-info-content">
                  <div className="all-products-text">
                    <h1 className="all-products-title">Your Liked Products</h1>
                    <p className="all-products-subtitle">{likedProducts.length} products in your wishlist</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="all-products-scroll-container">
              {likedProducts.length === 0 ? (
                <div className="empty-likes">
                  <Heart size={64} className="empty-heart" />
                  <h2>No liked products yet</h2>
                  <p>Start exploring and add products to your wishlist!</p>
                  <Link to="/" className="browse-btn">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="trending-products-grid" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', padding: '1rem 0' }}>
                  {likedProducts.map((product) => (
                    <div key={product.id} className="trending-product-card">
                      <div className="trending-product-image-container">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="trending-product-image"
                          onClick={() => navigate(`/product/${product.id}`)}
                          style={{ cursor: 'pointer' }}
                        />
                        
                        {/* Hover Icons */}
                        <div className="trending-hover-icons">
                          <button
                            type="button"
                            className="trending-hover-icon trending-like-icon liked"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeFromLikes(product.id);
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            title="Remove from Wishlist"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e74c3c" stroke="currentColor" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                          </button>
                          
                          <button
                            className="trending-hover-icon trending-view-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${product.id}`);
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
                              openModal(product);
                            }}
                            title="Add to Cart"
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
                          <span className="trending-original-price">₹{product.originalPrice || product.price}</span>
                          <span className="trending-current-price">₹{product.price}</span>
                        </div>
                        
                        <div className="trending-product-rating">
                          <div className="trending-stars">
                            {[...Array(5)].map((_, i) => {
                              const rating = product.rating || 4;
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
                          <span className="trending-rating-text">{product.reviews || '0'} reviews</span>
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
                  ))}
                </div>
              )}
            </div>
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
                ADD TO CART
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
                        onClick={() => {
                          const updatedCart = cartItems.map(cartItem =>
                            cartItem.id === item.id
                              ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) }
                              : cartItem
                          );
                          setCartItems(updatedCart);
                          localStorage.setItem('cart', JSON.stringify(updatedCart));
                          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedCart.length }));
                        }}
                      >
                        -
                      </button>
                      <span className="cart-quantity">{item.quantity}</span>
                      <button 
                        className="cart-quantity-btn"
                        onClick={() => {
                          const updatedCart = cartItems.map(cartItem =>
                            cartItem.id === item.id
                              ? { ...cartItem, quantity: cartItem.quantity + 1 }
                              : cartItem
                          );
                          setCartItems(updatedCart);
                          localStorage.setItem('cart', JSON.stringify(updatedCart));
                          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedCart.length }));
                        }}
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
      )}
      
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

export default Likeproduct;
