import React from 'react';
import './PromotionalBanners.css';
import palmJaggeryBanner from '../../assets/Pure_jaggary.png';
import dryFruitsBanner from '../../assets/Natural_Energy_Dry_Fruits.png';

const PromotionalBanners = () => {
  return (
    <div className="promotional-banners-section">
      <div className="promotional-banners-container">
        <div className="promotional-banner">
          <img 
            src={dryFruitsBanner} 
            alt="Natural Energy Dry Fruits" 
            className="banner-image"
          />
        </div>
        <div className="promotional-banner">
          <img 
            src={palmJaggeryBanner} 
            alt="Pure Jaggery" 
            className="banner-image"
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanners;

