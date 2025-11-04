import React from 'react';
import { Link } from 'react-router-dom';
import './Shipping.css';

const Shipping = () => {
  return (
    <div className="shipping-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">-</span>
          <span className="breadcrumb-current">Shipping Policy</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="shipping-content">
        <div className="container">
          <h1 className="shipping-title">Shipping Policy</h1>
          
          <h2 className="section-title">Domestic Shipping Policy</h2>

          <h3 className="subsection-title">Shipment Processing Time:</h3>
          <ul className="policy-list">
            <li>All orders are processed within 2–3 business days.</li>
            <li>Orders are not shipped on weekends or holidays.</li>
            <li>If there is a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.</li>
            <li>If there will be a significant delay in the shipment of your order, we will contact you via email or telephone.</li>
          </ul>

          <h3 className="subsection-title">Shipping Rates & Delivery Estimates:</h3>
          <ul className="policy-list">
            <li>Shipping charges for your order will be calculated and displayed at checkout.</li>
            <li>We use trusted courier partners and aggregators such as FedEx, Shree Maruti, Bluedart, etc.</li>
            <li>Delivery delays can occasionally occur due to weather, location, or logistics issues.</li>
          </ul>

          <div className="contact-section">
            <h3 className="subsection-title">Need Help?</h3>
            <p>If you have any questions about our shipping policy, please don't hesitate to contact us:</p>
            <div className="contact-info">
              <p><strong>Website:</strong> <a href="https://www.organvi.com" className="contact-link" target="_blank" rel="noopener noreferrer">www.organvi.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
