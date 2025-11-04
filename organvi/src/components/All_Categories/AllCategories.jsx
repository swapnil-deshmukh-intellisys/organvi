import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { syncWishlistToBackend } from '../../utils/syncUserData';
// import Filter from '../Filter/Filter';
import './AllCategories.css';
import ViewMoreDetails from '../Pulses/ViewMoreDetails';
import downIcon from '../../assets/down.png';
import closeGif from '../../assets/close.gif';
import binIcon from '../../assets/bin.png';
import editIcon from '../../assets/editing.png';
import mastercardIcon from '../../assets/mastercard.png';
import rupayIcon from '../../assets/rupay.png';
import upiIcon from '../../assets/upi (1).png';
import visaIcon from '../../assets/visa.png';

// Import product images
// Almonds
import almondImg from '../../assets/almond.png';

// Cashews
import cashewnutImg from '../../assets/cashewnut.png';

// Chana Dal
import chanadalImg from '../../assets/chanadal.png';

// Chilly (3 types)
import chillyImg from '../../assets/chilly.jpg';
import chilly1Img from '../../assets/chilly1.jpg';
import chilly2Img from '../../assets/chilly2.png';

// Jaggery (6 types)
import jaggaryImg from '../../assets/jaggary2.jpg';
import jaggary3Img from '../../assets/jaggary3.png';
import jaggary4Img from '../../assets/jaggary4.jpg';
import jaggary5Img from '../../assets/jaggary5.jpg';
import jaggary6Img from '../../assets/jaggary6.png';
import jeggaryImg from '../../assets/jeggary.png';

// Masoor Dal
import masoorDalImg from '../../assets/Masoor Dal.png';

// Turmeric (5 types)
import termericImg from '../../assets/termeric.png';
import termeric2Img from '../../assets/termeric2.jpg';
import termeric3Img from '../../assets/termeric3.jpg';
import termeric4Img from '../../assets/termeric4.jpg';
import termeric5Img from '../../assets/termeric5.png';

// Mix Sprouts
import mixSproutsImg from '../../assets/Mix Sprouts.png';

// Moong Dal
import moongdalImg from '../../assets/moongdal.png';

// Pistachios
import pistaImg from '../../assets/pista1.png';

// Raisins
import raisinImg from '../../assets/rainse1.png';

// Toor Dal
import toordalImg from '../../assets/toordal.png';

// Urad Dal
import uraldalImg from '../../assets/uraldal.png';

// Roasted Chana
import roastchanaImg from '../../assets/roastchana1.png';

