import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, X } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  };

  const handleCloseModal = () => {
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div 
      className="order-success-modal-overlay"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
        className="order-success-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleCloseModal}
          className="order-success-close-btn"
        >
          <X size={20} />
        </motion.button>
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="order-success-checkmark"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.4 
            }}
            className="relative"
          >
            <CheckCircle 
              size={80} 
              className="text-green-500"
            />
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6,
                ease: "easeInOut"
              }}
              className="absolute inset-0"
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                className="text-green-500"
              >
                <motion.path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.8,
                    ease: "easeInOut"
                  }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <h1 className="order-success-title">
            Order Placed Successfully 🎉
          </h1>
          <p className="order-success-message">
            Thank you for your purchase! Your order has been confirmed and will be processed shortly.
          </p>
        </motion.div>

        {/* Continue Shopping Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinueShopping}
          className="order-success-button"
        >
          <ShoppingBag size={20} />
          Continue Shopping
        </motion.button>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="order-success-info"
        >
          <p>You can track your order in the "My Orders" section.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
