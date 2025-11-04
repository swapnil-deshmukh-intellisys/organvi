import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart,
} from 'lucide-react';
import './ProductScroller.css';

import roastedChana   from '../../assets/roastchana1.png';
import Raisins        from '../../assets/rainse1.png';
import UradDal        from '../../assets/uraldal.png';
import Pista          from '../../assets/pista1.png';
import CashewNuts     from '../../assets/cashewnut.png';
import Almonds        from '../../assets/almond.png';
import Jaggery        from '../../assets/jeggary.png';
import TurmericPowder from '../../assets/termeric.png';
import ToorDal        from '../../assets/toordal.png';
import MirchiPowder   from '../../assets/chilly2.png';
import MoongDal       from '../../assets/moongdal.png';
import ChanaDal       from '../../assets/chanadal.png';

const ProductScroller = ({ searchTerm = '' }) => {
  const getItemsPerView = () => (window.innerWidth <= 480 ? 1 : 3);
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const onResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantities, setQuantities]     = useState({});
  const [popupMessage, setPopupMessage] = useState('');

  const products = [
    { id: 1, name: 'Roasted Chana',     description: 'Premium quality roasted chickpeas, perfect for snacking', price: 160, image: roastedChana,   category: 'pulse' },
    { id: 2, name: 'Raisins',           description: 'Sweet and chewy organic raisins from premium grapes',     price: 200, image: Raisins,        category: 'Nuts' },
    { id: 3, name: 'Urad Dal',          description: 'High‑protein black gram dal, perfect for traditional dishes', price: 180, image: UradDal,   category: 'pulse' },
    { id: 4, name: 'Organic Pistachios',description: 'Premium quality pistachios, rich in nutrients',            price: 450, image: Pista,         category: 'Nuts' },
    { id: 5, name: 'Cashew Nuts',       description: 'Creamy and delicious organic cashews',                     price: 420, image: CashewNuts,    category: 'Nuts' },
    { id: 6, name: 'Raw Almonds',       description: 'Fresh organic almonds, perfect for healthy snacking',      price: 390, image: Almonds,       category: 'Nuts' },
    { id: 7, name: 'Jaggery',           description: 'Sweet, natural jaggery',                                   price: 140, image: Jaggery,       category: 'Sweeteners' },
    { id: 8, name: 'Turmeric Powder',   description: 'Organic turmeric powder for cooking and health',           price: 100, image: TurmericPowder,category: 'Spices' },
    { id: 9, name: 'Toor Dal',          description: 'Protein‑rich toor dal',                                    price: 220, image: ToorDal,       category: 'pulse' },
    { id:10, name: 'Mirchi Powder',     description: 'Spicy and bold red chili powder',                          price: 100, image: MirchiPowder,  category: 'Spices' },
    { id:11, name: 'Moong Dal',         description: 'Light and digestible moong dal',                           price: 180, image: MoongDal,      category: 'pulse' },
    { id:12, name: 'Chana Dal',         description: 'Rich in protein chana dal',                                price: 140, image: ChanaDal,      category: 'pulse' },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const maxIndex  = Math.max(0, filteredProducts.length - itemsPerView);
  const nextSlide = () => setCurrentIndex(i => Math.min(i + 1, maxIndex));
  const prevSlide = () => setCurrentIndex(i => Math.max(i - 1, 0));

  const updateQuantity = (id, delta) =>
    setQuantities(q => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }));

  const addToCart = product => {
    const quantity = quantities[product.id] ?? 0;
    if (!quantity) {
      setPopupMessage(`Please select quantity before adding ${product.name}`);
      return setTimeout(() => setPopupMessage(''), 2000);
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.some(i => i.id === product.id)
      ? cart.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...cart, { ...product, quantity }];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
    setPopupMessage(`${quantity} × ${product.name} added to cart`);
    setTimeout(() => setPopupMessage(''), 2000);
  };

  return (
    <section className="product-scroller">
      <div className="container">
        {popupMessage && <div className="cart-popup-message">{popupMessage}</div>}

        <div className="scroller-header">
          <h2 className="scroller-title">Featured Products</h2>
          <p className="scroller-description">
            Discover our hand‑picked selection of premium organic pantry staples
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="no-results">No products found for “{searchTerm}”</p>
        ) : (
          <div className="scroller-container">
            {currentIndex > 0 && (
              <button className="scroller-button left" onClick={prevSlide}>
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="products-wrapper">
              <div
                className="products-container"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {filteredProducts.map((p, idx) => (
                  <div
                    key={p.id}
                    className="product-card"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="product-image-container">
                      <img src={p.image} alt={p.name} className="product-image" />
                      <div className="product-badge">{p.category}</div>
                    </div>

                    <div className="product-info">
                      <h3 className="product-name">{p.name}</h3>
                      <p className="product-description">{p.description}</p>

                      <div className="product-actions">
                        <span className="price small">₹{p.price}</span>

                        <div className="quantity-selector compact">
                          <button
                            className="quantity-btn small"
                            onClick={() => updateQuantity(p.id, -1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="quantity small">
                            {quantities[p.id] ?? 0}
                          </span>
                          <button
                            className="quantity-btn small"
                            onClick={() => updateQuantity(p.id, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(p)}
                      >
                        <ShoppingCart size={18} /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentIndex < maxIndex && (
              <button className="scroller-button right" onClick={nextSlide}>
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="scroller-indicators">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                className={`indicator ${i === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductScroller;