// Grid-style icons for all categories
const AllCategoriesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const PulsesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const DryFruitsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const SweetenersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const SpicesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const AllCategories = () => {
  const navigate = useNavigate();
  const { userData, phoneNumber } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProducts, setShowProducts] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantityDisplay, setQuantityDisplay] = useState({});
  const [selectedWeights, setSelectedWeights] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [likedProducts, setLikedProducts] = useState([]);
  const [showViewMore, setShowViewMore] = useState(false);
  const [selectedViewMoreProduct, setSelectedViewMoreProduct] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [modalQuantity, setModalQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCartItem, setEditingCartItem] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    sortBy: 'name',
    availability: 'all',
    organicOnly: false,
    selectedCategory: 'all',
    selectedItems: [],
    selectedPackageTypes: []
  });
  const [searchHighlight, setSearchHighlight] = useState(null);

  const categories = [
    {
      id: 'all',
      name: 'All Categories',
      icon: AllCategoriesIcon,
      products: [
        // Almonds
        { 
          id: 1,
          name: 'Organic Almonds', 
          price: 450, 
          originalPrice: 500,
          discount: 10,
          weight: '250g',
          image: almondImg,
          inStock: true, 
          organic: true 
        },
        
        // Cashews
        { 
          id: 2,
          name: 'Organic Cashews', 
          price: 500, 
          originalPrice: 550,
          discount: 9,
          weight: '250g',
          image: cashewnutImg,
          inStock: true, 
          organic: true 
        },
        
        // Chana Dal
        { 
          id: 3,
          name: 'Organic Chana Dal', 
          price: 75, 
          originalPrice: 85,
          discount: 5,
          weight: '500g',
          image: chanadalImg,
          inStock: true, 
          organic: true 
        },
        
        // Chilly (3 types)
        { 
          id: 4,
          name: 'Organic Red Chilly Powder', 
          price: 75, 
          originalPrice: 80,
          discount: 6,
          weight: '100g',
          image: chillyImg,
          inStock: true, 
          organic: true 
        },
        { 
          id: 5,
          name: 'Organic Green Chilly Powder', 
          price: 80, 
          originalPrice: 85,
          discount: 6,
          weight: '100g',
          image: chilly1Img,
          inStock: true, 
          organic: true 
        },
        { 
          id: 6,
          name: 'Organic Kashmiri Chilly Powder', 
          price: 85, 
          originalPrice: 90,
          discount: 6,
          weight: '100g',
          image: chilly2Img,
          inStock: true, 
          organic: true 
        },
        
        // Jaggery (6 types)
        { 
          id: 7,
          name: 'Organic Jaggery (Type 1)', 
          price: 70, 
          originalPrice: 80,
          discount: 6,
          weight: '1kg',
          image: jaggaryImg,
          inStock: true, 
          organic: true 
        },
        { 
          id: 8,
          name: 'Organic Jaggery (Type 2)', 
          price: 70, 
          originalPrice: 80,
          discount: 6,
          weight: '1kg',
          image: jaggary3Img,
          inStock: true, 
          organic: true 
        },
        { 
          id: 9,
          name: 'Organic Jaggery (Type 3)', 
          price: 70, 
          originalPrice: 80,
          discount: 5,
          weight: '1kg',
          image: jaggary4Img,
          inStock: true, 
          organic: true 
        },
        { 
          id: 10,
          name: 'Organic Jaggery (Type 4)', 
          price: 70, 
          originalPrice: 80,
          discount: 5,
          weight: '1kg',
          image: jaggary5Img,
          inStock: true, 
          organic: true 
        },
        { 
          id: 11,
          name: 'Organic Jaggery (Type 5)', 
          price: 70, 
          originalPrice: 80,
          discount: 5,
          weight: '1kg',
          image: jaggary6Img,
          inStock: true, 
          organic: true 
        },
        { 
          id: 12,
          name: 'Organic Jaggery (Type 6)', 
          price: 70, 
          originalPrice: 80,
          discount: 5,
          weight: '1kg',
          image: jeggaryImg,
          inStock: true, 
          organic: true 
        },
        
        // Masoor Dal
        { 
          id: 13,
          name: 'Organic Masoor Dal', 
          price: 85, 
          originalPrice: 90,
          discount: 6,
          weight: '500g',
          image: masoorDalImg,
          inStock: true, 
          organic: true 
        },
        
        // Turmeric (5 types)
        { 
          id: 14,
          name: 'Organic Turmeric (Type 1)', 
          price: 95, 
          originalPrice: 110,
          discount: 8,
          weight: '250g',
          image: termericImg,
          inStock: true, 
          organic: true 
        },
        { 
          id: 15,
          name: 'Organic Turmeric (Type 2)', 
          price: 95, 
          originalPrice: 110,
          discount: 7,
          weight: '250g',
          image: termeric2Img,
          inStock: true, 
          organic: true 
        },
        { 
          id: 16,
          name: 'Organic Turmeric (Type 3)', 
          price: 95, 
          originalPrice: 110,
          discount: 7,
          weight: '250g',
          image: termeric3Img,
          inStock: true, 
          organic: true 
        },
        { 
          id: 17,
          name: 'Organic Turmeric (Type 4)', 
          price: 95, 
          originalPrice: 110,
          discount: 7,
          weight: '250g',
          image: termeric4Img,
          inStock: true, 
          organic: true 
        },
        { 
          id: 18,
          name: 'Organic Turmeric (Type 5)', 
          price: 95, 
          originalPrice: 110,
          discount: 7,
          weight: '250g',
          image: termeric5Img,
          inStock: true, 
          organic: true 
        },
        
        // Mix Sprouts
        { 
          id: 19,
          name: 'Organic Mix Sprouts', 
          price: 95, 
          originalPrice: 100,
          discount: 5,
          weight: '250g',
          image: mixSproutsImg,
          inStock: true, 
          organic: true 
        },
        
        // Moong Dal
        { 
          id: 20,
          name: 'Organic Moong Dal', 
          price: 75, 
          originalPrice: 85,
          discount: 5,
          weight: '500g',
          image: moongdalImg,
          inStock: true, 
          organic: true 
        },
        
        // Pistachios
        { 
          id: 21,
          name: 'Organic Pistachios', 
          price: 600, 
          originalPrice: 650,
          discount: 8,
          weight: '250g',
          image: pistaImg,
          inStock: true, 
          organic: true 
        },
        
        // Raisins
        { 
          id: 22,
          name: 'Organic Raisins', 
          price: 200, 
          originalPrice: 220,
          discount: 9,
          weight: '500g',
          image: raisinImg,
          inStock: true, 
          organic: true 
        },
        
        // Toor Dal
        { 
          id: 23,
          name: 'Organic Toor Dal', 
          price: 99, 
          originalPrice: 109,
          discount: 5,
          weight: '500g',
          image: toordalImg,
          inStock: true, 
          organic: true 
        },
        
        // Urad Dal
        { 
          id: 24,
          name: 'Organic Urad Dal', 
          price: 75, 
          originalPrice: 85,
          discount: 4,
          weight: '500g',
          image: uraldalImg,
          inStock: true, 
          organic: true 
        },
        
        // Roasted Chana
        { 
          id: 25,
          name: 'Organic Roasted Chana', 
          price: 85, 
          originalPrice: 90,
          discount: 6,
          weight: '250g',
          image: roastchanaImg,
          inStock: true, 
          organic: true 
        }
      ]
    },
    {
      id: 'pulses',
      name: 'Pulses & Grains',
      icon: PulsesIcon,
      products: [
        { name: 'Organic Chana Dal', price: 95, inStock: true, organic: true },
        { name: 'Organic Moong Dal', price: 90, inStock: false, organic: true },
        { name: 'Organic Toor Dal', price: 100, inStock: true, organic: true },
        { name: 'Organic Urad Dal', price: 110, inStock: true, organic: true },
        { name: 'Organic Basmati Rice', price: 180, inStock: true, organic: true },
        { name: 'Organic Brown Rice', price: 160, inStock: true, organic: true },
        { name: 'Organic Quinoa', price: 300, inStock: false, organic: true },
        { name: 'Organic Barley', price: 120, inStock: true, organic: true },
        { name: 'Organic Wheat', price: 140, inStock: true, organic: true },
        { name: 'Organic Oats', price: 130, inStock: true, organic: true },
        { name: 'Organic Ragi', price: 110, inStock: false, organic: true },
        { name: 'Organic Bajra', price: 100, inStock: true, organic: true }
      ]
    },
    {
      id: 'dryfruits',
      name: 'Dry Fruits & Nuts',
      icon: DryFruitsIcon,
      products: [
        { name: 'Organic Almonds', price: 450, inStock: true, organic: true },
        { name: 'Organic Cashews', price: 500, inStock: true, organic: true },
        { name: 'Organic Pistachios', price: 600, inStock: false, organic: true },
        { name: 'Organic Raisins', price: 200, inStock: true, organic: true },
        { name: 'Organic Walnuts', price: 550, inStock: true, organic: true },
        { name: 'Organic Dates', price: 250, inStock: true, organic: true },
        { name: 'Organic Figs', price: 400, inStock: false, organic: true },
        { name: 'Organic Apricots', price: 350, inStock: true, organic: true },
        { name: 'Organic Prunes', price: 300, inStock: true, organic: true },
        { name: 'Organic Cranberries', price: 280, inStock: false, organic: true },
        { name: 'Organic Macadamia Nuts', price: 800, inStock: true, organic: true },
        { name: 'Organic Brazil Nuts', price: 700, inStock: true, organic: true }
      ]
    },
    {
      id: 'sweeteners',
      name: 'Sweeteners',
      icon: SweetenersIcon,
      products: [
        { name: 'Organic Jaggery', price: 80, inStock: true, organic: true },
        { name: 'Organic Honey', price: 200, inStock: true, organic: true },
        { name: 'Organic Maple Syrup', price: 300, inStock: true, organic: true },
        { name: 'Organic Coconut Sugar', price: 150, inStock: false, organic: true },
        { name: 'Organic Stevia', price: 180, inStock: true, organic: true },
        { name: 'Organic Date Syrup', price: 220, inStock: true, organic: true },
        { name: 'Organic Agave Nectar', price: 250, inStock: false, organic: true },
        { name: 'Organic Palm Sugar', price: 120, inStock: true, organic: true }
      ]
    },
    {
      id: 'spices',
      name: 'Spices & Powders',
      icon: SpicesIcon,
      products: [
        { name: 'Organic Turmeric', price: 120, inStock: true, organic: true },
        { name: 'Organic Chilly Powder', price: 75, inStock: true, organic: true },
        { name: 'Organic Coriander Powder', price: 70, inStock: true, organic: true },
        { name: 'Organic Cumin Powder', price: 80, inStock: true, organic: true },
        { name: 'Organic Garam Masala', price: 90, inStock: true, organic: true },
        { name: 'Organic Red Chili Flakes', price: 85, inStock: false, organic: true },
        { name: 'Organic Black Pepper', price: 200, inStock: true, organic: true },
        { name: 'Organic Cardamom', price: 400, inStock: true, organic: true },
        { name: 'Organic Cinnamon', price: 150, inStock: false, organic: true },
        { name: 'Organic Cloves', price: 180, inStock: true, organic: true },
        { name: 'Organic Bay Leaves', price: 60, inStock: true, organic: true },
        { name: 'Organic Fenugreek', price: 90, inStock: true, organic: true }
      ]
    }
  ];

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 'pulses') {
      navigate('/pulses');
      return;
    }
    setSelectedCategory(categoryId);
    setShowProducts(true);
    setFilters(prev => ({ ...prev, selectedCategory: categoryId }));
  };

  // Set initial state to show all categories products
  useEffect(() => {
    setShowProducts(true);
    setSelectedCategory('all');
    // Ensure default sort is applied
    setFilters(prev => ({ ...prev, sortBy: 'name' }));
    // Load liked products from localStorage
    const savedLikes = JSON.parse(localStorage.getItem('wishlist')) || [];
    setLikedProducts(savedLikes);
    
    // Load cart items from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
    
    // Check for search highlight from navbar
    const searchHighlight = localStorage.getItem('searchHighlight');
    if (searchHighlight) {
      try {
        const highlightData = JSON.parse(searchHighlight);
        console.log('Search highlight received:', highlightData);
        setSearchHighlight(highlightData.searchQuery);
        
        // Clear the highlight data
        localStorage.removeItem('searchHighlight');
        
        // Highlight matching products after a delay
        setTimeout(() => {
          const productElements = document.querySelectorAll('.product-card');
          productElements.forEach(element => {
            const productName = element.querySelector('.product-name')?.textContent?.toLowerCase() || '';
            const searchQuery = highlightData.searchQuery.toLowerCase();
            
            if (productName.includes(searchQuery)) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.8)';
              element.style.border = '2px solid #4caf50';
              element.style.transform = 'scale(1.02)';
              
              setTimeout(() => {
                element.style.boxShadow = '';
                element.style.border = '';
                element.style.transform = '';
              }, 3000);
            }
          });
        }, 1000);
      } catch (error) {
        console.error('Error parsing search highlight:', error);
      }
    }
  }, []);

  // Listen for wishlist updates from other components
  useEffect(() => {
    const handleWishlistUpdated = () => {
      const savedLikes = JSON.parse(localStorage.getItem('wishlist')) || [];
      setLikedProducts(savedLikes);
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdated);
    window.addEventListener('storage', handleWishlistUpdated);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
      window.removeEventListener('storage', handleWishlistUpdated);
    };
  }, []);

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Name, A-Z' },
    { value: 'name-desc', label: 'Name, Z-A' },
    { value: 'price', label: 'Price, low to high' },
    { value: 'price-desc', label: 'Price, high to low' }
  ];

  const handleSortChange = (sortValue) => {
    setFilters(prev => ({ ...prev, sortBy: sortValue }));
    setShowSortDropdown(false);
  };

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === filters.sortBy);
    return option ? option.label : 'Name, A-Z';
  };


  const toggleLike = async (product) => {
    const isLiked = likedProducts.some(liked => liked.id === product.id);
    
    let updatedLikes;
    if (isLiked) {
      // Remove from likes
      updatedLikes = likedProducts.filter(liked => liked.id !== product.id);
    } else {
      // Add to likes with default rating - ensure proper format for backend
      const wishlistItem = {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        weight: product.weight,
        rating: 4
      };
      updatedLikes = [...likedProducts, wishlistItem];
    }
    
    setLikedProducts(updatedLikes);
    localStorage.setItem('wishlist', JSON.stringify(updatedLikes));
    
    // Sync to backend
    const mobile = userData?.mobile || phoneNumber;
    if (mobile) {
      await syncWishlistToBackend(updatedLikes, mobile);
    }
    
    // Trigger wishlist count update in navbar
    const finalCount = updatedLikes.length;
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: finalCount }));
  };

  const isProductLiked = (productId) => {
    return likedProducts.some(liked => liked.id === productId);
  };

  const openViewMore = (product) => {
    setSelectedViewMoreProduct(product);
    setShowViewMore(true);
  };

  const closeViewMore = () => {
    setShowViewMore(false);
    setSelectedViewMoreProduct(null);
  };

  const openCartModal = () => {
    setShowCartModal(true);
  };

  const closeCartModal = () => {
    setShowCartModal(false);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const updateCartQuantity = (itemId, change) => {
    const updatedCart = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update cart count in navbar
    const uniqueItems = updatedCart.length;
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
  };

  const removeFromCartModal = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update cart count in navbar
    const uniqueItems = updatedCart.length;
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
  };

  // Weight options and pricing
  const weightOptions = [
    { value: '500g', label: '500g', multiplier: 1 },
    { value: '1kg', label: '1 kg', multiplier: 2 }
  ];

  // Modal functions
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedWeight('500g');
    setModalQuantity(1);
    setIsEditing(false);
    setEditingCartItem(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSelectedWeight('500g');
    setModalQuantity(1);
    setIsEditing(false);
    setEditingCartItem(null);
  };

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = modalQuantity + change;
    if (newQuantity >= 1) {
      setModalQuantity(newQuantity);
    }
  };

  const getModalPrice = () => {
    if (!selectedProduct) return 0;
    return selectedWeight === '1kg' ? selectedProduct.price * 2 : selectedProduct.price;
  };

  const getModalOriginalPrice = () => {
    if (!selectedProduct) return 0;
    return selectedWeight === '1kg' ? selectedProduct.originalPrice * 2 : selectedProduct.originalPrice;
  };

  const handleModalAddToCart = () => {
    if (selectedProduct) {
      const cartItem = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: getModalPrice(),
        originalPrice: getModalOriginalPrice(),
        weight: selectedWeight,
        quantity: modalQuantity,
        image: selectedProduct.image
      };
      
      if (isEditing && editingCartItem) {
        // Replace the existing item
        const updatedCart = cartItems.map(item => 
          item.id === editingCartItem.id && item.weight === editingCartItem.weight
            ? { ...cartItem }
            : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedCart }));
      } else {
        // Add new item directly to cart
        console.log('Adding to cart:', cartItem);
        
        // Get existing cart from localStorage
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if item already exists
        const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
        
        if (existingItemIndex === -1) {
          // Add new item to cart
          const updatedCart = [...existingCart, cartItem];
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          setCartItems(updatedCart);
        } else {
          // Update existing item quantity
          const updatedCart = existingCart.map(item =>
            item.id === cartItem.id
              ? { ...item, quantity: item.quantity + cartItem.quantity }
              : item
          );
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          setCartItems(updatedCart);
        }
        
        // Update cart count in navbar
        const finalCart = JSON.parse(localStorage.getItem('cart')) || [];
        const uniqueItems = finalCart.length;
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
      }
      closeModal();
      setShowCartModal(true);
      console.log('Cart modal should be visible now');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedCategory(newFilters.selectedCategory);
  };

  // Cart functionality
  const addToCart = (product, weight) => {
    const cartKey = `${product.id}-${weight}`;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartKey === cartKey);
      if (existingItem) {
        return prevCart.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const weightOption = weightOptions.find(w => w.value === weight);
        const price = Math.round(product.price * weightOption.multiplier);
        const originalPrice = Math.round(product.originalPrice * weightOption.multiplier);
        return [...prevCart, { 
          ...product, 
          quantity: 1, 
          cartKey,
          weight,
          price,
          originalPrice
        }];
      }
    });
  };

  const addToCartPage = (product, weight) => {
    // Check if quantity is 0 - don't add to cart if count is 0
    const cartKey = `${product.id}-${weight}`;
    const cartQuantity = quantityDisplay[cartKey] || 0;
    if (cartQuantity === 0) {
      alert("Please increase the quantity first using + button!");
      return;
    }
    
    const weightOption = weightOptions.find(w => w.value === weight);
    const price = Math.round(product.price * weightOption.multiplier);
    const originalPrice = Math.round(product.originalPrice * weightOption.multiplier);
    
    // Create cart item for localStorage with the current quantity
    const cartItem = {
      id: `${product.id}-${weight}`,
      name: product.name,
      price: price,
      originalPrice: originalPrice,
      image: product.image,
      weight: weight,
      quantity: cartQuantity
    };
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex === -1) {
      // Add new item to cart
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // Update existing item quantity
      const updatedCart = existingCart.map(item =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + cartQuantity }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    // Update cart count in navbar/sidebar
    setTimeout(() => {
      const finalCart = JSON.parse(localStorage.getItem('cart')) || [];
      const uniqueItems = finalCart.length; // Count unique products, not quantities
      console.log('Cart updated - Unique items:', uniqueItems, 'Cart:', finalCart);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
      // Also trigger storage event for cross-tab compatibility
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(finalCart)
      }));
    }, 100);
    
    // Update local cart state
    const finalCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(finalCart);
    
    // Show cart modal instead of notification
    setShowCartModal(true);
  };

  const removeFromCart = (cartKey) => {
    setCart(prevCart => prevCart.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, newQuantity) => {
    console.log('updateQuantity called:', cartKey, newQuantity);
    if (newQuantity <= 0) {
      setQuantityDisplay(prev => {
        const newState = { ...prev };
        delete newState[cartKey];
        return newState;
      });
    } else {
      setQuantityDisplay(prev => ({
        ...prev,
        [cartKey]: newQuantity
      }));
    }
  };

  const getCartItemQuantity = (productId, weight) => {
    const cartKey = `${productId}-${weight}`;
    return quantityDisplay[cartKey] || 0;
  };


  const getSelectedWeight = (productId) => {
    return selectedWeights[productId] || '1kg';
  };


  const getProductPrice = (product, weight) => {
    const weightOption = weightOptions.find(w => w.value === weight);
    return Math.round(product.price * weightOption.multiplier);
  };

  const getProductOriginalPrice = (product, weight) => {
    const weightOption = weightOptions.find(w => w.value === weight);
    return Math.round(product.originalPrice * weightOption.multiplier);
  };

  const applyFilters = (products, filterSettings) => {
    let filtered = [...products];

    // Filter by selected items (subcategories)
    if (filterSettings.selectedItems && filterSettings.selectedItems.length > 0) {
      const selectedProductNames = filterSettings.selectedItems.flatMap(item => item.products);
      filtered = filtered.filter(product => 
        selectedProductNames.some(selectedName => 
          product.name.toLowerCase().includes(selectedName.toLowerCase())
        )
      );
    }

    // Filter by package types
    if (filterSettings.selectedPackageTypes && filterSettings.selectedPackageTypes.length > 0) {
      filtered = filtered.filter(product => 
        filterSettings.selectedPackageTypes.some(packageType => 
          product.name.toLowerCase().includes(packageType.toLowerCase())
        )
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= filterSettings.priceRange[0] && 
      product.price <= filterSettings.priceRange[1]
    );

    // Filter by availability
    if (filterSettings.availability === 'in-stock') {
      filtered = filtered.filter(product => product.inStock);
    } else if (filterSettings.availability === 'out-of-stock') {
      filtered = filtered.filter(product => !product.inStock);
    }

    // Filter by organic only
    if (filterSettings.organicOnly) {
      filtered = filtered.filter(product => product.organic);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filterSettings.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
          return Math.random() - 0.5; // Random for demo
        default:
          return 0;
      }
    });

    return filtered;
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  
  // If specific items are selected, show only those products
  let currentProducts = [];
  if (filters.selectedItems && filters.selectedItems.length > 0) {
    // Get all products from all categories and filter by selected items
    const allProducts = categories.flatMap(cat => cat.products);
    currentProducts = allProducts;
  } else {
    // Show products from selected category
    currentProducts = selectedCategoryData ? selectedCategoryData.products : [];
  }
  
  const filteredProductsList = applyFilters(currentProducts, filters);

  useEffect(() => {
    if (showProducts && selectedCategoryData) {
      setFilteredProducts(applyFilters(selectedCategoryData.products, filters));
    }
  }, [filters, showProducts, selectedCategoryData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortDropdown && !event.target.closest('.sort-dropdown-container')) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown]);

  return (
    <div className="all-categories-page">
      <div className="all-categories-container">
            <div className="all-products-content">
              <div className="all-products-sidebar">
                {/* <Filter 
                  onFilterChange={handleFilterChange}
                  categories={categories}
                  selectedCategory={selectedCategory}
                /> */}
              </div>
              
              <div className="all-products-main">


            <div className="all-products-header">
              <div className="all-products-info">
                <div className="all-products-info-content">
                  <div className="all-products-text">
                    <h1 className="all-products-title">All Products</h1>
                    <p className="all-products-subtitle">Explore our complete range of organic products</p>
                  </div>
                </div>
                
              </div>
            </div>
            
            {/* Products count and Sort dropdown in same row */}
            <div className="products-controls-row">
              <div className="all-products-count">
                {filters.selectedItems && filters.selectedItems.length > 0 ? (
                  `Showing ${filteredProductsList.length} products from selected categories`
                ) : filters.selectedPackageTypes && filters.selectedPackageTypes.length > 0 ? (
                  `Showing ${filteredProductsList.length} products from selected package types`
                ) : (
                  `Showing ${filteredProductsList.length} of ${currentProducts.length} products`
                )}
              </div>
              
              {/* Sort Dropdown - positioned on the right */}
              <div className="sort-dropdown-container">
                <button
                  className={`sort-dropdown-trigger ${showSortDropdown ? 'active' : ''}`}
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <span className="sort-by-label">Sort by:</span>
                  <span className="sort-selection">Name, A-Z</span>
                  <img 
                    src={downIcon} 
                    alt="dropdown" 
                    className={`sort-arrow ${showSortDropdown ? 'open' : ''}`}
                  />
                </button>
                {showSortDropdown && (
                  <div className="sort-dropdown-menu">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        className={`sort-option ${filters.sortBy === option.value ? 'active' : ''}`}
                        onClick={() => handleSortChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
                <div className="all-products-info">
              
              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="cart-summary">
                  <h3>Cart ({cart.reduce((total, item) => total + item.quantity, 0)} items)</h3>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-quantity">Qty: {item.quantity}</span>
                        <span className="cart-item-price">₹{item.price * item.quantity}</span>
                        <button 
                          className="remove-from-cart-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total">
                    Total: ₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}
                  </div>
                </div>
              )}
                </div>
                
            <div className="all-products-scroll-container">
                <div className="all-products-grid">
                {filteredProductsList.map((product, index) => {
                  const cartQuantity = getCartItemQuantity(product.id, '1kg');
                  const currentPrice = product.price;
                  const currentOriginalPrice = product.originalPrice;
                  const cartKey = `${product.id}-1kg`;
                  
                  
                  return (
                    <div key={product.id} className="product-card" data-product-id={product.id}>
                      {/* Discount Badge */}
                      <div className="discount-badge">
                        -{product.discount}%
                      </div>
                      
                      {/* Heart Icon */}
                      <button 
                        className={`heart-icon ${isProductLiked(product.id) ? 'liked' : ''}`}
                        onClick={() => toggleLike(product)}
                        title={isProductLiked(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>

                      {/* Product Image */}
                      <div className="product-image-container">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="product-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="product-image-placeholder" style={{display: 'none'}}>
                          <span className="product-emoji">
                          {selectedCategory === 'all' ? '🌱' : 
                           selectedCategory === 'pulses' ? '🌾' :
                           selectedCategory === 'dryfruits' ? '🥜' :
                           selectedCategory === 'sweeteners' ? '🍯' : '🌶️'}
                        </span>
                      </div>
                      </div>

                      {/* Product Details */}
                      <div className="product-details">
                        <h3 className="product-name">{product.name}</h3>
                        
                        <div className="product-pricing">
                          <span className="current-price">
                            ₹{cartQuantity > 0 ? currentPrice * cartQuantity : currentPrice}
                          </span>
                          <span className="original-price">
                            ₹{cartQuantity > 0 ? currentOriginalPrice * cartQuantity : currentOriginalPrice}
                          </span>
                          <span className="discount-percentage">
                            ({product.discount}% Off)
                          </span>
                        </div>
                        
                        <div className="view-details-section">
                          <button 
                            className="view-details-link"
                            onClick={() => openViewMore(product)}
                          >
                            View More Details
                          </button>
                        </div>
                        
                        <div className="product-actions">
                          <button 
                            className="add-btn"
                            onClick={() => openModal(product)}
                          >
                            <span>Add To Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
                </div>
                
                {filteredProductsList.length === 0 && (
                  <div className="all-no-products">
                    <p>No products found matching your filters.</p>
                    <button 
                      className="all-clear-filters-btn"
                      onClick={() => handleFilterChange({
                        priceRange: [0, 1000],
                        sortBy: 'name',
                        availability: 'all',
                        organicOnly: false,
                    selectedCategory: selectedCategory,
                    selectedItems: [],
                    selectedPackageTypes: []
                      })}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
      </div>
      
      {/* Success Notification Popup */}
      {showNotification && (
        <div className="success-notification">
          <div className="notification-content">
            <span className="notification-icon">✅</span>
            <span className="notification-text">Item added to cart successfully!</span>
            </div>
          </div>
        )}

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} title="Close">
              <img src={closeGif} alt="Close" className="close-icon" />
            </button>
            
            <div className="modal-product-info">
              <div className="modal-product-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="modal-product-details">
                <h3 className="modal-product-name">{selectedProduct.name}</h3>
                <div className="modal-pricing">
                  <span className="modal-original-price">₹{getModalOriginalPrice().toFixed(2)}</span>
                  <span className="modal-current-price">₹{getModalPrice().toFixed(2)}</span>
                  <p className="modal-tax-info">(Inc. of all taxes)</p>
                </div>
              </div>
            </div>

            <div className="modal-size-section">
              <p className="modal-size-label">Size: {selectedWeight}</p>
              <div className="modal-weight-options">
                <button 
                  className={`modal-weight-btn ${selectedWeight === '500g' ? 'selected' : ''}`}
                  onClick={() => handleWeightChange('500g')}
                >
                  <span className="weight-text">500 g</span>
                  <div className="weight-pricing">
                    <span className="weight-original-price">₹{selectedProduct.originalPrice.toFixed(2)}</span>
                    <span className="weight-current-price">₹{selectedProduct.price.toFixed(2)}</span>
                  </div>
                  <div className="discount-badge-modal">{selectedProduct.discount}% OFF</div>
                </button>
                
                <button 
                  className={`modal-weight-btn ${selectedWeight === '1kg' ? 'selected' : ''}`}
                  onClick={() => handleWeightChange('1kg')}
                >
                  <span className="weight-text">1 kg</span>
                  <div className="weight-pricing">
                    <span className="weight-original-price">₹{(selectedProduct.originalPrice * 2).toFixed(2)}</span>
                    <span className="weight-current-price">₹{(selectedProduct.price * 2).toFixed(2)}</span>
                  </div>
                  <div className="discount-badge-modal">{selectedProduct.discount}% OFF</div>
                </button>
              </div>
            </div>

            <div className="modal-quantity-section">
              <div className="modal-quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="quantity-display">{modalQuantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-add-to-cart-btn" onClick={handleModalAddToCart}>
                {isEditing ? 'REPLACE ITEM' : 'ADD TO CART'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View More Details Component */}
      {showViewMore && selectedViewMoreProduct && (
        <ViewMoreDetails 
          product={selectedViewMoreProduct} 
          onClose={closeViewMore} 
        />
      )}

      {/* Shopping Cart Modal */}
      {showCartModal && (
        <div className="cart-modal-overlay" onClick={closeCartModal}>
          <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>SHOPPING CART</h2>
              <button 
                className="cart-close-btn"
                onClick={closeCartModal}
                title="Close"
              >
                <img src={closeGif} alt="Close" className="close-gif" />
              </button>
            </div>
            
            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-weight">{item.weight}</p>
                    <div className="cart-item-pricing">
                      <span className="cart-original-price">₹{item.originalPrice.toFixed(2)}</span>
                      <span className="cart-current-price">₹{item.price.toFixed(2)}</span>
                    </div>
                    <div className="cart-quantity-controls">
                      <button 
                        className="cart-quantity-btn"
                        onClick={() => updateCartQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="cart-quantity">{item.quantity}</span>
                      <button 
                        className="cart-quantity-btn"
                        onClick={() => updateCartQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-actions">
                      <button 
                        className="cart-edit-btn"
                        onClick={() => {
                          setEditingCartItem(item);
                          setSelectedProduct({
                            id: item.id,
                            name: item.name,
                            price: item.price / item.quantity,
                            originalPrice: item.originalPrice / item.quantity,
                            image: item.image
                          });
                          setSelectedWeight(item.weight);
                          setModalQuantity(item.quantity);
                          setIsEditing(true);
                          closeCartModal();
                          setShowModal(true);
                        }}
                        title="Edit"
                      >
                        <img src={editIcon} alt="Edit" />
                      </button>
                      <button 
                        className="cart-remove-btn"
                        onClick={() => removeFromCartModal(item.id)}
                        title="Remove"
                      >
                        <img src={binIcon} alt="Remove" />
                      </button>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            <div className="cart-summary">
              <div className="cart-subtotal">
                <span>Subtotal:</span>
                <span>₹{getCartSubtotal().toFixed(2)}</span>
              </div>
              <p className="cart-tax-info">Taxes and shipping calculated at checkout.</p>
              
              <div className="cart-actions">
                <button 
                  className="cart-view-btn"
                  onClick={() => {
                    closeCartModal();
                    navigate('/cart');
                  }}
                >
                  VIEW CART
                </button>
                <button 
                  className="cart-buy-btn"
                  onClick={() => {
                    closeCartModal();
                    navigate('/cart');
                  }}
                >
                  BUY NOW
                  <div className="payment-icons">
                    <img src={visaIcon} alt="Visa" />
                    <img src={mastercardIcon} alt="Mastercard" />
                    <img src={rupayIcon} alt="RuPay" />
                    <img src={upiIcon} alt="UPI" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCategories;