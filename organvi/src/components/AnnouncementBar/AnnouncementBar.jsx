import React from 'react';
import './AnnouncementBar.css';
import { Sparkles, Gift, Truck, Leaf } from 'lucide-react';

const AnnouncementBar = () => {
  const announcements = [
    { text: "🌿 Taste Nature's Purity! Get 15% OFF on Organic Spices, Pulses, and Dry Fruits — Use Code PURE15 ✨", icon: <Sparkles size={14} /> },
    { text: "🫚 Spice Up Your Health! Buy any 2 Organic Spices & Get 1 FREE — Limited Time Offer 🌶️", icon: <Gift size={14} /> },
    { text: "🍯 Go Sweet, Stay Healthy! Save 10% on Organic Jaggery — Use Code SWEET10 🍃", icon: <Leaf size={14} /> },
    { text: "🌻 Join Our Green Family! Get Free Shipping + Exclusive Discounts on all Organic Combos 🌱", icon: <Truck size={14} /> },
    { text: "🥭 Healthy Snacking Starts Here! Get Flat 20% OFF on Organic Dry Fruits — Fresh, Nutritious, and Natural 🍇", icon: <Gift size={14} /> },
  ];

  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        {announcements.map((announcement, index) => (
          <div key={index} className="announcement-item">
            {announcement.icon && <span className="announcement-icon">{announcement.icon}</span>}
            <span className="announcement-text">{announcement.text}</span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {announcements.map((announcement, index) => (
          <div key={`duplicate-${index}`} className="announcement-item">
            {announcement.icon && <span className="announcement-icon">{announcement.icon}</span>}
            <span className="announcement-text">{announcement.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;

