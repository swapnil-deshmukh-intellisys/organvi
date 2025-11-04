import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './PaymentForm.css';
import upiIcon from '../../assets/upi (1).png';
import cardIcon from '../../assets/mastercard.png';

const PaymentForm = ({ cartItems, totalAmount, onPaymentSuccess, onPaymentFailure }) => {
  const { userData, phoneNumber } = useUser();
  const [currentStep, setCurrentStep] = useState(1); // 1: Address + Summary, 2: Payment Methods
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  // Address book - now loaded from Dashboard Address component
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Load addresses from localStorage (Dashboard could also write to this key)
  useEffect(() => {
    // Prefill customer info once saved earlier
    try {
      const savedInfoRaw = localStorage.getItem('customerInfo');
      if (savedInfoRaw) {
        const savedInfo = JSON.parse(savedInfoRaw);
        setCustomerDetails(prev => ({
          ...prev,
          name: savedInfo.name || '',
          email: savedInfo.email || '',
          phone: savedInfo.phone || ''
        }));
      }
    } catch {}

    const raw = localStorage.getItem('addresses');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setAddresses(Array.isArray(parsed) ? parsed.slice(0, 1) : []);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedAddressId(parsed[0].id || 0);
        }
      } catch {}
    }
  }, []);


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
  const openRazorpayCheckout = async (paymentMethod) => {
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
        image: 'https://your-logo-url.com/logo.png',
    handler: async function (response) {
      console.log('Payment Success Response:', response);
      
      // Create order object with customer details
      const orderData = {
        orderId: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
        trackingId: `TRK${Date.now()}${Math.floor(Math.random() * 10000)}`,
        orderDate: new Date(),
        status: 'pending',
        paymentId: response.razorpay_payment_id,
        paymentSignature: response.razorpay_signature,
        totalAmount: totalAmount,
        customerDetails: customerDetails,
        shippingAddress: addresses.find(addr => addr.id === selectedAddressId),
        items: cartItems,
        paymentMethod: 'razorpay'
      };

      // Create Shiprocket shipment
      try {
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        const shipmentData = {
          userMobile: (userData?.mobile || phoneNumber || '').toString(),
          order_id: orderData.orderId,
          order_date: new Date().toISOString(),
          pickup_location: "Primary",
          billing_customer_name: customerDetails.name,
          billing_customer_email: customerDetails.email,
          billing_customer_phone: customerDetails.phone,
          shipping_address: selectedAddress?.line1 || 'Default Address',
          shipping_city: selectedAddress?.city || 'Mumbai',
          shipping_state: selectedAddress?.state || 'Maharashtra',
          shipping_country: 'India',
          shipping_pincode: selectedAddress?.pincode || '400001',
          order_items: cartItems.map(item => ({
            name: item.name,
            sku: item.id || `SKU${Date.now()}`,
            units: item.quantity,
            selling_price: item.price
          })),
          payment_method: 'Prepaid'
        };

        console.log('Creating Shiprocket shipment:', shipmentData);
        
        const shipmentResponse = await fetch('http://localhost:5000/create-shipment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(shipmentData)
        });

        if (shipmentResponse.ok) {
          const shipmentResult = await shipmentResponse.json();
          console.log('Shiprocket shipment created:', shipmentResult);
          orderData.shipmentId = shipmentResult.shipment?.order_id;
          orderData.shipmentStatus = 'created';
        } else {
          console.error('Shiprocket shipment failed:', await shipmentResponse.text());
        }
      } catch (error) {
        console.error('Error creating Shiprocket shipment:', error);
      }

      onPaymentSuccess(response, orderData);
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
        // Enable specific payment method
        method: {
          netbanking: paymentMethod === 'netbanking',
          wallet: paymentMethod === 'wallet',
          upi: paymentMethod === 'upi',
          card: paymentMethod === 'card',
          emi: paymentMethod === 'emi'
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment Error:', error);
      onPaymentFailure('Payment failed: ' + error.message);
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
    if (!selectedAddressId) {
      alert('Please select or add a delivery address.');
      return;
    }
    // Persist name/email/phone for future checkouts
    localStorage.setItem('customerInfo', JSON.stringify({
      name: customerDetails.name,
      email: customerDetails.email,
      phone: customerDetails.phone
    }));
    
    // Move to payment methods step
    setCurrentStep(2);
  };

  const handlePaymentMethod = (method) => {
    openRazorpayCheckout(method);
  };

  return (
    <div className="payment-form-container">
      <div className="payment-form">
        {currentStep === 1 ? (
          <h2>Complete Your Purchase</h2>
        ) : (
          <>
            <button className="back-icon-btn back-above" onClick={() => setCurrentStep(1)} aria-label="Back">
              <span className="back-icon">←</span>
            </button>
            <div className="pm-titles center">
              <h2>Choose Payment Method</h2>
              <p className="pm-subtitle">Select your preferred payment method:</p>
            </div>
          </>
        )}
        
        {/* Step 1: Address + Customer + Order Summary */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit} className="customer-form">
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

              <div className="address-group">
                <label>Delivery Address</label>
                <div className="address-list">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`address-item ${selectedAddressId === addr.id ? 'selected' : ''}`}>
                      <label className="address-radio">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                      </label>
                      <div className="address-content">
                        <div className="address-header-row">
                          <span className="address-person">{addr.name}</span>
                          <span className="address-tag">{addr.tag || 'HOME'}</span>
                          <span className="address-phone">{addr.phone}</span>
                        </div>
                        <div className="address-lines">
                          <span>{addr.line1}</span>
                          {addr.line2 && <span>{addr.line2}</span>}
                          <span>
                            {addr.city}{addr.state ? `, ${addr.state}` : ''} - {addr.pincode}
                          </span>
                        </div>
                        <div className="address-actions">
                          <span className="address-manage-note">Manage addresses in Dashboard</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <div className="address-empty">
                      <p>No address found. Please add an address in your Dashboard.</p>
                      <button 
                        type="button" 
                        className="go-to-dashboard-btn"
                        onClick={() => navigate('/dashboard')}
                      >
                        Go to Dashboard to Add Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="order-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="total-amount">
                <strong>Total: ₹{totalAmount}</strong>
              </div>
            </div>

            <button type="submit" className="next-btn">
              Choose Payment Method
            </button>
          </form>
        )}

        {/* Step 2: Payment Methods */}
        {currentStep === 2 && (
          <div className="payment-methods">
            <div className="payment-list" role="radiogroup" aria-label="Payment Method">
              <label className="payment-row" onClick={() => handlePaymentMethod('card')}>
                <input type="radio" name="payment" className="payment-radio" />
                <img className="payment-icon-img" src={cardIcon} alt="Card" />
                <span className="payment-row-text">Credit/Debit Card</span>
              </label>

              <label className="payment-row" onClick={() => handlePaymentMethod('upi')}>
                <input type="radio" name="payment" className="payment-radio" />
                <img className="payment-icon-img" src={upiIcon} alt="UPI" />
                <span className="payment-row-text">UPI</span>
              </label>

              <label className="payment-row" onClick={() => handlePaymentMethod('wallet')}>
                <input type="radio" name="payment" className="payment-radio" />
                <span className="payment-row-text">GPay / PhonePe / Paytm</span>
              </label>

              <label className="payment-row" onClick={() => handlePaymentMethod('netbanking')}>
                <input type="radio" name="payment" className="payment-radio" />
                <span className="payment-row-text">Net Banking</span>
              </label>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default PaymentForm;
