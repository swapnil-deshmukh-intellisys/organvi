import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Send, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import addressIcon from '../../assets/address.gif';
import phoneIcon from '../../assets/phoneno.gif';
import emailIcon from '../../assets/email.gif';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productInfo: ''
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('✅ Message sent successfully! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      productInfo: ''
    });
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-main-container">
        {/* Left Column - Contact Form */}
        <div className="contact-form-column">
          <h2 className="contact-form-title">Contact Us</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
            <textarea
              name="productInfo"
              placeholder="Message"
              value={formData.productInfo}
              onChange={handleChange}
              required
              className="form-textarea"
              rows="4"
            ></textarea>
            <div className="button-group">
              <button type="submit" className="send-btn">
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Contact Information */}
        <div className="contact-info-column">
          <h3 className="contact-info-title">Contact Information</h3>
          
          <div className="contact-info-item">
            <img src={addressIcon} alt="Address" className="contact-icon" />
            <div className="contact-info-text">
              <p>Sr No 61, 1/ B, Nalegaon Road, near Govt Rest House, Malkapur, Udgir, Maharashtra 413517</p>
            </div>
          </div>

          <div className="contact-info-item">
            <img src={phoneIcon} alt="Phone" className="contact-icon" />
            <div className="contact-info-text">
              <p>+91 9175580173 / 9284361797</p>
            </div>
          </div>

          <div className="contact-info-item">
            <img src={emailIcon} alt="Email" className="contact-icon" />
            <div className="contact-info-text">
              <p>organviagro@gmail.com</p>
            </div>
          </div>

          <div className="social-media-section">
            <div className="social-icons">
              <a href="#" className="social-icon twitter-icon" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-icon facebook-icon" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/organvi2021/?igsh=MW00cWsxZTE5ajV6aw%3D%3D" target="_blank" rel="noopener noreferrer" className="social-icon instagram-icon" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-icon linkedin-icon" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
