import React, { useState, useEffect } from 'react';
import { ArrowRight, User, Mail } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import API_ENDPOINTS from '../../config/api';
import './UserRegistration.css';

const UserRegistration = ({ onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { userData, phoneNumber, countryCode, loginUser } = useUser();

  // Pre-fill form if user data exists
  useEffect(() => {
    if (userData) {
      if (userData.firstName && !firstName) setFirstName(userData.firstName);
      if (userData.lastName && !lastName) setLastName(userData.lastName);
      if (userData.email && !email) setEmail(userData.email);
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Get mobile from userData or phoneNumber context
    let mobile = userData?.mobile || phoneNumber;
    
    // If still no mobile, try to get from localStorage as fallback
    if (!mobile) {
      try {
        const storedUser = localStorage.getItem('userData');
        const storedPhone = localStorage.getItem('userPhone');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          mobile = parsed.mobile || storedPhone;
        } else if (storedPhone) {
          mobile = storedPhone;
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      }
    }
    
    if (!mobile) {
      setError('Mobile number not found. Please login again.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const digits = String(mobile).replace(/\D/g, '');
      
      // Update user profile in backend
      const response = await fetch(API_ENDPOINTS.USERS.PROFILE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: digits,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          countryCode: countryCode || '+91'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save profile');
      }

      const data = await response.json();
      
      // Update local context with fresh data from backend
      const updatedMobile = data.user?.mobile || digits;
      const updatedCountryCode = data.user?.countryCode || countryCode || '+91';
      loginUser(data.user, updatedMobile, updatedCountryCode);
      
      // Call onComplete callback
      if (onComplete) {
        onComplete(data.user);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="account-modal-overlay">
      <div className="account-modal-container">
        <div className="user-registration-form">
          {/* Close Button */}
          <button className="modal-close-btn" onClick={() => window.history.back()}>
            ×
          </button>
        {/* Header */}
        <div className="registration-header">
          <h1 className="registration-title">Complete Your Profile</h1>
          <p className="registration-subtitle">Please provide your details to continue</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="registration-form">
          {/* First Name */}
          <div className="input-group">
            <label className="input-label">First Name</label>
            <div className="input-container">
              <User size={20} className="input-icon" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="registration-input"
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="input-group">
            <label className="input-label">Last Name</label>
            <div className="input-container">
              <User size={20} className="input-icon" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="registration-input"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label className="input-label">Email ID</label>
            <div className="input-container">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="registration-input"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-container">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="registration-input"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <div className="input-container">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="registration-input"
                required
              />
            </div>
          </div>

          {error && (
            <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="complete-profile-btn"
            disabled={submitting}
          >
            <span>{submitting ? 'Saving...' : 'Complete Profile'}</span>
            {!submitting && <ArrowRight size={20} />}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
