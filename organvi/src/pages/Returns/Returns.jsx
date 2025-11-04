import React from 'react';
import { Link } from 'react-router-dom';
import './Returns.css';

const Returns = () => {
  return (
    <div className="returns-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">-</span>
          <span className="breadcrumb-current">Return and Replacement</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="returns-content">
        <div className="container">
          <h1 className="returns-title">Return and Replacement Policy</h1>
          
          <p className="policy-intro">
            Our policy lasts 15 days after purchase.<br />
            If 15 days have passed since your purchase, unfortunately, we cannot offer you a refund or exchange.
          </p>

          <h2 className="section-title">To be eligible for a return:</h2>
          <ul className="policy-list">
            <li>Your item must be unused and in the same condition that you received it.</li>
            <li>It must be in the original packaging.</li>
            <li>You must provide a receipt or proof of purchase.</li>
            <li>Please do not send your purchase back to the manufacturer without prior confirmation.</li>
          </ul>

          <h2 className="section-title">Refunds (If Applicable):</h2>
          <p>Once your return is received and inspected, we will send you an email notification confirming receipt of your returned item.</p>
          <p>You will also be informed about the approval or rejection of your refund.</p>
          <p>If approved, your refund will be processed, and the amount will be credited automatically to your original payment method (credit card, debit card, or bank account) within a few business days.</p>

          <h2 className="section-title">Late or Missing Refunds (If Applicable):</h2>
          <p>If you haven't received your refund yet:</p>
          <ul className="policy-list">
            <li>Recheck your bank account.</li>
            <li>Contact your credit card company, as it may take some time before your refund is officially posted.</li>
            <li>Contact your bank, as processing time may vary.</li>
            <li>If you have done all of the above and still haven't received your refund, please contact us at <a href="https://www.organvi.com" className="contact-link" target="_blank" rel="noopener noreferrer">www.organvi.com</a>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Returns;
