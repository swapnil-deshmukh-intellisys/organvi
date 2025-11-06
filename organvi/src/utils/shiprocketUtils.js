// Shiprocket utility functions
import API_ENDPOINTS from '../config/api';

export const createShipmentData = (orderData, customerDetails, shippingAddress, cartItems) => {
  return {
    order_id: orderData.orderId,
    order_date: new Date().toISOString(),
    pickup_location: "Primary",
    billing_customer_name: customerDetails.name,
    billing_customer_email: customerDetails.email,
    billing_customer_phone: customerDetails.phone,
    shipping_address: shippingAddress?.line1 || 'Default Address',
    shipping_city: shippingAddress?.city || 'Mumbai',
    shipping_state: shippingAddress?.state || 'Maharashtra',
    shipping_country: 'India',
    shipping_pincode: shippingAddress?.pincode || '400001',
    order_items: cartItems.map(item => ({
      name: item.name,
      sku: item.id || `SKU${Date.now()}`,
      units: item.quantity,
      selling_price: item.price
    })),
    payment_method: 'Prepaid'
  };
};

export const createShipment = async (shipmentData) => {
  try {
    const response = await fetch(API_ENDPOINTS.SHIPROCKET.CREATE_SHIPMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData)
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const trackShipment = async (shipmentId) => {
  try {
    const response = await fetch(API_ENDPOINTS.SHIPROCKET.TRACK_SHIPMENT(shipmentId));
    
    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getShipmentDetails = async (orderId) => {
  try {
    const response = await fetch(API_ENDPOINTS.SHIPROCKET.SHIPMENT_DETAILS(orderId));
    
    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
