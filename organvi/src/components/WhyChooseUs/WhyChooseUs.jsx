import React from 'react';
import './WhyChooseUs.css';
import leafIcon from '../../assets/leaf_18984760.png';
import freeIcon from '../../assets/free.png';
import recyclingIcon from '../../assets/recycling_11405515.png';
import isoIcon from '../../assets/iso.png';

const WhyChooseUs = () => {
  return (
    <div className="why-choose-us">
      <div className="why-choose-us-container">
        <div className="why-choose-us-header">
          <h2 className="why-choose-us-title">Why Choose Us</h2>
        </div>
        
        <div className="why-choose-us-content">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <img src={leafIcon} alt="Sustainable Farming" width="48" height="48" />
              </div>
              <h3 className="feature-title">Sustainable Farming Techniques</h3>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <img src={freeIcon} alt="Chemical Free" width="48" height="48" />
              </div>
              <h3 className="feature-title">Chemical Pesticide-free</h3>
            </div>


            <div className="feature-item">
              <div className="feature-icon">
                <img src={recyclingIcon} alt="Locally Sourced" width="48" height="48" />
              </div>
              <h3 className="feature-title">Locally Ethically Sourced</h3>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <img src={isoIcon} alt="Global Testing" width="48" height="48" />
              </div>
              <h3 className="feature-title">250 Global Testing Standards</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;