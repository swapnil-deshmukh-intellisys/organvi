import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "What is Organvi?",
      answer: "Organvi is a fast-growing company involved in organic farming, producing, processing, and packing organic products while maintaining their natural integrity."
    },
    {
      question: "When was Organvi started and when was it registered?",
      answer: "Organvi started in 2019 and was officially registered in 2021 under the Company Act 1949 as Organvi Agro Industries Pvt. Ltd."
    },
    {
      question: "How are Organvi foods processed?",
      answer: "Organvi foods are minimally processed without artificial ingredients or synthetic preservatives to maintain the natural quality of the products."
    },
    {
      question: "What is the \"Partnership with Farmer\" model followed by Organvi?",
      answer: "It is a model where Organvi collaborates directly with farmers to ensure safe, pure, and natural production while also supporting the village economy with better opportunities."
    },
    {
      question: "What is the motto or philosophy of Organvi?",
      answer: "Organvi's philosophy is \"YOU JUST EAT RIGHT,\" emphasizing healthy, safe, and natural food for consumers."
    },
    {
      question: "Why should sustainable farming be supported?",
      answer: "Sustainable farming reduces pollution, conserves nonrenewable resources, improves soil health, and ensures that agricultural production remains safe and sufficient for the growing population."
    },
    {
      question: "What are some benefits of organic farming over conventional farming?",
      answer: "Organic farming improves soil fertility, prevents soil erosion, ensures better water quality, generates rural employment, and reduces health hazards caused by chemical residues."
    },
    {
      question: "What are the main stages of production followed by Organvi?",
      answer: "The seven main stages are: ploughing, sowing, adding nutrients, irrigation, protecting plants, harvesting, and storage."
    },
    {
      question: "How should Organvi products be stored and used?",
      answer: "They should be stored in a cool, dry place, a dry spoon should be used when taking the product, and jars should be kept airtight to maintain quality."
    },
    {
      question: "How does Organvi ensure quality and natural integrity of its products?",
      answer: "By adopting minimal processing, avoiding artificial ingredients or preservatives, and working closely with farmers to maintain traditional and organic practices from farm to final product."
    }
  ];

  return (
    <div className="faq-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">-</span>
          <span className="breadcrumb-current">FAQ</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="faq-content">
        <div className="container">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">Find answers to common questions about Organvi and our organic products</p>
          
          <div className="faq-list">
            {faqData.map((item, index) => (
              <div 
                key={index} 
                className={`faq-item ${openItems[index] ? 'active' : ''}`}
                onClick={() => toggleItem(index)}
              >
                <div className="faq-question">
                  <h3>{item.question}</h3>
                  <div className="faq-icon">
                    {openItems[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                <div className={`faq-answer ${openItems[index] ? 'open' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default FAQ;
