import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './ProductDetail.css';

// Import product images
import almondImage from '../../assets/almond.png';
import cashewnutImage from '../../assets/cashewnut.png';
import jeggaryImage from '../../assets/jeggary.png';
import chanadalImage from '../../assets/chanadal.png';
import chilly2Image from '../../assets/chilly2.png';
import termeric5Image from '../../assets/termeric5.png';
import pistaImage from '../../assets/pista1.png';
import raisinImage from '../../assets/rainse1.png';

// Import trust badge icons
import freeShippingIcon from '../../assets/free-shipping.png';
import securePaymentIcon from '../../assets/secure-payment.png';
import organicCertifiedIcon from '../../assets/organic_certified.png';
import codIcon from '../../assets/COD.png';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, phoneNumber } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [openSections, setOpenSections] = useState({
    description: false,
    ingredients: false,
    usageInfo: false,
    benefits: false,
    storageInfo: false
  });
  const scrollPositionRef = useRef({ x: 0, y: 0 });
  
  // Customer Reviews State
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Shanmuganathan',
      rating: 4,
      title: 'Good product',
      content: 'Super taste and healthy',
      date: '08/26/2025',
      verified: true
    }
  ]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: '',
    displayName: '',
    email: '',
    image: null
  });
  const [sortBy, setSortBy] = useState('Most Recent');
  const modalRef = useRef(null);

  // Product data (same as BestSellers)
  const allProducts = [
    {
      id: 1,
      name: 'Almonds',
      price: 450,
      originalPrice: 500,
      image: almondImage,
      discount: 10,
      inStock: true,
      organic: true,
      weight: '250g',
      description: 'Premium quality organic almonds. Rich in nutrients and perfect for healthy snacking.',
      rating: 4.8,
      reviews: '1.5k+',
      images: [almondImage, almondImage, almondImage]
    },
    {
      id: 2,
      name: 'Cashew Nuts',
      price: 550,
      originalPrice: 600,
      image: cashewnutImage,
      discount: 8,
      inStock: true,
      organic: true,
      weight: '250g',
      description: 'Creamy and delicious organic cashew nuts. Perfect for cooking and snacking.',
      rating: 4.7,
      reviews: '1.2k+',
      images: [cashewnutImage, cashewnutImage, cashewnutImage]
    },
    {
      id: 3,
      name: 'Jaggery',
      price: 70,
      originalPrice: 80,
      image: jeggaryImage,
      discount: 12,
      inStock: true,
      organic: true,
      weight: '1kg',
      description: 'Natural sweetener made from organic sugarcane. Rich in minerals and perfect for healthy cooking.',
      rating: 4.9,
      reviews: '1.2k+',
      images: [jeggaryImage, jeggaryImage, jeggaryImage]
    },
    {
      id: 4,
      name: 'Chana Dal',
      price: 120,
      originalPrice: 140,
      image: chanadalImage,
      discount: 14,
      inStock: true,
      organic: true,
      weight: '500g',
      description: 'Organic chana dal. High in protein and fiber, perfect for healthy meals.',
      rating: 4.6,
      reviews: '800+',
      images: [chanadalImage, chanadalImage, chanadalImage]
    },
    {
      id: 5,
      name: 'Red Chillies',
      price: 100,
      originalPrice: 120,
      image: chilly2Image,
      discount: 17,
      inStock: true,
      organic: true,
      weight: '250g',
      description: 'Spicy organic red chillies. Adds perfect heat and flavor to your dishes.',
      rating: 4.7,
      reviews: '700+',
      images: [chilly2Image, chilly2Image, chilly2Image]
    },
    {
      id: 6,
      name: 'Turmeric Powder',
      price: 95,
      originalPrice: 110,
      image: termeric5Image,
      discount: 14,
      inStock: true,
      organic: true,
      weight: '250g',
      description: 'Pure organic turmeric powder. Known for its health benefits and vibrant golden color.',
      rating: 4.8,
      reviews: '900+',
      images: [termeric5Image, termeric5Image, termeric5Image]
    },
    {
      id: 7,
      name: 'Pistachios',
      price: 600,
      originalPrice: 650,
      image: pistaImage,
      discount: 8,
      inStock: true,
      organic: true,
      weight: '250g',
      description: 'Premium quality organic pistachios. Rich in nutrients and perfect for healthy snacking.',
      rating: 4.9,
      reviews: '1k+',
      images: [pistaImage, pistaImage, pistaImage]
    },
    {
      id: 8,
      name: 'Raisins',
      price: 200,
      originalPrice: 220,
      image: raisinImage,
      discount: 9,
      inStock: true,
      organic: true,
      weight: '500g',
      description: 'Sweet and chewy organic raisins. Perfect for snacking, baking, and adding to your meals.',
      rating: 4.7,
      reviews: '700+',
      images: [raisinImage, raisinImage, raisinImage]
    }
  ];

  const product = allProducts.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if product is in wishlist
    const mobile = userData?.mobile || phoneNumber;
    if (mobile && userData?.wishlist) {
      const liked = userData.wishlist.some(item => {
        const itemId = typeof item === 'object' ? item.id : item;
        return itemId === product?.id.toString() || itemId === product?.id;
      });
      setIsLiked(liked);
    } else {
      const savedLikes = JSON.parse(localStorage.getItem('wishlist')) || [];
      const liked = savedLikes.some(item => {
        const itemId = typeof item === 'object' ? item.id : item;
        return itemId === product?.id.toString() || itemId === product?.id;
      });
      setIsLiked(liked);
    }
  }, [id, product, userData, phoneNumber]);

  // Prevent auto-scroll when modal opens
  useEffect(() => {
    if (showReviewModal && modalRef.current) {
      // Reset scroll position to top
      const formElement = modalRef.current.querySelector('.review-form');
      if (formElement) {
        formElement.scrollTop = 0;
      }
      // Prevent any input from auto-focusing
      const inputs = modalRef.current.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        if (document.activeElement === input) {
          input.blur();
        }
      });
    }
  }, [showReviewModal]);

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container">
          <h1>Product Not Found</h1>
          <button onClick={() => navigate('/')} className="back-button">Go Back Home</button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      weight: product.weight,
      quantity: quantity
    };
    
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex === -1) {
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = existingCart.map(item =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    console.log('Product added to cart, notification should show');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const toggleLike = () => {
    const mobile = userData?.mobile || phoneNumber;
    if (!mobile) {
      navigate('/account');
      return;
    }
    setIsLiked(!isLiked);
    // Add wishlist logic here
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

      const toggleSection = (section, e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
          // Store current scroll position
          scrollPositionRef.current = {
            x: window.scrollX || window.pageXOffset,
            y: window.scrollY || window.pageYOffset
          };
          
          // Update state
          setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
          }));
        } else {
          setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
          }));
        }
      };

      // Preserve scroll position after state update
      useLayoutEffect(() => {
        if (scrollPositionRef.current.y !== 0 || scrollPositionRef.current.x !== 0) {
          window.scrollTo({
            top: scrollPositionRef.current.y,
            left: scrollPositionRef.current.x,
            behavior: 'auto'
          });
        }
      }, [openSections]);

      // Calculate review statistics
      const calculateReviewStats = () => {
        if (reviews.length === 0) return { average: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        const average = total / reviews.length;
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => breakdown[r.rating]++);
        return { average, breakdown, total: reviews.length };
      };

      const reviewStats = calculateReviewStats();

      // Handle star click for rating
      const handleStarClick = (rating) => {
        setReviewForm(prev => ({ ...prev, rating }));
      };

      // Handle review form input
      const handleReviewInput = (field, value) => {
        setReviewForm(prev => ({ ...prev, [field]: value }));
      };

      // Handle image upload
      const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setReviewForm(prev => ({ ...prev, image: reader.result }));
          };
          reader.readAsDataURL(file);
        }
      };

      // Submit review
      const handleSubmitReview = (e) => {
        e.preventDefault();
        if (reviewForm.rating === 0 || !reviewForm.title || !reviewForm.content || !reviewForm.displayName || !reviewForm.email) {
          alert('Please fill in all required fields');
          return;
        }

        const newReview = {
          id: Date.now(), // Use timestamp to ensure unique ID
          name: reviewForm.displayName,
          rating: reviewForm.rating,
          title: reviewForm.title,
          content: reviewForm.content,
          date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          verified: false,
          image: reviewForm.image
        };

        // Check if review already exists (prevent duplicates)
        setReviews(prev => {
          const exists = prev.some(r => r.id === newReview.id);
          if (exists) return prev;
          return [...prev, newReview];
        });
        
        setReviewForm({
          rating: 0,
          title: '',
          content: '',
          displayName: '',
          email: '',
          image: null
        });
        setShowReviewModal(false);
      };

      // Sort reviews
      const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'Most Recent') {
          // Parse MM/DD/YYYY format
          const parseDate = (dateStr) => {
            const [month, day, year] = dateStr.split('/');
            return new Date(year, month - 1, day);
          };
          return parseDate(b.date) - parseDate(a.date);
        } else if (sortBy === 'Highest Rating') {
          return b.rating - a.rating;
        } else if (sortBy === 'Lowest Rating') {
          return a.rating - b.rating;
        }
        return 0;
      });

  // Product information data
  const productInfo = {
    description: [
      'Seasonal product, locally grown',
      product.description,
      'This product contains no additives, chemicals or preservatives. It is 100% natural.'
    ],
    ingredients: [product.name],
    usageInfo: [
      `${product.name} is a versatile ingredient used in various culinary applications.`,
      `Perfect for traditional recipes and modern cooking styles.`,
      `Can be used in both sweet and savory dishes.`,
      `Ideal for healthy snacking and meal preparation.`
    ],
    benefits: [
      'Good source of essential nutrients',
      '100% organic and natural',
      'Rich in vitamins and minerals',
      'Supports overall health and wellness'
    ],
    storageInfo: 'Store in an airtight container away from damp and direct sunlight. Keep in a cool, dry place.'
  };

  return (
    <div className="product-detail-page">
      {showNotification && (
        <div className="cart-notification">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>Product added to cart successfully!</span>
        </div>
      )}
      <div className="product-detail-container">
        <div className="product-detail-content">
          {/* Left Side - Product Images */}
          <div className="product-images-section">
            <div className="product-thumbnails">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className="product-main-image">
              <img src={product.images[selectedImageIndex]} alt={product.name} />
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name} {product.weight}</h1>
              
              <div className="product-pricing-row">
                <div className="price-container">
                  <span className="original-price">Rs. {product.originalPrice.toFixed(2)}</span>
                  <span className="current-price">Rs. {product.price.toFixed(2)}</span>
                  <span className="discount-badge">SAVE {discountPercentage}%</span>
                </div>
                <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => {
                  const filled = i < Math.floor(product.rating);
                  const halfFilled = i === Math.floor(product.rating) && product.rating % 1 >= 0.5;
                  return (
                    <svg
                      key={i}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={filled ? '#FFC107' : 'none'}
                      stroke="#FFC107"
                      strokeWidth="2"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  );
                })}
              </div>
              <span className="reviews-count">{product.reviews} reviews</span>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            <div className="product-actions">
              <div className="top-row-actions">
                <div className="quantity-selector">
                  <button className="qty-btn" onClick={() => handleQuantityChange(-1)}>–</button>
                  <span className="qty-value">{quantity}</span>
                  <button className="qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                </div>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  ADD TO CART
                </button>
                <button className="buy-now-btn" onClick={handleBuyNow}>
                  BUY IT NOW
                </button>
              </div>
            </div>

            <div className="delivery-info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <p>Order Now to get it before <span className="delivery-date">{(() => {
                const date = new Date();
                date.setDate(date.getDate() + 7);
                return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
              })()}</span>.</p>
            </div>

            <div className="trust-badges">
              <div className="badge">
                <img src={freeShippingIcon} alt="Free Delivery" className="badge-icon" />
                <span className="badge-text">Free Delivery</span>
              </div>
              <div className="badge">
                <img src={securePaymentIcon} alt="Secured Gateway" className="badge-icon" />
                <span className="badge-text">Secured Gateway</span>
              </div>
              <div className="badge">
                <img src={organicCertifiedIcon} alt="Organic Certified" className="badge-icon" />
                <span className="badge-text">Organic Certified</span>
              </div>
              <div className="badge">
                <img src={codIcon} alt="COD Available" className="badge-icon" />
                <span className="badge-text">COD Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Sections - Full Width */}
        <div className="product-info-sections">
          {/* Description Section */}
          <div className="info-section">
            <div 
              className="info-section-header" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSection('description', e);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSection('description', e);
                }
              }}
            >
              <h3 className="info-section-title">DESCRIPTION</h3>
              <span className="info-section-toggle">
                {openSections.description ? '−' : '+'}
              </span>
            </div>
            {openSections.description && (
              <div className="info-section-content">
                {productInfo.description.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            )}
          </div>

          {/* Ingredients Section */}
          <div className="info-section">
            <div 
              className="info-section-header" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSection('ingredients', e);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSection('ingredients', e);
                }
              }}
            >
              <h3 className="info-section-title">INGREDIENTS</h3>
              <span className="info-section-toggle">
                {openSections.ingredients ? '−' : '+'}
              </span>
            </div>
            {openSections.ingredients && (
              <div className="info-section-content">
                {productInfo.ingredients.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            )}
          </div>

          {/* Usage Info Section */}
          <div className="info-section">
            <div 
              className="info-section-header" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSection('usageInfo', e);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSection('usageInfo', e);
                }
              }}
            >
              <h3 className="info-section-title">USAGE INFO</h3>
              <span className="info-section-toggle">
                {openSections.usageInfo ? '−' : '+'}
              </span>
            </div>
            {openSections.usageInfo && (
              <div className="info-section-content">
                <ul>
                  {productInfo.usageInfo.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Benefits Section */}
          <div className="info-section">
            <div 
              className="info-section-header" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSection('benefits', e);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSection('benefits', e);
                }
              }}
            >
              <h3 className="info-section-title">BENEFITS</h3>
              <span className="info-section-toggle">
                {openSections.benefits ? '−' : '+'}
              </span>
            </div>
            {openSections.benefits && (
              <div className="info-section-content">
                <ul>
                  {productInfo.benefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Storage Info Section */}
          <div className="info-section">
            <div 
              className="info-section-header" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSection('storageInfo', e);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSection('storageInfo', e);
                }
              }}
            >
              <h3 className="info-section-title">STORAGE INFO</h3>
              <span className="info-section-toggle">
                {openSections.storageInfo ? '−' : '+'}
              </span>
            </div>
            {openSections.storageInfo && (
              <div className="info-section-content">
                <p>{productInfo.storageInfo}</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="product-reviews-section">
          <h2 className="reviews-section-title">Customer Reviews</h2>
          
          {/* Review Summary */}
          <div className="reviews-summary">
            <div className="reviews-summary-left">
              <div className="overall-rating">
                <div className="overall-rating-row">
                  <div className="overall-stars">
                    {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={i < Math.round(reviewStats.average) ? '#D4AF37' : 'none'}
                      stroke="#D4AF37"
                      strokeWidth="2"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <div className="rating-text">
                    <span className="rating-number">{reviewStats.average.toFixed(2)}</span>
                  </div>
                </div>
                <p className="reviews-count-text">
                  Based on {reviewStats.total} reviews
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#28a745" style={{ marginLeft: '5px', verticalAlign: 'middle' }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </p>
              </div>
            </div>

            <div className="reviews-summary-right">
              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = reviewStats.breakdown[rating] || 0;
                  const percentage = reviewStats.total > 0 ? (count / reviewStats.total) * 100 : 0;
                  return (
                    <div key={rating} className="rating-bar-item">
                      <div className="rating-stars-small">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={i < rating ? '#D4AF37' : 'none'}
                            stroke="#D4AF37"
                            strokeWidth="2"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <div className="rating-bar-container">
                        <div 
                          className="rating-bar-fill" 
                          style={{ width: `${percentage}%`, backgroundColor: percentage > 0 ? '#D4AF37' : '#e0e0e0' }}
                        ></div>
                      </div>
                      <span className="rating-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="write-review-btn-container">
              <button 
                className="write-review-btn"
                onClick={() => setShowReviewModal(true)}
              >
                Write a review
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="reviews-list-container">
            <div className="reviews-header">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Most Recent</option>
                <option>Highest Rating</option>
                <option>Lowest Rating</option>
              </select>
            </div>

            <div className="reviews-list" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto', width: 'max-content', minWidth: '100%' }}>
              {sortedReviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-item-top">
                    <div className="review-item-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">{review.name}</span>
                          {review.verified && (
                            <span className="verified-badge">Verified</span>
                          )}
                        </div>
                      </div>
                      <div className="review-date">{review.date}</div>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={i < review.rating ? '#D4AF37' : 'none'}
                          stroke="#D4AF37"
                          strokeWidth="2"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="review-content-wrapper">
                    <h4 className="review-title">{review.title}</h4>
                    <p className="review-content">{review.content}</p>
                    {review.image && (
                      <div className="review-image-container">
                        <img src={review.image} alt="Review" className="review-image" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Write a review</h2>
              <button className="modal-close" onClick={() => setShowReviewModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form className="review-form" onSubmit={handleSubmitReview}>
              {/* Rating */}
              <div className="form-group">
                <label>Rating</label>
                <div className="star-rating-input">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      className="star-btn"
                      onClick={() => handleStarClick(rating)}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill={rating <= reviewForm.rating ? '#D4AF37' : 'none'}
                        stroke="#D4AF37"
                        strokeWidth="2"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div className="form-group">
                <label>Review Title (100)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Give your review a title"
                  maxLength={100}
                  value={reviewForm.title}
                  onChange={(e) => handleReviewInput('title', e.target.value)}
                  required
                  autoFocus={false}
                  tabIndex={0}
                />
              </div>

              {/* Review Content */}
              <div className="form-group">
                <label>Review content</label>
                <textarea
                  className="form-textarea"
                  placeholder="Start writing here..."
                  value={reviewForm.content}
                  onChange={(e) => handleReviewInput('content', e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Picture/Video Upload */}
              <div className="form-group">
                <label>Picture/Video (optional)</label>
                <div className="upload-area">
                  {reviewForm.image ? (
                    <div className="upload-preview">
                      <img src={reviewForm.image} alt="Preview" />
                      <button type="button" onClick={() => setReviewForm(prev => ({ ...prev, image: null }))}>Remove</button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </label>
                  )}
                </div>
              </div>

              {/* Display Name */}
              <div className="form-group">
                <label>
                  Display name
                  <span className="label-hint">(displayed publicly like John Smith)</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Display name"
                  value={reviewForm.displayName}
                  onChange={(e) => handleReviewInput('displayName', e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Your email address"
                  value={reviewForm.email}
                  onChange={(e) => handleReviewInput('email', e.target.value)}
                  required
                />
              </div>

              {/* Form Buttons */}
              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel review
                </button>
                <button type="submit" className="submit-btn">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sticky Footer Bar */}
      <div className="sticky-product-bar">
        <div className="sticky-product-info">
          <img src={product.image} alt={product.name} className="sticky-product-image" />
          <div className="sticky-product-details">
            <h3 className="sticky-product-name">{product.name} {product.weight}</h3>
            <div className="sticky-pricing">
              <span className="sticky-original-price">Rs. {product.originalPrice.toFixed(2)}</span>
              <span className="sticky-current-price">Rs. {product.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="sticky-actions">
          <div className="sticky-quantity">
            <button className="sticky-qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
            <span className="sticky-qty-value">{quantity}</span>
            <button className="sticky-qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
          </div>
          <button className="sticky-add-to-cart-btn" onClick={handleAddToCart}>
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

