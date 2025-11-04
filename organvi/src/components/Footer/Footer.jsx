import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import organviLogo from '../../assets/organvilogo1.png';
import visaLogo from '../../assets/visa.png';
import mastercardLogo from '../../assets/mastercard.png';
import rupayLogo from '../../assets/rupay.png';
import upiLogo from '../../assets/upi (1).png';
import emailIcon from '../../assets/email.gif';
import phoneIcon from '../../assets/phoneno.gif';
import addressIcon from '../../assets/address.gif';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
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
            const response = await fetch('http://localhost:5000/api/subscribers/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to subscribe');
            }

            alert(data.message || 'Thank you for subscribing to our newsletter!');
            setEmail('');
        } catch (err) {
            console.error('Subscription error:', err);
            alert(err.message || 'Failed to subscribe. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Logo and Newsletter Section */}
                    <div className="footer-left">
                        <div className="logo-section">
                            <img src={organviLogo} alt="Organvi Logo" className="footer-logo" />
                        </div>

                        <div className="newsletter-section">
                            <h3>Subscribe Newsletter</h3>
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
                        </div>

                        <div className="payment-methods">
                            <img src={visaLogo} alt="VISA" className="payment-logo" />
                            <img src={rupayLogo} alt="RuPay" className="payment-logo" />
                            <img src={mastercardLogo} alt="Mastercard" className="payment-logo" />
                            <img src={upiLogo} alt="UPI" className="payment-logo" />
                        </div>
                    </div>

                    {/* Other Sections */}
                    <div className="footer-right">
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
                                    <img src={addressIcon} alt="Address" className="contact-icon" />
                                    <span className="contact-value">H. No. 4-1-170, MARKET YARD, SHOP NO 3, DAM ROAD, UDGIR DIST LATUR MH 413517 IN</span>
                                </div>
                                <div className="contact-item">
                                    <img src={emailIcon} alt="Email" className="contact-icon" />
                                    <span className="contact-value">organviagro@gmail.com</span>
                                </div>
                                <div className="contact-item">
                                    <img src={phoneIcon} alt="Phone" className="contact-icon" />
                                    <span className="contact-value">+91 9175580173/9284361797</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="footer-bottom">
                    <p>Organvi&copy; 2025. Designed by <a href="https://www.intellisysitsolutions.com/" target="_blank" rel="noopener noreferrer" className="intellisys-link">Team Intellisys</a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;