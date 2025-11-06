import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import API_ENDPOINTS from '../../config/api';
import './LoginModal.css'; // ✅ Correct (relative to same folder)


const LoginModal = ({ onClose }) => {
  const [identifier, setIdentifier] = useState(''); // Can be email or mobile
  const [password, setPassword] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { loginUser } = useUser();

  // Check if user has password set (for returning users)
  const checkUserPassword = async () => {
    const isEmail = identifier.includes('@');
    if (isEmail) {
      // Check with email
      const emailLower = identifier.trim().toLowerCase();
      try {
        const response = await fetch(API_ENDPOINTS.USERS.EMAIL(emailLower));
        if (response.ok) {
          const data = await response.json();
          if (data.user?.password) {
            setRequiresPassword(true);
            return true;
          } else {
            setError('User found but password not set. Please use mobile number to login first.');
            return false;
          }
        }
      } catch (err) {
        // User not found, might be new user
        return false;
      }
    } else {
      // Check with mobile
      const digits = identifier.replace(/\D/g, '');
      if (digits.length >= 10) {
        try {
          const response = await fetch(API_ENDPOINTS.USERS.MOBILE(digits));
          if (response.ok) {
            const data = await response.json();
            if (data.user?.password) {
              setRequiresPassword(true);
              return true;
            }
          }
        } catch (err) {
          // User not found, new user
          return false;
        }
      }
    }
    return false;
  };

  const handleLogin = async () => {
    if (!identifier.trim()) {
      setError('Please enter mobile number or email');
      setSuccess(false);
      return;
    }

    // Check if this is a returning user with password
    const isEmail = identifier.includes('@');
    const digits = identifier.replace(/\D/g, '');
    
    // If no password entered, check if user has password set
    if (!password) {
      const hasPassword = await checkUserPassword();
      if (hasPassword) {
        setError('Please enter your password');
        setSubmitting(false);
        return;
      }
    }

    // If password is required but not provided
    if (requiresPassword && !password) {
      setError('Password is required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess(false);
      
      let response;
      
      if (password || requiresPassword) {
        // Login with email/mobile + password
        response = await fetch(API_ENDPOINTS.USERS.LOGIN, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            identifier: identifier.trim(),
            password: password
          })
        });
      } else {
        // First-time login with mobile only
        if (digits.length < 10 || digits.length > 15) {
          setError('Enter a valid mobile number (10-15 digits)');
          setSuccess(false);
          return;
        }
        
        response = await fetch(API_ENDPOINTS.USERS.LOGIN_MOBILE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            mobile: digits,
            countryCode: '+91'
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      // Extract mobile and countryCode from user object or use defaults
      const userMobile = data.user?.mobile || (isEmail ? '' : digits);
      const userCountryCode = data.user?.countryCode || '+91';
      
      // Clear any stale user data from localStorage before login
      localStorage.removeItem('wishlist');
      localStorage.removeItem('cart');
      localStorage.removeItem('addresses');
      
      // Check if user has existing profile
      const hasProfile = data.user?.firstName || data.user?.email;
      
      // Save full user object to context and localStorage
      loginUser(data.user, userMobile, userCountryCode);
      
      // Immediately sync user data from backend to ensure fresh data
      if (data.user?.cart) {
        localStorage.setItem('cart', JSON.stringify(data.user.cart));
      } else {
        localStorage.setItem('cart', JSON.stringify([]));
      }
      if (data.user?.wishlist) {
        localStorage.setItem('wishlist', JSON.stringify(data.user.wishlist));
      } else {
        localStorage.setItem('wishlist', JSON.stringify([]));
      }
      if (data.user?.addresses) {
        localStorage.setItem('addresses', JSON.stringify(data.user.addresses));
      } else {
        localStorage.setItem('addresses', JSON.stringify([]));
      }
      
      // Trigger events to update UI
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: (data.user?.wishlist || []).length }));
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: (data.user?.cart || []).length }));
      
      // Show success message
      setSuccess(true);
      const successMessage = hasProfile 
        ? `Welcome back! Logged in successfully.`
        : `Login successful! Complete your profile to get started.`;
      
      alert(successMessage);
      onClose();
      // Navigate based on profile state
      if (hasProfile) {
        navigate('/dashboard');
      } else {
        navigate('/account');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    onClose();
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-box">
        <button onClick={onClose} className="login-modal-close">×</button>
        <h2 className="login-modal-title">Login</h2>
        <input
          type="text"
          className="login-modal-input"
          placeholder={requiresPassword ? "Enter mobile number or email" : "Enter mobile number"}
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            setRequiresPassword(false); // Reset when user changes input
            setError(''); // Clear error
          }}
          onBlur={checkUserPassword}
          maxLength={requiresPassword ? 100 : 15}
        />
        {requiresPassword && (
          <input
            type="password"
            className="login-modal-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: '10px' }}
          />
        )}
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            fontSize: '14px', 
            marginBottom: '10px', 
            textAlign: 'center',
            padding: '8px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            border: '1px solid #ffcdd2'
          }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ 
            color: '#2e7d32', 
            fontSize: '14px', 
            marginBottom: '10px', 
            textAlign: 'center',
            padding: '8px',
            backgroundColor: '#e8f5e9',
            borderRadius: '4px',
            border: '1px solid #c8e6c9'
          }}>
            ✅ Login successful!
          </div>
        )}
        <button 
          onClick={handleLogin} 
          className="login-modal-btn login-primary-btn"
          disabled={submitting}
        >
          {submitting ? 'Logging in...' : requiresPassword ? 'Login' : 'Login with Mobile'}
        </button>
        <button onClick={handleGuestLogin} className="login-modal-btn login-guest-btn">
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginModal;