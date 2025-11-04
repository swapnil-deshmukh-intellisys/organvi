import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCart.css';

const AddCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
    // Update cart count in parent components
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items.length }));
  };

  const increaseQty = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedItems);
  };

  const decreaseQty = (id) => {
    const updatedItems = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      );
    updateCart(updatedItems);
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    updateCart(updatedItems);
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const getOriginalTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity * item.originalPrice, 0);
  };

  const getTotalSavings = () => {
    return getOriginalTotal() - getTotal();
  };

  return (
    <div className="addcart-container">
      <div className="addcart-header">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1>Your Cart</h1>
        <div className="cart-count">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/allcategories')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-weight">Weight: {item.weight}</p>
                  <div className="cart-item-pricing">
                    <span className="current-price">₹{item.price}</span>
                    <span className="original-price">₹{item.originalPrice}</span>
                    <span className="discount">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => decreaseQty(item.id)}
                    >
                      -
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => increaseQty(item.id)}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    ₹{item.quantity * item.price}
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
              <span>₹{getOriginalTotal()}</span>
            </div>
            <div className="summary-row discount-row">
              <span>Total Savings:</span>
              <span>-₹{getTotalSavings()}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span>₹{getTotal()}</span>
            </div>
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCart;
