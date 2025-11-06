// API Configuration
// This file centralizes all API endpoint URLs
// In production, VITE_API_URL should be set in Vercel environment variables

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Base URL
  BASE: API_BASE_URL,
  
  // User endpoints
  USERS: {
    LOGIN: `${API_BASE_URL}/api/users/login`,
    LOGIN_MOBILE: `${API_BASE_URL}/api/users/login-mobile`,
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    EMAIL: (email) => `${API_BASE_URL}/api/users/email/${encodeURIComponent(email)}`,
    MOBILE: (mobile) => `${API_BASE_URL}/api/users/mobile/${mobile}`,
    CART: `${API_BASE_URL}/api/users/cart`,
    WISHLIST: `${API_BASE_URL}/api/users/wishlist`,
    ADDRESSES: `${API_BASE_URL}/api/users/addresses`,
    ADDRESS: (addressId, mobile) => `${API_BASE_URL}/api/users/addresses/${addressId}?mobile=${mobile}`,
  },
  
  // Product endpoints
  PRODUCTS: {
    BASE: `${API_BASE_URL}/api/products`,
    BY_CATEGORY: (category) => `${API_BASE_URL}/api/products?category=${category}`,
  },
  
  // Order endpoints
  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
    BY_USER: (mobile) => `${API_BASE_URL}/orders?userMobile=${mobile}`,
    CANCEL: (orderId) => `${API_BASE_URL}/cancel-order/${orderId}`,
  },
  
  // Payment endpoints
  PAYMENT: {
    CREATE_ORDER: `${API_BASE_URL}/create-order`,
    VERIFY_PAYMENT: `${API_BASE_URL}/verify-payment`,
  },
  
  // Shiprocket endpoints
  SHIPROCKET: {
    TOKEN: `${API_BASE_URL}/shiprocket-token`,
    CREATE_SHIPMENT: `${API_BASE_URL}/create-shipment`,
    TRACK_SHIPMENT: (shipmentId) => `${API_BASE_URL}/track-shipment/${shipmentId}`,
    SHIPMENT_DETAILS: (orderId) => `${API_BASE_URL}/shipment-details/${orderId}`,
  },
  
  // Subscriber endpoints
  SUBSCRIBERS: {
    BASE: `${API_BASE_URL}/api/subscribers`,
    SUBSCRIBE: `${API_BASE_URL}/api/subscribers/subscribe`,
  },
  
  // Review endpoints
  REVIEWS: {
    BASE: `${API_BASE_URL}/api/reviews`,
    SUBMIT: `${API_BASE_URL}/api/reviews/submit`,
    BY_PRODUCT: (productId) => `${API_BASE_URL}/api/reviews/product/${productId}`,
    ALL: `${API_BASE_URL}/api/reviews/all`,
    APPROVE: (reviewId) => `${API_BASE_URL}/api/reviews/${reviewId}/approve`,
    REJECT: (reviewId) => `${API_BASE_URL}/api/reviews/${reviewId}/reject`,
    DELETE: (reviewId) => `${API_BASE_URL}/api/reviews/${reviewId}`,
  },
};

export default API_ENDPOINTS;

