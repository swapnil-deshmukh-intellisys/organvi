// Order management utilities
export const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD${timestamp}${random}`;
};

export const generateTrackingId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `TRK${timestamp}${random}`;
};

export const getOrderStatus = (status) => {
  const statusMap = {
    'pending': 'Order Placed',
    'confirmed': 'Order Confirmed',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'in_transit': 'In Transit',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'returned': 'Returned'
  };
  return statusMap[status] || status;
};

export const getShippingStatus = (status) => {
  const statusMap = {
    'pending': 'Order placed, awaiting confirmation',
    'confirmed': 'Order confirmed, preparing for shipment',
    'processing': 'Order is being processed',
    'shipped': 'Order has been shipped',
    'in_transit': 'Order is in transit',
    'out_for_delivery': 'Order is out for delivery',
    'delivered': 'Order has been delivered',
    'cancelled': 'Order has been cancelled',
    'returned': 'Order has been returned'
  };
  return statusMap[status] || status;
};

export const calculateEstimatedDelivery = (orderDate) => {
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days delivery
  return deliveryDate.toLocaleDateString();
};

export const getOrderProgress = (status) => {
  const progressMap = {
    'pending': 10,
    'confirmed': 25,
    'processing': 40,
    'shipped': 60,
    'in_transit': 75,
    'out_for_delivery': 90,
    'delivered': 100,
    'cancelled': 0,
    'returned': 0
  };
  return progressMap[status] || 0;
};
