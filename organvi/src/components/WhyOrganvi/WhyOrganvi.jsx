import React, { useEffect, useRef, useState } from 'react';
import './WhyOrganvi.css';
import leafIcon from '../../assets/leaf_18984760.png';
import freeIcon from '../../assets/free.png';
import recyclingIcon from '../../assets/recycling_11405515.png';
import isoIcon from '../../assets/iso.png';

const WhyOrganvi = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    let observer;
    const currentRef = sectionRef.current;

    // Check immediately if section is in view
    if (currentRef) {
      const checkVisibility = () => {
        const rect = currentRef.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInView) {
          setIsVisible(true);
          return true;
        }
        return false;
      };

      // Check on mount with a small delay to ensure DOM is ready
      const checkTimer = setTimeout(() => {
        if (checkVisibility()) {
          return;
        }

        // Set up observer for scroll
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsVisible(true);
              }
            });
          },
          { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        observer.observe(currentRef);
      }, 50);

      // Fallback: show content after 1 second if still not visible
      const fallbackTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => {
        clearTimeout(checkTimer);
        clearTimeout(fallbackTimer);
        if (observer && currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }
  }, []);
  const features = [
    {
      id: 1,
      title: 'High Nutritional Value',
      description: 'Packed with natural vitamins and minerals to keep your body healthy and energized.',
      icon: leafIcon
    },
    {
      id: 2,
      title: 'Preserves the Environment',
      description: 'Sustainably sourced to protect soil, water, and air for a greener planet.',
      icon: recyclingIcon
    },
    {
      id: 3,
      title: 'Certified Organic Sources',
      description: 'Quality-tested and certified to ensure 100% authentic organic products.',
      icon: isoIcon
    },
    {
      id: 4,
      title: 'No Chemicals or Pesticides',
      description: 'Free from harmful additives — pure, safe, and naturally wholesome.',
      icon: freeIcon
    }
  ];

  return (
    <section className="why-organvi-section" ref={sectionRef}>
      <div className="why-organvi-container">
        <h2 className={`why-organvi-title ${isVisible ? 'animate-fade-in' : ''}`}>Why Organvi?</h2>
        <div className="why-organvi-grid">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`why-organvi-card ${isVisible ? 'animate-slide-up' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="why-organvi-icon-wrapper">
                <img src={feature.icon} alt={feature.title} className="why-organvi-icon" />
              </div>
              <h3 className="why-organvi-card-title">{feature.title}</h3>
              <p className="why-organvi-card-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyOrganvi;

