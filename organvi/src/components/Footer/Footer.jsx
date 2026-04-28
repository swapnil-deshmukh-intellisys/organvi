import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import organviLogo from '../../assets/organvilogo1.png';
import visaLogo from '../../assets/visa.png';
import mastercardLogo from '../../assets/mastercard.png';
import rupayLogo from '../../assets/rupay.png';
import upiLogo from '../../assets/upi (1).png';
import footerImage from '../../assets/footer_image.png';
import API_ENDPOINTS from '../../config/api';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email || !email.trim()) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch(API_ENDPOINTS.SUBSCRIBERS.SUBSCRIBE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to subscribe');
            }

            setSuccessMessage(data.message || 'Thank you for subscribing to our newsletter!');
            setEmail('');
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        } catch (err) {
            console.error('Subscription error:', err);
            setSuccessMessage(err.message || 'Failed to subscribe. Please try again.');
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <footer className="footer">
            {/* Footer Image with Content Overlay */}
            <div className="footer-image-container">
                <img src={footerImage} alt="Footer Background" className="footer-bg-image" />
                
                {/* Content Overlay on Image */}
                <div className="footer-content-overlay">
                    <div className="container">
                        <div className="footer-content">
                            {/* All Sections in Same Row */}
                            <div className="footer-right">
                                <div className="footer-section newsletter-section-inline">
                                    <h4>Subscribe Newsletter</h4>
                                    <div className="newsletter-form-wrapper">
                                        <form onSubmit={handleSubscribe} className="newsletter-form">
                                            <input
                                                type="email"
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={handleEmailChange}
                                                className="newsletter-input"
                                                required
                                            />
                                            <button type="submit" className="subscribe-btn" disabled={submitting}>
                                                {submitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                                            </button>
                                        </form>
                                        {successMessage && (
                                            <div className={`newsletter-message ${successMessage.includes('Thank you') ? 'success' : 'error'}`}>
                                                {successMessage}
                                            </div>
                                        )}
                                    </div>
                                    <div className="payment-methods">
                                        <img src={visaLogo} alt="VISA" className="payment-logo" />
                                        <img src={rupayLogo} alt="RuPay" className="payment-logo" />
                                        <img src={mastercardLogo} alt="Mastercard" className="payment-logo" />
                                        <img src={upiLogo} alt="UPI" className="payment-logo" />
                                    </div>
                                </div>

                                <div className="footer-section">
                                    <h4>Quick Links</h4>
                                    <ul>
                                        <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link></li>
                                        <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link></li>
                                        <li><Link to="/faq" className={location.pathname === '/faq' ? 'active' : ''}>FAQ</Link></li>
                                    </ul>
                                </div>

                                <div className="footer-section">
                                    <h4>Policies</h4>
                                    <ul>
                                        <li><Link to="/privacy" className={location.pathname === '/privacy' ? 'active' : ''}>Privacy Policy</Link></li>
                                        <li><Link to="/terms" className={location.pathname === '/terms' ? 'active' : ''}>Terms & Conditions</Link></li>
                                        <li><Link to="/returns" className={location.pathname === '/returns' ? 'active' : ''}>Returns & Refunds</Link></li>
                                        <li><Link to="/shipping" className={location.pathname === '/shipping' ? 'active' : ''}>Shipping Policy</Link></li>
                                    </ul>
                                </div>

                                <div className="footer-section">
                                    <h4>Contact</h4>
                                    <div className="contact-info">
                                        <div className="contact-item">
                                            <MapPin className="contact-icon" />
                                            <span className="contact-value">H. No. 4-1-170, MARKET YARD, SHOP NO 3, DAM ROAD, UDGIR DIST LATUR MH 413517 IN</span>
                                        </div>
                                        <div className="contact-item">
                                            <Mail className="contact-icon" />
                                            <span className="contact-value">organviagro@gmail.com</span>
                                        </div>
                                        <div className="contact-item">
                                            <Phone className="contact-icon" />
                                            <span className="contact-value">+91 9175580173/9284361797</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Below Footer Image */}
            <div className="footer-bottom-wrapper">
                <div className="container">
                    <div className="footer-bottom">
                        <p>Organvi&copy; 2025. Designed by <a href="https://www.intellisysitsolutions.com/" target="_blank" rel="noopener noreferrer" className="intellisys-link">Team Intellisys</a></p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;