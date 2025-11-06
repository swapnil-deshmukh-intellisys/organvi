import React, { createContext, useContext, useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userData');
      const storedPhone = localStorage.getItem('userPhone');
      const storedCode = localStorage.getItem('userCountryCode');
      
      // Only hydrate if userData exists in localStorage
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData(parsed);
        // Extract mobile from userData if phoneNumber is not stored separately
        if (parsed.mobile && !storedPhone) {
          setPhoneNumber(parsed.mobile);
        }
        // Extract countryCode from userData if not stored separately
        if (parsed.countryCode && !storedCode) {
          setCountryCode(parsed.countryCode);
        }
      } else {
        // If no userData in localStorage, ensure state is cleared
        setUserData(null);
        setPhoneNumber('');
        setCountryCode('+91');
      }
      if (storedPhone) setPhoneNumber(storedPhone);
      if (storedCode) setCountryCode(storedCode);
    } catch (_) {
      // On error, clear state
      setUserData(null);
      setPhoneNumber('');
      setCountryCode('+91');
    }
  }, []);

  const loginUser = (user, phone, country) => {
    // Extract mobile and countryCode from user object if available
    const userMobile = phone || user?.mobile || '';
    const userCountryCode = country || user?.countryCode || '+91';
    
    setUserData(user);
    setPhoneNumber(userMobile);
    setCountryCode(userCountryCode);
    try {
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('userPhone', userMobile);
      localStorage.setItem('userCountryCode', userCountryCode);
    } catch (_) {}
  };

  // Function to refresh user data from backend
  const refreshUserData = async (mobile) => {
    try {
      const digits = String(mobile || phoneNumber || '').replace(/\D/g, '');
      if (!digits) return;
      
      const response = await fetch(API_ENDPOINTS.USERS.MOBILE(digits));
      if (response.ok) {
        const data = await response.json();
        loginUser(data.user, data.user?.mobile || digits, data.user?.countryCode || countryCode);
        
        // Always sync cart, wishlist, and addresses from backend to localStorage
        // This ensures we overwrite any stale data from previous user session
        localStorage.setItem('cart', JSON.stringify(data.user?.cart || []));
        localStorage.setItem('wishlist', JSON.stringify(data.user?.wishlist || []));
        localStorage.setItem('addresses', JSON.stringify(data.user?.addresses || []));
        
        // Only trigger events if data actually changed to prevent loops
        // Don't trigger events here - let components handle their own updates
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  const logoutUser = () => {
    // Clear state first
    setUserData(null);
    setPhoneNumber('');
    setCountryCode('+91');
    
    try {
      // Clear all user-related data from localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userCountryCode');
      localStorage.removeItem('wishlist');
      localStorage.removeItem('cart');
      localStorage.removeItem('addresses');
      localStorage.removeItem('orders');
      
      // Dispatch a logout event to notify all components
      window.dispatchEvent(new CustomEvent('userLogout'));
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: 0 }));
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: 0 }));
    } catch (_) {}
  };

  return (
    <UserContext.Provider value={{
      userData,
      phoneNumber,
      countryCode,
      loginUser,
      logoutUser,
      refreshUserData
    }}>
      {children}
    </UserContext.Provider>
  );
};
