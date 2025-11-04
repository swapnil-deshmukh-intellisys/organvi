import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';
// import OTPVerification from './OTPVerification';
import UserRegistration from './UserRegistration';
import Congratulations from './Congratulations';
import './Account.css';

const Account = () => {
  const [identifier, setIdentifier] = useState(''); // Can be email or mobile
  const [password, setPassword] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  // const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [showUserRegistration, setShowUserRegistration] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useUser();

  // If already logged in, redirect away from login page
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        navigate('/dashboard');
      }
    } catch (_) {}
  }, [navigate]);

  // Check if user has password set (for returning users)
  const checkUserPassword = async () => {
    const isEmail = identifier.includes('@');
    if (isEmail) {
      // Check with email
      const emailLower = identifier.trim().toLowerCase();
      try {
        const response = await fetch(`http://localhost:5000/api/users/email/${encodeURIComponent(emailLower)}`);
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
          const response = await fetch(`http://localhost:5000/api/users/mobile/${digits}`);
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

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!identifier.trim()) {
      setError('Please enter mobile number or email');
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
      
      let response;
      
      if (password || requiresPassword) {
        // Login with email/mobile + password
        response = await fetch('http://localhost:5000/api/users/login', {
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
           setError('Please enter a valid mobile number (10-15 digits)');
           setSubmitting(false);
           return;
         }
        
        response = await fetch('http://localhost:5000/api/users/login-mobile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            mobile: digits,
            countryCode: countryCode
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      // Clear any stale user data from localStorage before login
      localStorage.removeItem('wishlist');
      localStorage.removeItem('cart');
      localStorage.removeItem('addresses');
      
      // Save user to context
      const userMobile = data.user?.mobile || (isEmail ? '' : digits);
      loginUser(data.user, userMobile, data.user?.countryCode || countryCode);
      
      // Immediately sync user data from backend to ensure fresh data
      localStorage.setItem('cart', JSON.stringify(data.user?.cart || []));
      localStorage.setItem('wishlist', JSON.stringify(data.user?.wishlist || []));
      localStorage.setItem('addresses', JSON.stringify(data.user?.addresses || []));
      
      // Trigger events to update UI
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: (data.user?.wishlist || []).length }));
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: (data.user?.cart || []).length }));
      
      // Check if user has existing profile
      const hasProfile = data.user?.firstName || data.user?.email;
      
      // Show success message
      const successMessage = hasProfile 
        ? `Welcome back! Logged in successfully.`
        : `Login successful! Please complete your profile.`;
      alert(`✅ ${successMessage}`);

      // If profile already exists, go directly to dashboard
      if (hasProfile) {
        navigate('/dashboard');
        return;
      }

      // Otherwise, show congratulations then proceed to registration
      setShowCongratulations(true);
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      alert(`❌ Login Failed: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  // const handleVerifyOTP = (otp) => {
  //   console.log('Verifying OTP:', otp);
  //   setShowUserRegistration(true);
  // };

  const handleUserRegistrationComplete = (data) => {
    console.log('User registration completed:', data);
    setUserData(data);
    // Directly log in and go to dashboard (skip congratulations)
    loginUser(data);
    navigate('/dashboard');
  };

  // const handleResendOTP = () => {
  //   console.log('Resending OTP to:', countryCode + phoneNumber);
  // };

  // const handleEditNumber = () => {
  //   setShowOTPScreen(false);
  // };

  // const handleBack = () => {
  //   setShowOTPScreen(false);
  // };

  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);
    setRequiresPassword(false); // Reset when user changes input
    setError(''); // Clear error
  };

  const handleCloseModal = () => {
    navigate(-1); // Go back to previous page
  };

  if (showCongratulations) {
    return (
      <Congratulations
        durationMs={1500}
        onDone={() => {
          setShowCongratulations(false);
          setShowUserRegistration(true);
        }}
      />
    );
  }

  if (showUserRegistration) {
    return (
      <UserRegistration
        onComplete={handleUserRegistrationComplete}
      />
    );
  }

  // Default: show phone input screen
  return (
    <div className="account-modal-overlay" onClick={handleCloseModal}>
      <div className="account-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="account-form">
          {/* Close Button */}
          <button className="modal-close-btn" onClick={handleCloseModal}>
            ×
          </button>
          
          {/* Header */}
          <div className="account-header">
            <h1 className="account-title">Login</h1>
            <p className="account-subtitle">Enter your log in details</p>
          </div>

        {/* Login Input */}
        <form onSubmit={handleRequestOTP} className="phone-form">
          <div className="phone-input-container">
            {/* Country Code Selector - Only show for mobile (when identifier doesn't contain @) */}
            {!identifier.includes('@') && (
              <div className="country-selector">
                <div 
                  className="country-flag"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  <img 
                    src="https://flagcdn.com/w20/in.png" 
                    alt="India Flag" 
                    className="flag-image"
                  />
                  <span className="country-code">{countryCode}</span>
                  <span className="dropdown-arrow">▼</span>
                </div>
                {showCountryDropdown && (
                  <div className="country-dropdown">
                    <div 
                      className="country-option"
                      onClick={() => {
                        setCountryCode('+91');
                        setShowCountryDropdown(false);
                      }}
                    >
                      <img src="https://flagcdn.com/w20/in.png" alt="India" />
                      <span>+91</span>
                    </div>
                    <div 
                      className="country-option"
                      onClick={() => {
                        setCountryCode('+1');
                        setShowCountryDropdown(false);
                      }}
                    >
                      <img src="https://flagcdn.com/w20/us.png" alt="USA" />
                      <span>+1</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Identifier Input (Mobile or Email) */}
            <input
              type="text"
              value={identifier}
              onChange={handleIdentifierChange}
              onBlur={checkUserPassword}
              placeholder={requiresPassword ? "Enter mobile number or email" : "Enter mobile number"}
              className="phone-input"
              maxLength={identifier.includes('@') ? 100 : 15}
              required
            />
          </div>
          
          {/* Password Input - Show when required */}
          {requiresPassword && (
            <div className="phone-input-container" style={{ marginTop: '10px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="phone-input"
                required
              />
            </div>
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

          {/* Continue Button (no OTP) */}
          <button 
            type="submit" 
            className="request-otp-btn"
            disabled={submitting}
          >
            <span>{submitting ? 'Logging in...' : 'Continue'}</span>
            {!submitting && <ArrowRight size={20} />}
          </button>
        </form>

        {/* Terms and Conditions */}
        <div className="terms-section">
          <p className="terms-text">
            I accept that I have read & understood{' '}
            <Link to="/privacy" className="terms-link">Privacy Policy</Link>
            {' '}and{' '}
            <Link to="/terms" className="terms-link">T&Cs</Link>.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
