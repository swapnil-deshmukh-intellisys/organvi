import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { syncWishlistToBackend } from '../../utils/syncUserData';
import '../All_Categories/AllCategories.css';
import './Likeproduct.css';
import ViewMoreDetails from '../Pulses/ViewMoreDetails';

const Likeproduct = () => {
  const { userData, phoneNumber } = useUser();
  const [likedProducts, setLikedProducts] = useState([]);
  const [showViewMore, setShowViewMore] = useState(false);
  const [selectedViewMoreProduct, setSelectedViewMoreProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('1kg');
  const [modalQuantity, setModalQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

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

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedWeight('1kg');
    setModalQuantity(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSelectedWeight('1kg');
    setModalQuantity(1);
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
        id: `${selectedProduct.id}-${selectedWeight}`,
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
      } else {
        // Update existing item quantity
        const updatedCart = existingCart.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      
      // Update cart count in navbar
      const finalCart = JSON.parse(localStorage.getItem('cart')) || [];
      const uniqueItems = finalCart.length;
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
      
      // Show success notification
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
    closeModal();
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
                <div className="all-products-grid">
                  {likedProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      {/* Discount Badge */}
                      <div className="discount-badge">
                        -{product.discount || 10}%
                      </div>
                      
                      {/* Heart Icon - Filled since it's liked */}
                      <button 
                        className="heart-icon liked"
                        onClick={() => removeFromLikes(product.id)}
                        title="Remove from wishlist"
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
                          <span className="product-emoji">🌱</span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="product-details">
                        <h3 className="product-name">{product.name}</h3>
                        
                        <div className="product-pricing">
                          <span className="current-price">₹{product.price}</span>
                          <span className="original-price">₹{product.originalPrice || product.price}</span>
                          <span className="discount-percentage">
                            ({product.discount || 10}% Off)
                          </span>
                        </div>
                        
                        {/* View More Details Link - positioned above Add to Cart button and right aligned */}
                        <div className="view-details-section">
                          <button 
                            className="view-details-link"
                            onClick={() => openViewMore(product)}
                          >
                            View More Details
                          </button>
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
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} title="Close">
              ×
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
              <p className="modal-quantity-label">Quantity</p>
              <div className="modal-quantity-controls">
                <button 
                  className="modal-quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={modalQuantity <= 1}
                >
                  -
                </button>
                <span className="modal-quantity-display">{modalQuantity}</span>
                <button 
                  className="modal-quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal-total-section">
              <div className="modal-total-price">
                <span className="modal-total-label">Total: </span>
                <span className="modal-total-amount">₹{(getModalPrice() * modalQuantity).toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-add-to-cart-btn" onClick={handleModalAddToCart}>
                Add to Cart
              </button>
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
