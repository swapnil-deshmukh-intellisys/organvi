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

  const bestSellerProducts = [
    {
      id: 1,
      name: 'Organic Almonds',
      price: 450,
      originalPrice: 500,
      image: almondImage,
      discount: 10,
      inStock: true,
      organic: true,
      weight: '500g'
    },
    {
      id: 2,
      name: 'Organic Cashew Nuts',
      price: 380,
      originalPrice: 420,
      image: cashewnutImage,
      discount: 10,
      inStock: true,
      organic: true,
      weight: '500g'
    },
    {
      id: 3,
      name: 'Organic Jaggery',
      price: 70,
      originalPrice: 80,
      image: jeggaryImage,
      discount: 12,
      inStock: true,
      organic: true,
      weight: '1kg'
    }
  ];

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
    // Find the product from bestSellerProducts array
    const product = bestSellerProducts.find(p => p.id === productId);
    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    // Check if product is already liked (support both ID-only and full object formats)
    const isLiked = likedProducts.some(item => {
      if (typeof item === 'string' || typeof item === 'number') {
        return item === productId;
      }
      return item.id === productId;
    });

    let updatedLikes;
    
    if (isLiked) {
      // Remove from wishlist
      updatedLikes = likedProducts.filter(item => {
        if (typeof item === 'string' || typeof item === 'number') {
          return item !== productId;
        }
        return item.id !== productId;
      });
    } else {
      // Add to wishlist as full product object (backend format)
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
    
    // Update wishlist count in navbar
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: updatedLikes.length }));
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
                <h2 className="best-sellers-title">Best Seller Products</h2>
                <Link to="/allcategories" className="view-more-link">
                  View More Products →
                </Link>
              </div>
            </div>
            
            
            <div className="best-sellers-scroll-container">
              <div className="best-sellers-grid">
                {bestSellerProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="discount-badge">
                      Save {product.discount}%
                    </div>
                    
                    <button
                      className={`heart-icon ${likedProducts.includes(product.id) ? 'liked' : ''}`}
                      onClick={() => toggleLike(product.id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    
                    <div className="product-image-container">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    
                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      
                      <div className="product-pricing">
                        <span className="current-price">₹{product.price}</span>
                        <span className="original-price">₹{product.originalPrice}</span>
                      </div>
                      
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
                          className="add-to-cart-btn"
                          onClick={() => openModal(product)}
                        >
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
