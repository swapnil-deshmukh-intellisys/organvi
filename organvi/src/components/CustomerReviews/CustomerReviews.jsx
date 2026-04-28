import React, { useState, useEffect } from 'react';
import './CustomerReviews.css';
import wheatFlour from '../../assets/chanadal.png';
import pista from '../../assets/pista1.png';
import chill from '../../assets/chilly2.png';
import turmeric from '../../assets/termeric.png';
import jaggery from '../../assets/jeggary.png';
import almonds from '../../assets/almond.png';

const CustomerReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Neelam Sharma",
      title: "Home Chef",
      product: "Organic Whole Wheat Flour",
      review: "Atta is fresh, soft, and makes chapatis that stay fluffy and tasty for long. Truly good and healthy choice",
      customerImage: wheatFlour
    },
    {
      id: 2,
      name: "Jagdish",
      title: "Food Enthusiast",
      product: "Organic Pistachios",
      review: "Best quality pistachios, very fresh and crunchy. The taste is amazing and they are perfectly roasted.",
      customerImage: pista
    },
    {
      id: 3,
      name: "Priya Singh",
      title: "Health Conscious",
      product: "Organic Red Chillies",
      review: "Excellent quality chillies, very fresh and aromatic. The spice level is perfect and adds great flavor to dishes.",
      customerImage: chill
    },
    {
      id: 4,
      name: "Rajesh Kumar",
      title: "Chef",
      product: "Organic Turmeric Powder",
      review: "Great product! The turmeric is very fresh and has a beautiful golden color. My family loves the quality.",
      customerImage: turmeric
    },
    {
      id: 5,
      name: "Sunita Patel",
      title: "Nutritionist",
      product: "Organic Jaggery",
      review: "Perfect quality jaggery. Very fresh and natural sweetness. The taste is amazing and pure.",
      customerImage: jaggery
    },
    {
      id: 6,
      name: "Amit Verma",
      title: "Wellness Coach",
      product: "Organic Almonds",
      review: "Outstanding quality! The almonds are very fresh and crunchy. Perfect for snacking and cooking. Highly recommended.",
      customerImage: almonds
    }
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const currentReview = reviews[currentSlide];

  return (
    <div className="customer-reviews">
      <div className="customer-reviews-background"></div>
      <div className="customer-reviews-container">
        <h2 className="reviews-title">
          <span className="title-word">Customers</span> <span className="title-word">Love</span>
        </h2>
        
        <div className="reviews-slider-wrapper">
          <div 
            className="reviews-slider"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: 'transform 0.6s ease-in-out'
            }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="review-slide">
                <div className="review-card">
                  <div className="customer-image-container">
                    <img 
                      src={review.customerImage} 
                      alt={review.name}
                      className="customer-image"
                    />
                    <div className="quote-icon">66</div>
                  </div>
                  <h3 className="product-name">{review.product}</h3>
                  <p className="product-description">{review.review}</p>
                  <p className="customer-name-bottom">{review.name}</p>
                  <p className="customer-title">{review.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pagination-dots">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
