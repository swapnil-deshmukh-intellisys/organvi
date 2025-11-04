// Test script for Shiprocket integration
const axios = require('axios');

const SHIPROCKET_EMAIL = 'harshada.intellisys@gmail.com';
const SHIPROCKET_PASSWORD = 'IcxbH$uz4fkrGD%7';

async function testShiprocketIntegration() {
  try {
    console.log('Testing Shiprocket integration...');
    
    // Step 1: Get token
    console.log('1. Getting Shiprocket token...');
    const tokenResponse = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      { email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD }
    );
    
    const token = tokenResponse.data.token;
    console.log('✅ Token received:', token.substring(0, 20) + '...');
    
    // Step 2: Test shipment creation
    console.log('2. Testing shipment creation...');
    const testShipmentData = {
      order_id: `TEST_ORDER_${Date.now()}`,
      order_date: new Date().toISOString(),
      pickup_location: "Primary",
      billing_customer_name: "Test Customer",
      billing_customer_email: "test@example.com",
      billing_customer_phone: "9999999999",
      shipping_address: "123 Test Street",
      shipping_city: "Mumbai",
      shipping_state: "Maharashtra",
      shipping_country: "India",
      shipping_pincode: "400001",
      order_items: [
        {
          name: "Test Product",
          sku: "TEST_SKU_001",
          units: 1,
          selling_price: 100
        }
      ],
      payment_method: "Prepaid"
    };
    
    const shipmentResponse = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      testShipmentData,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    console.log('✅ Shipment created successfully:', shipmentResponse.data);
    
    // Step 3: Test tracking (if shipment was created)
    if (shipmentResponse.data && shipmentResponse.data.order_id) {
      console.log('3. Testing shipment tracking...');
      try {
        const trackingResponse = await axios.get(
          `https://apiv2.shiprocket.in/v1/external/courier/track/${shipmentResponse.data.order_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Tracking data received:', trackingResponse.data);
      } catch (trackingError) {
        console.log('⚠️ Tracking not available yet (normal for new shipments):', trackingError.response?.data || trackingError.message);
      }
    }
    
    console.log('🎉 Shiprocket integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Shiprocket integration test failed:', error.response?.data || error.message);
  }
}

// Run the test
testShiprocketIntegration();
