/**
 * Utility functions to sync user data (cart, wishlist) with backend
 */
import API_ENDPOINTS from '../config/api';

export const syncCartToBackend = async (cartItems, mobile) => {
  if (!mobile) {
    console.warn('No mobile number provided, skipping cart sync');
    return;
  }

  try {
    const digits = String(mobile).replace(/\D/g, '');
    const response = await fetch(API_ENDPOINTS.USERS.CART, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: digits,
        cart: cartItems || []
      })
    });

    if (response.ok) {
      console.log('Cart synced to backend successfully');
    } else {
      console.error('Failed to sync cart to backend');
    }
  } catch (error) {
    console.error('Error syncing cart to backend:', error);
  }
};

export const syncWishlistToBackend = async (wishlistItems, mobile) => {
  if (!mobile) {
    console.warn('No mobile number provided, skipping wishlist sync');
    return;
  }

  try {
    const digits = String(mobile).replace(/\D/g, '');
    const response = await fetch(API_ENDPOINTS.USERS.WISHLIST, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: digits,
        wishlist: wishlistItems || []
      })
    });

    if (response.ok) {
      console.log('Wishlist synced to backend successfully');
    } else {
      console.error('Failed to sync wishlist to backend');
    }
  } catch (error) {
    console.error('Error syncing wishlist to backend:', error);
  }
};

