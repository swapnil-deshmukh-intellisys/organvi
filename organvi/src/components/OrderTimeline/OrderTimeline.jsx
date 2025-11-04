import React from 'react';
import { motion } from 'framer-motion';
import { Check, Package, Truck, Gift } from 'lucide-react';

const OrderTimeline = ({ orderDate, status }) => {
  // Calculate dates for each step
  const orderDateObj = new Date(orderDate);
  const shippedDate = new Date(orderDateObj);
  shippedDate.setDate(shippedDate.getDate() + 1);
  
  const outForDeliveryDate = new Date(orderDateObj);
  outForDeliveryDate.setDate(outForDeliveryDate.getDate() + 5);
  
  const deliveredDate = new Date(orderDateObj);
  deliveredDate.setDate(deliveredDate.getDate() + 7);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStepStatus = (step) => {
    switch (status) {
      case 'Order Placed':
        return step === 'ordered' ? 'completed' : 'pending';
      case 'Shipped':
        return ['ordered', 'shipped'].includes(step) ? 'completed' : 'pending';
      case 'Out for Delivery':
        return ['ordered', 'shipped', 'outForDelivery'].includes(step) ? 'completed' : 'pending';
      case 'Delivered':
        return 'completed';
      default:
        return step === 'ordered' ? 'completed' : 'pending';
    }
  };

  const steps = [
    {
      id: 'ordered',
      icon: Check,
      label: 'Order Placed',
      date: formatDate(orderDateObj),
      description: 'Your order has been placed'
    },
    {
      id: 'shipped',
      icon: Package,
      label: 'Shipped',
      date: formatDate(shippedDate),
      description: 'Your order is on its way'
    },
    {
      id: 'outForDelivery',
      icon: Truck,
      label: 'Out for Delivery',
      date: formatDate(outForDeliveryDate),
      description: 'Your order is out for delivery'
    },
    {
      id: 'delivered',
      icon: Gift,
      label: 'Delivered',
      date: formatDate(deliveredDate),
      description: 'Your order has been delivered'
    }
  ];

  return (
    <div className="order-timeline-container">
      <div className="relative">
        {/* Timeline line */}
        <div className="order-timeline-line">
          <motion.div
            className="order-timeline-progress"
            initial={{ width: "0%" }}
            animate={{ 
              width: status === 'Order Placed' ? "25%" : 
                     status === 'Shipped' ? "50%" : 
                     status === 'Out for Delivery' ? "75%" : "100%"
            }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {/* Timeline steps */}
        <div className="order-timeline-steps">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id);
            const Icon = step.icon;
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="order-timeline-step"
              >
                {/* Icon */}
                <motion.div
                  className={`order-timeline-step-icon ${
                    stepStatus === 'completed' 
                      ? 'order-timeline-step-icon-completed' 
                      : 'order-timeline-step-icon-pending'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon size={20} />
                </motion.div>

                {/* Label */}
                <div className="order-timeline-step-label">
                  {step.label}
                </div>

                {/* Date */}
                <div className="order-timeline-step-date">
                  {step.date}
                </div>

                {/* Description */}
                <div className="order-timeline-step-description">
                  {step.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="order-timeline-status"
      >
        <div className="order-timeline-status-badge">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="order-timeline-status-dot"
          />
          {status === 'Order Placed' && 'Processing your order...'}
          {status === 'Shipped' && 'Your order is on the way!'}
          {status === 'Out for Delivery' && 'Out for delivery today!'}
          {status === 'Delivered' && 'Order delivered successfully!'}
        </div>
      </motion.div>
    </div>
  );
};

export default OrderTimeline;
