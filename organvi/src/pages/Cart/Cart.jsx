import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { syncCartToBackend } from '../../utils/syncUserData';
import './Cart.css';
import binIcon from '../../assets/bin.png';
import editIcon from '../../assets/editing.png';
import PaymentForm from '../../components/Payment/PaymentForm';
import closeGif from '../../assets/close.gif';

const Carts = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { userData, phoneNumber, refreshUserData } = useUser();

  useEffect(() => {
    const loadCart = async () => {
      const mobile = userData?.mobile || phoneNumber;
      
      // Try to load from backend first if user is logged in
      if (mobile && userData?.cart && userData.cart.length > 0) {
        setCartItems(userData.cart);
        localStorage.setItem('cart', JSON.stringify(userData.cart));
      } else {
        // Fallback to localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
        // Sync to backend if user is logged in
        if (mobile && storedCart.length > 0) {
          await syncCartToBackend(storedCart, mobile);
        }
      }
    };
    
    loadCart();
    
    // Listen for cart updates from other components
    const handleCartUpdate = async () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(updatedCart);
      // Sync to backend
      const mobile = userData?.mobile || phoneNumber;
      if (mobile) {
        await syncCartToBackend(updatedCart, mobile);
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, [userData, phoneNumber]);

  const updateCart = async (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
    
    // Sync to backend if user is logged in
    const mobile = userData?.mobile || phoneNumber;
    if (mobile) {
      await syncCartToBackend(items, mobile);
    }
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
    const updatedItems = cartItems.filter((item) => item.id !== id);
    updateCart(updatedItems);
  };

  const editItem = (item) => {
    // Navigate back to the product page for editing
    navigate('/pulses');
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions to continue.');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = (response, orderData) => {
    console.log('Payment successful:', response);
    
    // If orderData is provided from PaymentForm, use it; otherwise create a basic one
    const finalOrderData = orderData || {
      orderId: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
      trackingId: `TRK${Date.now()}${Math.floor(Math.random() * 10000)}`,
      orderDate: new Date(),
      status: 'pending',
      paymentId: response.razorpay_payment_id,
      paymentSignature: response.razorpay_signature,
      totalAmount: getTotal(),
      customerDetails: {
        name: 'Customer Name',
        email: 'customer@email.com',
        phone: '9876543210'
      },
      shippingAddress: {
        line1: 'Delivery Address',
        city: 'City',
        state: 'State',
        pincode: '123456'
      },
      items: cartItems,
      paymentMethod: 'razorpay'
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(finalOrderData);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Clear cart after successful payment
    setCartItems([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: 0 }));
    
    // Navigate to order success page
    navigate('/payment-success');
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    alert('Payment failed: ' + error);
    setShowPayment(false);
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>SHOPPING CART</h1>
        <button 
          className="cart-close-btn"
          onClick={() => navigate('/')}
          title="Close"
        >
          <img src={closeGif} alt="Close" className="close-gif" />
        </button>
      </div>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div className="cart-table-container">
          <table className="cart-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="cart-row">
                  <td className="cart-product-cell" data-label="Product">
                    <div className="cart-product-info">
                      <img src={item.image} alt={item.name} className="cart-product-image" />
                      <div className="cart-product-details">
                        <h3 className="cart-product-name">{item.name}</h3>
                        <p className="cart-product-size">Size: {item.weight}</p>
                        <div className="cart-product-actions">
                          <button 
                            className="cart-delete-btn"
                            onClick={() => removeItem(item.id)}
                            title="Delete"
                          >
                            <img src={binIcon} alt="Delete" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="cart-price-cell" data-label="Price">
                    <div className="cart-price-info">
                      <span className="cart-original-price">₹{item.originalPrice.toFixed(2)}</span>
                      <span className="cart-current-price">₹{item.price.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="cart-quantity-cell" data-label="Quantity">
                    <div className="cart-quantity-controls">
                      <button 
                        className="cart-quantity-btn"
                        onClick={() => decreaseQty(item.id)}
                      >
                        -
                      </button>
                      <span className="cart-quantity-display">{item.quantity}</span>
                      <button 
                        className="cart-quantity-btn"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="cart-total-cell" data-label="Total">
                    <span className="cart-item-total">₹{(item.quantity * item.price).toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Checkout Section */}
          <div className="cart-checkout-section">
            <div className="cart-subtotal">
              <span className="cart-subtotal-label">SUBTOTAL:</span>
              <span className="cart-subtotal-amount">₹{getTotal().toFixed(2)}</span>
            </div>
            <p className="cart-taxes-note">Taxes and shipping calculated at checkout</p>
            
            <div className="cart-terms">
              <input 
                type="checkbox" 
                id="cart-terms-checkbox" 
                className="cart-terms-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="cart-terms-checkbox" className="cart-terms-label">
                I agree with the terms and conditions.
              </label>
            </div>
            
            <button 
              className={`cart-buy-now-btn ${agreeTerms ? '' : 'disabled'}`} 
              onClick={handleProceedToPayment}
              disabled={!agreeTerms}
            >
              <div className="cart-buy-now-top">
                <span className="cart-buy-now-text">BUY NOW</span>
                <div className="cart-payment-icons">
                  <img src="/src/assets/upi (1).png" alt="UPI" className="cart-payment-icon" />
                  <img src="/src/assets/rupay.png" alt="RuPay" className="cart-payment-icon" />
                  <img src="/src/assets/visa.png" alt="Visa" className="cart-payment-icon" />
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <button
              className="close-payment-btn"
              onClick={() => setShowPayment(false)}
            >
              <img src={closeGif} alt="Close" className="close-gif" />
            </button>
            <PaymentForm
              cartItems={cartItems}
              totalAmount={getTotal()}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={handlePaymentFailure}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Carts;