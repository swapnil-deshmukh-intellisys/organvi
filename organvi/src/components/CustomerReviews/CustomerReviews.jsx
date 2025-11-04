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
      product: "Organic Whole Wheat Flour",
      review: "Atta is fresh, soft, and makes chapatis that stay fluffy and tasty for long. Truly good and healthy choice",
      productImage: wheatFlour
    },
    {
      id: 2,
      name: "Jagdish",
      product: "Organic Pistachios",
      review: "Best quality pistachios, very fresh and crunchy. The taste is amazing and they are perfectly roasted.",
      productImage: pista
    },
    {
      id: 3,
      name: "Priya Singh",
      product: "Organic Red Chillies",
      review: "Excellent quality chillies, very fresh and aromatic. The spice level is perfect and adds great flavor to dishes.",
      productImage: chill
    },
    {
      id: 4,
      name: "Rajesh Kumar",
      product: "Organic Turmeric Powder",
      review: "Great product! The turmeric is very fresh and has a beautiful golden color. My family loves the quality.",
      productImage: turmeric
    },
    {
      id: 5,
      name: "Sunita Patel",
      product: "Organic Jaggery",
      review: "Perfect quality jaggery. Very fresh and natural sweetness. The taste is amazing and pure.",
      productImage: jaggery
    },
    {
      id: 6,
      name: "Amit Verma",
      product: "Organic Almonds",
      review: "Outstanding quality! The almonds are very fresh and crunchy. Perfect for snacking and cooking. Highly recommended.",
      productImage: almonds
    }
  ];

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3); // 3 slides total (6 reviews / 2 per slide)
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const getCurrentReviews = () => {
    const startIndex = currentSlide * 2;
    return reviews.slice(startIndex, startIndex + 2);
  };

  return (
    <div className="customer-reviews">
      <div className="customer-reviews-container">
        <div className="reviews-header">
          <h2 className="reviews-title">From Our Customers</h2>
          <div className="reviews-pagination">
            <span className="pagination-text">{currentSlide + 1} — 3</span>
            <div className="navigation-arrows">
              <button className="nav-arrow" onClick={goToPrevious}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button className="nav-arrow" onClick={goToNext}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="reviews-content">
          <div className="reviews-slider">
            {getCurrentReviews().map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-content">
                  <div className="product-image-section">
                    <img src={review.productImage} alt={review.product} className="product-image" />
                  </div>
                  <div className="review-section">
                    <div className="customer-info">
                      <div className="customer-details">
                        <h4 className="customer-name">{review.name}</h4>
                      </div>
                    </div>
                    <div className="review-text">
                      <p className="product-name">{review.product}</p>
                      <p className="review-content-text">{review.review}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="floating-actions">
          <div className="floating-left">
            <button className="whatsapp-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52-.074-.792-.372-.272-.297-1.04-1.016-1.04-2.479 0-1.462 1.065-2.875 1.213-3.074.149-.198.208-.248.312-.248.104 0 .211.052.297.174.086.124.328.405.562.659.234.254.312.339.52.339.208 0 .52-.174.793-.52.272-.347.95-1.174.95-1.174.52-.347.52-.347.52-.347z"/>
              </svg>
            </button>
            <button className="gift-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 12v10H4V12"/>
                <path d="M2 7h20v5H2z"/>
                <path d="M12 22V7"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            </button>
          </div>
          
          <div className="floating-right">
            <button className="delivery-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </button>
            <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
