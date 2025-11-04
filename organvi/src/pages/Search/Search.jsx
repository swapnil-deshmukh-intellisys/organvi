import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      setLoading(true);
      // Mock search results - replace with actual API call
      const mockResults = [
        { id: 1, name: 'Organic Turmeric Powder', category: 'Spices', price: '₹299', image: '/api/placeholder/200/200' },
        { id: 2, name: 'Organic Basmati Rice', category: 'Rice', price: '₹450', image: '/api/placeholder/200/200' },
        { id: 3, name: 'Organic Almonds', category: 'Dry Fruits', price: '₹899', image: '/api/placeholder/200/200' },
        { id: 4, name: 'Organic Jaggery', category: 'Sweeteners', price: '₹199', image: '/api/placeholder/200/200' },
        { id: 5, name: 'Organic Moong Dal', category: 'Pulses', price: '₹149', image: '/api/placeholder/200/200' },
        { id: 6, name: 'Organic Cashew Nuts', category: 'Dry Fruits', price: '₹1299', image: '/api/placeholder/200/200' },
        { id: 7, name: 'Organic Chana Dal', category: 'Pulses', price: '₹179', image: '/api/placeholder/200/200' },
        { id: 8, name: 'Organic Toor Dal', category: 'Pulses', price: '₹189', image: '/api/placeholder/200/200' }
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setTimeout(() => {
        setSearchResults(mockResults);
        setLoading(false);
      }, 500);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-[#8B4513] hover:text-[#6B3410] mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600 mt-2">
            {loading ? 'Searching...' : `${searchResults.length} products found`}
          </p>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Product Image</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <p className="text-xl font-bold text-[#8B4513]">{product.price}</p>
                  <button className="w-full mt-4 bg-[#8B4513] text-white py-2 px-4 rounded-lg hover:bg-[#6B3410] transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try searching with different keywords or browse our categories.
            </p>
            <Link 
              to="/allcategories" 
              className="inline-flex items-center bg-[#8B4513] text-white px-6 py-3 rounded-lg hover:bg-[#6B3410] transition-colors duration-200"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
