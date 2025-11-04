import { useState, useEffect } from 'react';
import './Products.css';
import { Minus, Plus } from 'lucide-react';

import roastedChana from '../../assets/roastchana1.png';
import Raisins from '../../assets/rainse1.png';
import UradDal from '../../assets/uraldal.png';
import Pista from '../../assets/pista1.png';
import CashewNuts from '../../assets/cashewnut.png';
import Almonds from '../../assets/almond.png';
import Jaggery from '../../assets/jeggary.png';
import Jaggery1 from '../../assets/jaggary2.jpg';
import Jaggery2 from '../../assets/jaggary3.png';
import Jaggery3 from '../../assets/jaggary4.jpg';
import Jaggery4 from '../../assets/jaggary5.jpg';
import Jaggery5 from '../../assets/jaggary6.png';
import TurmericPowder from '../../assets/termeric5.png';
import TurmericPowder1 from '../../assets/termeric.png';
import TurmericPowder2 from '../../assets/termeric2.jpg';
import TurmericPowder3 from '../../assets/termeric3.jpg';
import TurmericPowder4 from '../../assets/termeric4.jpg';
import ToorDal from '../../assets/toordal.png';
import MirchiPowder from '../../assets/chilly2.png';
import Mirchi1 from '../../assets/chilly1.jpg';
import Mirchi2 from '../../assets/chilly.jpg';
import MoongDal from '../../assets/moongdal.png';
import ChanaDal from '../../assets/chanadal.png';

const initialCategories = [
  { id: 1, name: 'Roasted Chana', image: roastedChana, price: 160, description: 'Crunchy roasted chana.' },
  { id: 2, name: 'Raisins', image: Raisins, price: 200, description: 'Sweet dried grapes.' },
  { id: 3, name: 'Urad Dal', image: UradDal, price: 180, description: 'Protein-rich urad dal.' },
  { id: 4, name: 'Pista', image: Pista, price: 450, description: 'Premium quality pistachios.' },
  { id: 5, name: 'Cashew Nuts', image: CashewNuts, price: 420, description: 'Rich and crunchy cashews.' },
  { id: 6, name: 'Almonds', image: Almonds, price: 390, description: 'Healthy and nutritious almonds.' },
  { id: 7, name: 'Jaggery', images: [Jaggery, Jaggery1, Jaggery2, Jaggery3, Jaggery4, Jaggery5], price: 140, description: 'Natural sweetener jaggery.' },
  { id: 8, name: 'Turmeric Powder', images: [TurmericPowder, TurmericPowder1, TurmericPowder2, TurmericPowder3, TurmericPowder4], price: 100, description: 'Organic turmeric powder.' },
  { id: 9, name: 'Toor Dal', image: ToorDal, price: 220, description: 'Staple lentil toor dal.' },
  { id: 10, name: 'Mirchi Powder', images: [MirchiPowder, Mirchi1, Mirchi2], price: 100, description: 'Spicy mirchi powder.' },
  { id: 11, name: 'Moong Dal', image: MoongDal, price: 180, description: 'Easy-to-digest moong dal.' },
  { id: 12, name: 'Chana Dal', image: ChanaDal, price: 140, description: 'Popular split chickpeas.' },
];

const Products = () => {
  const [quantities, setQuantities] = useState({});
  const [mirchiImageIndex, setMirchiImageIndex] = useState(0);
  const [jaggeryImageIndex, setJaggeryImageIndex] = useState(0);
  const [turmericImageIndex, setTurmericImageIndex] = useState(0);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const mirchiInterval = setInterval(() => {
      setMirchiImageIndex((prev) => (prev + 1) % 3);
    }, 2000);
    const jaggeryInterval = setInterval(() => {
      setJaggeryImageIndex((prev) => (prev + 1) % 6);
    }, 2000);
    const turmericInterval = setInterval(() => {
      setTurmericImageIndex((prev) => (prev + 1) % 5);
    }, 2000);

    return () => {
      clearInterval(mirchiInterval);
      clearInterval(jaggeryInterval);
      clearInterval(turmericInterval);
    };
  }, []);

  const updateQuantity = (id, delta) => {
    setQuantities((prev) => {
      const currentQty = prev[id] ?? 0;
      const newQty = Math.max(0, currentQty + delta);
      return { ...prev, [id]: newQty };
    });
  };

  const getImageById = (product) => {
    if (product.id === 10) return product.images[mirchiImageIndex];
    if (product.id === 7) return product.images[jaggeryImageIndex];
    if (product.id === 8) return product.images[turmericImageIndex];
    return product.image;
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] ?? 0;

    if (quantity === 0) {
      setPopupMessage(`❌ Please select quantity before adding to cart.`);
      setTimeout(() => setPopupMessage(''), 2000);
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

    const updatedCart = (() => {
      const found = existingCart.find(item => item.id === product.id);
      if (found) {
        return existingCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...existingCart, { ...product, quantity }];
      }
    })();

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));

    setPopupMessage(`✅ ${quantity} x ${product.name} added to cart!`);
    setTimeout(() => setPopupMessage(''), 2000);
  };

  return (
    <section className="categories">
      <div className="container">
        {popupMessage && (
          <div className="cart-popup-message">{popupMessage}</div>
        )}

        <div className="categories-header">
          <h2 className="categories-title">All Products</h2>
          <p className="categories-description">
            Explore our carefully curated selection of organic pantry staples
          </p>
        </div>

        <div className="categories-grid">
          {initialCategories.map((product, index) => (
            <div key={product.id} className="category-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="category-image-container">
                <img
                  src={getImageById(product)}
                  alt={product.name}
                  className="category-image"
                />
                <div className="category-overlay">
                  <span className="category-cta">Buy Now</span>
                </div>
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-actions">
                  <span className="price small">₹{product.price}</span>

                  <div className="quantity-selector compact">
                    <button className="quantity-btn small" onClick={() => updateQuantity(product.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span className="quantity small">{quantities[product.id] ?? 0}</span>
                    <button className="quantity-btn small" onClick={() => updateQuantity(product.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="add-to-cart-btn1"
                onClick={() =>
                  handleAddToCart({
                    ...product,
                    image: getImageById(product),
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
