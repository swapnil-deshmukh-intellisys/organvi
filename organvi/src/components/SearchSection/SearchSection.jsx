import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './SearchSection.css';

const SearchSection = ({ searchTerm, setSearchTerm }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      document.querySelector('.product-scroller')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="search-section">
      <div className="container">
        <div className="search-content">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <Search className="search-icon" size={24} />
              <input
                type="text"
                placeholder="Search for organic pantry staples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="search-actions">
              <button type="submit" className="btn btn-primary search-btn">
                Search Products
              </button>
              <Link to="/products" className="btn btn-secondary">
                See All Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
