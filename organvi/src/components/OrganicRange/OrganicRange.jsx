import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrganicRange.css';

// Import product images from assets
import pulsesImage from '../../assets/chanadal.png';
import sweetenerImage from '../../assets/jeggary.png';
import dryfruitsImage from '../../assets/almond.png';
import masalaImage from '../../assets/chilly2.png';
import turmericImage from '../../assets/termeric5.png';
import palmJaggeryBanner from '../../assets/Pure_jaggary.png';
import dryFruitsBanner from '../../assets/Natural_Energy_Dry_Fruits.png';

const OrganicRange = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: 'Pulses',
      image: pulsesImage,
      route: '/pulses'
    },
    {
      id: 2,
      name: 'Sweet',
      image: sweetenerImage,
      route: '/sweetener'
    },
    {
      id: 3,
      name: 'Dry Fruits',
      image: dryfruitsImage,
      route: '/dryfruits'
    },
    {
      id: 4,
      name: 'Masala',
      image: masalaImage,
      route: '/spices'
    },
    {
      id: 5,
      name: 'Turmeric',
      image: turmericImage,
      route: '/spices'
    }
  ];

  const handleCategoryClick = (route) => {
    navigate(route);
  };

  return (
    <section className="organic-range-section">
      <div className="organic-range-container">
        <h2 className="organic-range-title">OUR ORGANIC RANGE</h2>
        
        <div className="organic-range-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="organic-range-item"
              onClick={() => handleCategoryClick(category.route)}
            >
              <div className="organic-range-circle">
                <img
                  src={category.image}
                  alt={category.name}
                  className="organic-range-image"
                />
              </div>
              <span className="organic-range-label">{category.name}</span>
            </div>
          ))}
        </div>

        {/* Promotional Banners */}
        <div className="promotional-banners">
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
    </section>
  );
};

export default OrganicRange;

