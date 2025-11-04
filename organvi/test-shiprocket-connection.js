// Test script to verify Shiprocket connection
const axios = require('axios');

async function testShiprocketConnection() {
  try {
    console.log('🔍 Testing Shiprocket connection...');
    
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const serverResponse = await axios.get('http://localhost:5000/shiprocket-token');
    console.log('✅ Server is running');
    console.log('📋 Token response:', serverResponse.data);
    
    // Test 2: Test Shiprocket API directly
    console.log('2. Testing Shiprocket API directly...');
    const SHIPROCKET_EMAIL = 'harshada.intellisys@gmail.com';
    const SHIPROCKET_PASSWORD = 'IcxbH$uz4fkrGD%7';
    
    const directResponse = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      { email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD }
    );
    
    console.log('✅ Shiprocket API is accessible');
    console.log('📋 Direct API response:', directResponse.data);
    
    console.log('🎉 All tests passed! Shiprocket integration is working.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Solution: Start the backend server with: node server.js');
    } else if (error.response) {
      console.log('💡 Shiprocket API Error:', error.response.data);
    } else {
      console.log('💡 General Error:', error.message);
    }
  }
}

// Run the test
testShiprocketConnection();
