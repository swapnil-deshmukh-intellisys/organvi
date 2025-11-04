import React, { useState, useEffect } from 'react';
import './Hero.css';
import hero8Image from '../../assets/hero8.png';
import hero9Image from '../../assets/hero9.png';
import hero10Image from '../../assets/hero10.png';
import hero11Image from '../../assets/hero11.png';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const images = [hero8Image, hero9Image, hero10Image, hero11Image];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // After slide out animation completes, change image
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 400); // Half of transition duration
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);


  return (
    <section className="hero">
      <div className="hero-image-container">
        {images.map((image, index) => {
          const isActive = index === currentImage;
          const isPrevious = index === (currentImage - 1 + images.length) % images.length;
          const shouldSlideOut = isPrevious && isTransitioning;
          
          return (
            <img
              key={index}
              src={image}
              alt={index === 0 ? "Hero Product 8" : index === 1 ? "Hero Product 9" : index === 2 ? "Hero Product 10" : "Hero Product 11"}
              className={`hero-image ${isActive ? 'active' : ''} ${shouldSlideOut ? 'slide-out' : ''}`}
            />
          );
        })}
      </div>
      
    </section>
  );
};

export default Hero;