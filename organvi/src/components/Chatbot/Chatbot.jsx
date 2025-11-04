import React, { useState, useRef, useEffect } from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import messageIcon from '../../assets/message.png';
import sendIcon from '../../assets/send.png';
import './Chatbot.css';

// Brand icons imported from react-icons/fa

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Predefined Q&A about Organvi and its products
  const predefinedQA = {
    'what is organvi': 'Organvi is your trusted source for 100% organic and natural products. We specialize in organic pulses, dry fruits, spices, and sweeteners, all sourced directly from certified organic farms.',
    'what products do you sell': 'We sell a wide range of organic products including pulses (chana dal, masoor dal, moong dal, toor dal), dry fruits (almonds, cashews, pistachios), spices (turmeric, chili), and natural sweeteners (jaggery). All our products are 100% organic and certified.',
    'are your products organic': 'Yes! All our products are 100% organic and certified. We work directly with certified organic farms to ensure the highest quality and authenticity of our products.',
    'do you offer free delivery': 'Yes, we offer free delivery on all orders. We ensure your organic products reach you fresh and in perfect condition.',
    'what is your return policy': 'We offer a 30-day return policy for all products. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund.',
    'how do i place an order': 'You can easily place an order by browsing our products, adding them to your cart, and proceeding to checkout. We accept various payment methods for your convenience.',
    'what are your delivery areas': 'We currently deliver to major cities across India. You can check if we deliver to your area by entering your pincode during checkout.',
    'are your products fresh': 'Absolutely! We maintain strict quality control and ensure all our organic products are fresh. We have a direct supply chain from farm to your doorstep.',
    'do you have bulk discounts': 'Yes, we offer special discounts for bulk orders. Contact our customer support for more information about bulk pricing and special offers.',
    'how can i contact support': 'You can contact our support team through the contact page on our website, or reach out to us via WhatsApp, email, or phone. We\'re here to help with any questions or concerns.'
  };

  // Direct answers for the default clickable questions
  const quickAnswers = {
    'create or manage account': 'To create or manage your account, go to My Account from the top menu. From there you can sign up, update your details, and view your orders.',
    'shipment status': 'Shipments are usually dispatched within 24-48 hours. You will receive an SMS/Email with tracking details once shipped.',
    'payment options': 'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (where available).',
    'track my order': 'To track your order, open My Orders in your account. After dispatch, tracking link and AWB number will be shown there.',
    'return and refund': 'You can request a return within 30 days of delivery if items are unopened and in original condition. Refunds are processed to the original payment method.',
    'delivery areas and timing': 'We currently deliver to major Indian cities. Standard delivery takes 2-5 business days depending on your pincode.'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase());
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Quick question handler - sends predefined Q and immediate answer (no typing needed)
  const handleQuickQuestion = (question) => {
    const q = question.trim();
    if (!q) return;
    const userMessage = {
      id: messages.length + 1,
      text: q,
      sender: 'user',
      timestamp: new Date()
    };
    const lower = q.toLowerCase();
    const directAnswer = quickAnswers[lower];
    const answerText = directAnswer ? directAnswer : getBotResponse(lower);
    const botMessage = {
      id: messages.length + 2,
      text: `${answerText}\n\nFor assistance, call +91 9284361797.`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage, botMessage]);
  };

  const getBotResponse = (userInput) => {
    // Get all predefined answers
    const answers = Object.values(predefinedQA);
    
    // Check for exact matches first
    for (const [question, answer] of Object.entries(predefinedQA)) {
      if (userInput.includes(question)) {
        return answer;
      }
    }

    // Check for keyword matches and return specific predefined answers
    if (userInput.includes('organic') || userInput.includes('natural')) {
      return predefinedQA['are your products organic'];
    }
    
    if (userInput.includes('price') || userInput.includes('cost') || userInput.includes('expensive')) {
      return 'Our prices are competitive and reflect the premium quality of our organic products. You can view current prices on our product pages.';
    }
    
    if (userInput.includes('delivery') || userInput.includes('shipping') || userInput.includes('ship')) {
      return predefinedQA['do you offer free delivery'];
    }
    
    if (userInput.includes('return') || userInput.includes('refund') || userInput.includes('exchange')) {
      return predefinedQA['what is your return policy'];
    }
    
    if (userInput.includes('order') || userInput.includes('buy') || userInput.includes('purchase')) {
      return predefinedQA['how do i place an order'];
    }
    
    if (userInput.includes('fresh') || userInput.includes('quality') || userInput.includes('good')) {
      return predefinedQA['are your products fresh'];
    }
    
    if (userInput.includes('bulk') || userInput.includes('discount') || userInput.includes('cheap')) {
      return predefinedQA['do you have bulk discounts'];
    }
    
    if (userInput.includes('contact') || userInput.includes('support') || userInput.includes('help')) {
      return predefinedQA['how can i contact support'];
    }
    
    if (userInput.includes('area') || userInput.includes('location') || userInput.includes('city')) {
      return predefinedQA['what are your delivery areas'];
    }

    // For any other question, return a random predefined answer
    const randomIndex = Math.floor(Math.random() * answers.length);
    return answers[randomIndex];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number
    window.open('https://wa.me/919876543210?text=Hello%20Organvi,%20I%20have%20a%20question%20about%20your%20products.', '_blank');
  };

  const handleInstagramClick = () => {
    // Replace with your actual Instagram handle
    window.open('https://instagram.com/organvi', '_blank');
  };

  const suggestedQuestions = [
    'Create or manage account',
    'Shipment status',
    'Payment options',
    'Track my order',
    'Return and refund',
    'Delivery areas and timing'
  ];

  return (
    <div className="chatbot-container">
      {/* All Icons in One Vertical Line */}
      <div className="social-icons-container">
        <button 
          className="social-icon whatsapp-icon"
          onClick={handleWhatsAppClick}
          aria-label="Contact us on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <FaWhatsapp className="whatsapp-icon-svg" />
        </button>
        <button 
          className="social-icon instagram-icon"
          onClick={handleInstagramClick}
          aria-label="Follow us on Instagram"
          title="Follow on Instagram"
        >
          <FaInstagram className="instagram-icon-svg" />
        </button>
        {/* Floating Chat Button */}
        <button 
          className={`social-icon chatbot-toggle ${isOpen ? 'open' : ''}`}
          onClick={toggleChatbot}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <div className="message-icon-circle">
            {isOpen ? (
              <div className="close-icon-inside">
                <span className="close-line close-line-1"></span>
                <span className="close-line close-line-2"></span>
              </div>
            ) : (
              <div className="speech-bubble-white">
                <div className="typing-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-content">
            <div className="bot-avatar">
              <img src={messageIcon} alt="Bot" className="bot-avatar-image" />
            </div>
            <div className="chatbot-info">
              <h3>Chat with us</h3>
              <span className="status">Online</span>
            </div>
          </div>
        </div>

        {/* Greeting removed per request */}

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-avatar">
                {message.sender === 'bot' ? 
                  <img src={messageIcon} alt="Bot" className="message-avatar-image" /> : 
                  <img src={messageIcon} alt="User" className="message-avatar-image user-avatar" />
                }
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">
                <img src={messageIcon} alt="Bot" className="message-avatar-image" />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write message"
            className="message-input"
          />
          <button 
            onClick={handleSendMessage}
            className="send-button"
            disabled={!inputValue.trim()}
          >
            <img src={sendIcon} alt="Send" className="send-button-image" />
          </button>
        </div>

        {/* Instant answers removed per request */}
      </div>
    </div>
  );
};

export default Chatbot;