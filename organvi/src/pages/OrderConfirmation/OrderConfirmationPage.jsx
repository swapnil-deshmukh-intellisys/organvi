import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderConfirmation from '../../components/Order/OrderConfirmation';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { orderData, paymentResponse } = location.state || {};

  // If no order data, redirect to home
  if (!orderData) {
    navigate('/');
    return null;
  }

  return (
    <OrderConfirmation 
      orderData={orderData} 
      paymentResponse={paymentResponse} 
    />
  );
};

export default OrderConfirmationPage;
