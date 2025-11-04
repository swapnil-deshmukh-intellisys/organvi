import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css';

// Import GIF images from assets
import dalGif from '../../assets/Dal.gif';
import almondsGif from '../../assets/almonds-17904960-unscreen.gif';
import bambooGif from '../../assets/bamboo-16390380-unscreen.gif';
import grindGif from '../../assets/grind-14324580-unscreen.gif';

const Categories = () => {
  const navigate = useNavigate();
  
  // Debug: Log the GIF imports
  console.log('GIF imports:', { dalGif, almondsGif, bambooGif, grindGif });

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 1) {
      // Navigate to Pulses page when "Pulses & Dal" is clicked
      navigate('/pulses');
    } else if (categoryId === 2) {
      // Navigate to Sweetener page when "Sweetener" is clicked
      navigate('/sweetener');
    } else if (categoryId === 3) {
      // Navigate to DryFruits page when "Dry Fruits & Nuts" is clicked
      navigate('/dryfruits');
    } else if (categoryId === 4) {
      // Navigate to Spices page when "Spices & Masalas" is clicked
      navigate('/spices');
    } else {
      // For other categories, you can add navigation to specific category pages
      console.log(`Navigate to category: ${categoryId}`);
    }
  };

  const categories = [
    {
      id: 1,
      name: 'Pulses & Dal',
      icon: <img 
        src={dalGif} 
        alt="Pulses & Dal" 
        className="category-gif" 
      />
    },
    {
      id: 2,
      name: 'Sweetener',
      icon: <img 
        src={bambooGif} 
        alt="Sweetener" 
        className="category-gif" 
      />
    },
    {
      id: 3,
      name: 'Dry Fruits & Nuts',
      icon: <img 
        src={almondsGif} 
        alt="Dry Fruits & Nuts" 
        className="category-gif" 
      />
    },
    {
      id: 4,
      name: 'Spices & Masalas',
      icon: <img 
        src={grindGif} 
        alt="Spices & Masalas" 
        className="category-gif" 
      />
    },
  ];

  return (
    <div className="categories-container">
      <div className="categories-row">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="category-item"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-icon">
              {category.icon}
            </div>
            <div className="category-name">
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

