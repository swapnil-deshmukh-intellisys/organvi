import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, Shield, Truck, Heart, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import './About.css';

const About = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all sections
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const productionSteps = [
    {
      step: 1,
      title: "Ploughing",
      description: "Preparing the soil for sowing",
      gif: "/src/assets/ploughing.gif"
    },
    {
      step: 2,
      title: "Sowing",
      description: "Planting seeds in nutrient-rich soil",
      gif: "/src/assets/sowing.gif"
    },
    {
      step: 3,
      title: "Adding Nutrients",
      description: "Fertilizing naturally to enrich soil",
      gif: "/src/assets/nutrient.gif"
    },
    {
      step: 4,
      title: "Irrigation",
      description: "Watering plants efficiently",
      gif: "/src/assets/irrigation.gif"
    },
    {
      step: 5,
      title: "Protecting Plants",
      description: "Using natural methods to protect crops",
      gif: "/src/assets/protecting.gif"
    },
    {
      step: 6,
      title: "Harvesting",
      description: "Collecting crops at peak freshness",
      gif: "/src/assets/harvesting.gif"
    },
    {
      step: 7,
      title: "Storage",
      description: "Proper storage to maintain quality before packaging",
      gif: "/src/assets/storage.gif"
    }
  ];

  const benefits = [
    "Conserves the environment & prevents pollution",
    "Keeps the land healthy and replenished",
    "Reduces human and animal health hazards",
    "Improves soil fertility and water quality",
    "Supports rural employment",
    "Reduces production cost and maintains sustainable production"
  ];

  return (
    <div className="about-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">-</span>
          <span className="breadcrumb-current">About Us</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section" ref={(el) => (sectionRefs.current[0] = el)}>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Organvi – Eat Right, Live Right</h1>
            <p className="hero-description">
              Organvi is the fastest-growing company engaged in Farming, Producing, Processing, and Packing of Organic products. 
              At Organvi, foods are minimally processed without artificial ingredients or synthetic preservatives to maintain 
              the integrity of the organic products that begin on our farms.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section" ref={(el) => (sectionRefs.current[1] = el)}>
        <div className="container">
          <h2 className="section-title">Our Philosophy</h2>
          <p className="philosophy-description">
            We believe in partnership with farmers to promote village economy and ensuring "YOU JUST EAT RIGHT" – 
            safe, pure, and natural products through genuine products, chemical-free process, and clean & hygienic packing.
          </p>
          <div className="philosophy-cards">
            <div className="philosophy-card">
              <div className="card-icon">
                <Shield size={40} />
              </div>
              <h3>Genuine Products</h3>
              <p>Authentic organic products directly from our farms</p>
            </div>
            <div className="philosophy-card">
              <div className="card-icon">
                <Leaf size={40} />
              </div>
              <h3>Chemical-Free Process</h3>
              <p>No synthetic preservatives or artificial ingredients</p>
            </div>
            <div className="philosophy-card">
              <div className="card-icon">
                <Truck size={40} />
              </div>
              <h3>Clean & Hygienic Packing</h3>
              <p>Maintaining quality from farm to your table</p>
            </div>
          </div>
        </div>
      </section>


      {/* About Organvi Section */}
      <section className="about-organvi-section" ref={(el) => (sectionRefs.current[2] = el)}>
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About Organvi</h2>
              <p className="about-description">
                Started in 2019 and officially registered in 2021 as Organvi Agro Industries Pvt. Ltd., 
                we are engaged in farming, producing, processing, and packing of organic products. 
                Our focus is on minimally processed foods with no synthetic preservatives, ensuring 
                the natural integrity of our organic products.
              </p>
              <div className="company-highlights">
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>Started in 2019</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>Registered in 2021</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>100% Organic Products</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>Minimally Processed Foods</span>
                </div>
              </div>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">2019</div>
                <div className="timeline-content">
                  <h4>Company Founded</h4>
                  <p>Started our journey in organic farming</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2021</div>
                <div className="timeline-content">
                  <h4>Official Registration</h4>
                  <p>Registered as Organvi Agro Industries Pvt. Ltd.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2025</div>
                <div className="timeline-content">
                  <h4>Growing Strong</h4>
                  <p>Continuing to expand our organic product range</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Farming Section */}
      <section className="sustainable-farming-section" ref={(el) => (sectionRefs.current[3] = el)}>
        <div className="container">
          <h2 className="section-title">What is Sustainable Farming?</h2>
          <p className="sustainable-description">
            Sustainable farming practices that sustain farmers, resources, and communities. 
            It's environmentally sound, profitable, and good for communities, integrating 
            modern technologies with best practices of the past.
          </p>
          <div className="sustainable-benefits">
            <h3>Why Choose Sustainable Farming?</h3>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <CheckCircle size={20} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Production Process Section */}
      <section className="production-process-section" ref={(el) => (sectionRefs.current[4] = el)}>
        <div className="container">
          <h2 className="section-title">From Farm to Table – Our Production Process</h2>
          <p className="process-description">
            Our 7-step agricultural process ensures the highest quality organic products 
            from seed to your table.
          </p>
          <div className="production-steps">
            {productionSteps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-number">{step.step}</div>
                <div className="step-gif">
                  <img src={step.gif} alt={step.title} />
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section" ref={(el) => (sectionRefs.current[5] = el)}>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Organic Excellence?</h2>
            <p>Join us in our mission to provide pure, natural, and chemical-free organic products.</p>
            <div className="cta-buttons">
              <Link to="/products" className="cta-btn primary">Explore Products</Link>
              <Link to="/contact" className="cta-btn secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
