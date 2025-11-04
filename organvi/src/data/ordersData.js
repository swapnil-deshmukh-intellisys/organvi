// Sample orders data for the e-commerce order management system
export const ordersData = [
  {
    id: "ORD123456",
    productName: "Organic Almonds",
    weight: "500g",
    price: 450,
    orderDate: "2025-01-16",
    expectedDelivery: "2025-01-23",
    paymentType: "Prepaid",
    status: "Out for Delivery",
    address: "Flat No. 7, Green Residency, Pune, Maharashtra - 411001",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop",
    quantity: 1,
    totalAmount: 450
  },
  {
    id: "ORD123457",
    productName: "Premium Cashews",
    weight: "1kg",
    price: 1200,
    orderDate: "2025-01-15",
    expectedDelivery: "2025-01-22",
    paymentType: "Cash on Delivery",
    status: "Delivered",
    address: "Flat No. 7, Green Residency, Pune, Maharashtra - 411001",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
    quantity: 2,
    totalAmount: 2400
  },
  {
    id: "ORD123458",
    productName: "Organic Quinoa",
    weight: "500g",
    price: 350,
    orderDate: "2025-01-14",
    expectedDelivery: "2025-01-21",
    paymentType: "Prepaid",
    status: "Shipped",
    address: "Flat No. 7, Green Residency, Pune, Maharashtra - 411001",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop",
    quantity: 1,
    totalAmount: 350
  },
  {
    id: "ORD123459",
    productName: "Premium Walnuts",
    weight: "250g",
    price: 280,
    orderDate: "2025-01-13",
    expectedDelivery: "2025-01-20",
    paymentType: "Prepaid",
    status: "Order Placed",
    address: "Flat No. 7, Green Residency, Pune, Maharashtra - 411001",
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop",
    quantity: 1,
    totalAmount: 280
  },
  {
    id: "ORD123460",
    productName: "Organic Honey",
    weight: "500g",
    price: 180,
    orderDate: "2025-01-12",
    expectedDelivery: "2025-01-19",
    paymentType: "Cash on Delivery",
    status: "Delivered",
    address: "Flat No. 7, Green Residency, Pune, Maharashtra - 411001",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop",
    quantity: 1,
    totalAmount: 180
  }
];

// Helper function to get order by ID
export const getOrderById = (id) => {
  return ordersData.find(order => order.id === id);
};

// Helper function to get orders by status
export const getOrdersByStatus = (status) => {
  return ordersData.filter(order => order.status === status);
};
