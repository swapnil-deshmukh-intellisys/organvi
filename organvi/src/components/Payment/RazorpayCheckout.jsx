import React, { useState } from 'react';
import './RazorpayCheckout.css';

const RazorpayCheckout = ({ cartItems, totalAmount, onPaymentSuccess, onPaymentFailure }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Customer Info, 2: Order Summary, 3: Payment
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Create order on backend
  const createOrder = async (amount) => {
    try {
      const response = await fetch('http://localhost:5000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        })
      });

      const data = await response.json();
      
      if (data.id) {
        return data;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  // Open Razorpay Checkout
  const openRazorpayCheckout = async () => {
    setLoading(true);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create order
      const order = await createOrder(totalAmount);
      console.log('Order created:', order);

      // Razorpay options
      const options = {
        key: 'rzp_live_RR0vKQoF2een0i', // Your key_id
        amount: order.amount,
        currency: order.currency,
        name: 'Organvi',
        description: 'Organic Products Purchase',
        order_id: order.id,
        image: 'https://your-logo-url.com/logo.png', // Add your logo URL
        handler: function (response) {
          console.log('Payment Success Response:', response);
          onPaymentSuccess(response);
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        notes: {
          address: customerDetails.address,
          items: JSON.stringify(cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })))
        },
        theme: {
          color: '#4CAF50'
        },
        modal: {
          ondismiss: function() {
            onPaymentFailure('Payment cancelled by user');
          }
        },
        // Enable all payment methods
        method: {
          netbanking: true,
          wallet: true,
          upi: true,
          card: true,
          emi: true
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment Error:', error);
      onPaymentFailure('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Move to order summary step
    setCurrentStep(2);
  };

  const handleProceedToPayment = () => {
    setCurrentStep(3);
    // Open Razorpay checkout after a short delay
    setTimeout(() => {
      openRazorpayCheckout();
    }, 500);
  };

  return (
    <div className="razorpay-checkout-container">
      <div className="checkout-form">
        <h2>Complete Your Purchase</h2>
        <p className="checkout-subtitle">Fill in your details to proceed with payment</p>
        
        {/* Step 1: Customer Information */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerDetails.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerDetails.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerDetails.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={customerDetails.address}
                onChange={handleInputChange}
                placeholder="Enter your delivery address"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="proceed-payment-btn"
            disabled={loading}
          >
            Next - Review Order
          </button>
        </form>
        )}

        {/* Step 2: Order Summary */}
        {currentStep === 2 && (
          <div className="order-summary-step">
            <h3>Order Summary</h3>
            <div className="order-items">
              {cartItems.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-weight">{item.weight}</span>
                  </div>
                  <div className="item-details">
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-section">
              <div className="total-row">
                <span>Total Amount:</span>
                <span className="total-amount">₹{totalAmount}</span>
              </div>
            </div>
            <div className="customer-info-summary">
              <h4>Delivery Information:</h4>
              <p><strong>Name:</strong> {customerDetails.name}</p>
              <p><strong>Email:</strong> {customerDetails.email}</p>
              <p><strong>Phone:</strong> {customerDetails.phone}</p>
              <p><strong>Address:</strong> {customerDetails.address || 'Not provided'}</p>
            </div>
            <div className="step-buttons">
              <button 
                className="back-btn"
                onClick={() => setCurrentStep(1)}
              >
                Back to Edit Details
              </button>
              <button 
                className="proceed-payment-btn"
                onClick={handleProceedToPayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Processing */}
        {currentStep === 3 && (
          <div className="payment-processing">
            <h3>Payment Processing</h3>
            <p>Opening payment gateway...</p>
            <div className="payment-methods-info">
              <h4>Available Payment Methods:</h4>
              <div className="payment-icons">
                <span className="payment-method">💳 Cards</span>
                <span className="payment-method">📱 UPI</span>
                <span className="payment-method">🏦 Net Banking</span>
                <span className="payment-method">💰 Wallets</span>
              </div>
            </div>
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Please wait while we open the payment gateway...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RazorpayCheckout;
