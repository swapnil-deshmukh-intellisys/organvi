import React, { useState } from 'react';
import './Categories.css';

// Import GIF images from assets
import dalGif from '../../assets/Dal.gif';
import almondsGif from '../../assets/almonds-17904960-unscreen.gif';
import sugarGif from '../../assets/sugar-cubes-18107560-unscreen.gif';
import grindGif from '../../assets/grind-14324580-unscreen.gif';

// GIF icons for all categories with orange color styling
const AllCategoriesIcon = () => (
  <img 
    src={dalGif} 
    alt="All Categories" 
    className="category-gif" 
    style={{
      background: 'transparent',
      filter: 'hue-rotate(25deg) saturate(2.5) brightness(1.3) contrast(1.6)',
      border: 'none',
      outline: 'none'
    }}
  />
);

const PulsesIcon = () => (
  <img 
    src={dalGif} 
    alt="Pulses & Grains" 
    className="category-gif" 
    style={{
      background: 'transparent',
      filter: 'hue-rotate(25deg) saturate(2.5) brightness(1.3) contrast(1.6)',
      border: 'none',
      outline: 'none'
    }}
  />
);

const DryFruitsIcon = () => (
  <img 
    src={almondsGif} 
    alt="Dry Fruits & Nuts" 
    className="category-gif" 
    style={{
      background: 'transparent',
      filter: 'hue-rotate(25deg) saturate(2.5) brightness(1.3) contrast(1.6)',
      border: 'none',
      outline: 'none'
    }}
  />
);

const SweetenersIcon = () => (
  <img 
    src={sugarGif} 
    alt="Sweeteners" 
    className="category-gif" 
    style={{
      background: 'transparent',
      filter: 'hue-rotate(25deg) saturate(2.5) brightness(1.3) contrast(1.6)',
      border: 'none',
      outline: 'none'
    }}
  />
);

const SpicesIcon = () => (
  <img 
    src={grindGif} 
    alt="Spices & Powders" 
    className="category-gif" 
    style={{
      background: 'transparent',
      filter: 'hue-rotate(25deg) saturate(2.5) brightness(1.3) contrast(1.6)',
      border: 'none',
      outline: 'none'
    }}
  />
);

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProducts, setShowProducts] = useState(false);

  const categories = [
    {
      id: 'all',
      name: 'All Categories',
      icon: AllCategoriesIcon,
      products: [
        'Organic Turmeric', 'Organic Jaggery', 'Organic Chana Dal', 'Organic Moong Dal',
        'Organic Toor Dal', 'Organic Urad Dal', 'Organic Almonds', 'Organic Cashews',
        'Organic Pistachios', 'Organic Raisins', 'Organic Roasted Chana', 'Organic Chilly Powder'
      ]
    },
    {
      id: 'pulses',
      name: 'Pulses & Grains',
      icon: PulsesIcon,
      products: [
        'Organic Chana Dal', 'Organic Moong Dal', 'Organic Toor Dal', 'Organic Urad Dal',
        'Organic Basmati Rice', 'Organic Brown Rice', 'Organic Quinoa', 'Organic Barley'
      ]
    },
    {
      id: 'dryfruits',
      name: 'Dry Fruits & Nuts',
      icon: DryFruitsIcon,
      products: [
        'Organic Almonds', 'Organic Cashews', 'Organic Pistachios', 'Organic Raisins',
        'Organic Walnuts', 'Organic Dates', 'Organic Figs', 'Organic Apricots'
      ]
    },
    {
      id: 'sweeteners',
      name: 'Sweeteners',
      icon: SweetenersIcon,
      products: [
        'Organic Jaggery', 'Organic Honey', 'Organic Maple Syrup', 'Organic Coconut Sugar',
        'Organic Stevia', 'Organic Date Syrup', 'Organic Agave Nectar'
      ]
    },
    {
      id: 'spices',
      name: 'Spices & Powders',
      icon: SpicesIcon,
      products: [
        'Organic Turmeric', 'Organic Chilly Powder', 'Organic Coriander Powder', 'Organic Cumin Powder',
        'Organic Garam Masala', 'Organic Red Chili Flakes', 'Organic Black Pepper', 'Organic Cardamom'
      ]
    }
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowProducts(true);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="categories-page">
      <div className="categories-container">
        <div className="categories-header">
          <h1 className="categories-title">All Categories</h1>
          <p className="categories-subtitle">Browse our complete range of organic products</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className={`category-box ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-icon">
                  <IconComponent className="icon-component" />
                </div>
                <div className="category-content">
                  <h3 className="category-name">{category.name}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {showProducts && selectedCategoryData && (
          <div className="products-section">
            <div className="products-header">
              <h3 className="products-title">{selectedCategoryData.name}</h3>
              <button 
                className="close-products"
                onClick={() => setShowProducts(false)}
              >
                ✕
              </button>
            </div>
            <div className="products-grid">
              {selectedCategoryData.products.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-icon">
                    <span className="product-emoji">
                      {selectedCategory === 'all' ? '🌱' : 
                       selectedCategory === 'pulses' ? '🌾' :
                       selectedCategory === 'dryfruits' ? '🥜' :
                       selectedCategory === 'sweeteners' ? '🍯' : '🌶️'}
                    </span>
                  </div>
                  <span className="product-name">{product}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;