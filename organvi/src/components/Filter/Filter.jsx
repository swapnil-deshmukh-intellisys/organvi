import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ onFilterChange, categories, selectedCategory }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedPackageTypes, setSelectedPackageTypes] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      priceRange: [0, 1000],
      sortBy: 'name',
      availability: 'all',
      organicOnly: false,
      selectedCategory: selectedCategory,
      selectedItems: selectedItems,
      selectedPackageTypes: selectedPackageTypes,
      selectedDiscounts: selectedDiscounts,
      selectedPriceRange: selectedPriceRange,
      [filterType]: value
    });
  };

  const handleSubcategoryClick = (categoryName, subcategory) => {
    const item = { 
      category: categoryName, 
      subcategory: subcategory.name,
      products: subcategory.products 
    };
    
    setSelectedItems(prev => {
      const isSelected = prev.some(item => 
        item.category === categoryName && item.subcategory === subcategory.name
      );
      
      let newSelectedItems;
      if (isSelected) {
        // Remove item if already selected
        newSelectedItems = prev.filter(item => 
          !(item.category === categoryName && item.subcategory === subcategory.name)
        );
      } else {
        // Add item if not selected
        newSelectedItems = [...prev, item];
      }
      
      // Update the filter with new selected items
      onFilterChange({
        priceRange: [0, 1000],
        sortBy: 'name',
        availability: 'all',
        organicOnly: false,
        selectedCategory: selectedCategory,
        selectedItems: newSelectedItems,
        selectedPackageTypes: selectedPackageTypes,
        selectedDiscounts: selectedDiscounts,
        selectedPriceRange: selectedPriceRange
      });
      
      return newSelectedItems;
    });
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const categoryData = {
    'Pulses & Dal': [
      { name: 'Masoor Dal', products: ['Organic Masoor Dal 1kg', 'Organic Masoor Dal 500g', 'Premium Masoor Dal'] },
      { name: 'Moong Dal', products: ['Organic Moong Dal 1kg', 'Organic Moong Dal 500g', 'Split Moong Dal'] },
      { name: 'Urad Dal', products: ['Organic Urad Dal 1kg', 'Organic Urad Dal 500g', 'Whole Urad Dal'] },
      { name: 'Chana Dal', products: ['Organic Chana Dal 1kg', 'Organic Chana Dal 500g', 'Split Chana Dal'] },
      { name: 'Toor Dal', products: ['Organic Toor Dal 1kg', 'Organic Toor Dal 500g', 'Premium Toor Dal', 'Split Toor Dal'] },
      { name: 'Fried Gram', products: ['Organic Fried Gram 500g', 'Roasted Gram 1kg'] },
      { name: 'Roasted Chana', products: ['Organic Roasted Chana 500g', 'Spiced Roasted Chana'] },
      { name: 'Mix Sprouts', products: ['Organic Mix Sprouts 250g', 'Fresh Mix Sprouts'] }
    ],
    'Dry Fruits & Nuts': [
      { name: 'Almonds', products: ['Organic Almonds 500g', 'Premium Almonds 1kg', 'Blanched Almonds'] },
      { name: 'Cashews', products: ['Organic Cashews 500g', 'Premium Cashews 1kg', 'Raw Cashews'] },
      { name: 'Pistachios', products: ['Organic Pistachios 250g', 'Premium Pistachios 500g'] },
      { name: 'Raisins', products: ['Organic Raisins 500g', 'Black Raisins 1kg', 'Golden Raisins'] }
    ],
    'Sweeteners': [
      { name: 'Jaggery ', products: ['Organic Jaggery Powder', 'Cane Jaggery 1kg', 'Palm Jaggery', 'Coconut Jaggery', 'Date Jaggery'] }
    ],
    'Spices & Masalas': [
      { name: 'Turmeric', products: ['Organic Turmeric Powder', 'Raw Turmeric', 'Turmeric Root', 'Turmeric Capsules'] },
      { name: 'Chilli Powder', products: ['Organic Chilli Powder', 'Kashmiri Chilli Powder', 'Red Chilli Flakes'] }
    ]
  };

  const handleClearAll = () => {
    setExpandedCategories({});
    setSelectedItems([]);
    setSelectedPackageTypes([]);
    setSelectedDiscounts([]);
    setSelectedPriceRange('');
    onFilterChange({
      priceRange: [0, 1000],
      sortBy: 'name',
      availability: 'all',
      organicOnly: false,
      selectedCategory: 'all',
      selectedItems: [],
      selectedPackageTypes: [],
      selectedDiscounts: [],
      selectedPriceRange: ''
    });
  };

  const removeSelectedItem = (categoryName, subcategory) => {
    setSelectedItems(prev => 
      prev.filter(item => 
        !(item.category === categoryName && item.subcategory === subcategory)
      )
    );
  };

  const handlePackageTypeChange = (packageType) => {
    setSelectedPackageTypes(prev => {
      const isSelected = prev.includes(packageType);
      let newPackageTypes;
      
      if (isSelected) {
        newPackageTypes = prev.filter(type => type !== packageType);
      } else {
        newPackageTypes = [...prev, packageType];
      }
      
      // Update the filter with new package types
      onFilterChange({
        priceRange: [0, 1000],
        sortBy: 'name',
        availability: 'all',
        organicOnly: false,
        selectedCategory: selectedCategory,
        selectedItems: selectedItems,
        selectedPackageTypes: newPackageTypes
      });
      
      return newPackageTypes;
    });
  };

  const packageTypes = [
    { name: '1 unit', count: 224 },
    { name: '1 KG', count: 1014 },
    { name: '500 GM', count: 1197 },
    { name: '250 GM', count: 743 },
    { name: '1 PCS', count: 306 },
    { name: '125 GM', count: 48 },
    { name: '225 GM', count: 8 },
    { name: '5 KG', count: 72 },
    { name: '2 KG', count: 156 },
    { name: '1 L', count: 89 },
    { name: '500 ML', count: 234 },
    { name: '250 ML', count: 167 },
    { name: '10 KG', count: 45 },
    { name: '50 GM', count: 123 },
    { name: '100 GM', count: 89 }
  ];

  const discountRanges = [
    { name: 'Upto 5%', count: 5 },
    { name: '5% - 10%', count: 103 },
    { name: '10% - 15%', count: 110 },
    { name: '15% - 20%', count: 76 }
  ];

  const priceRanges = [
    { name: 'less than 60', count: 204 },
    { name: '₹60.00 - ₹100.00', count: 322 },
    { name: '₹100.00 - ₹150.00', count: 334 },
    { name: '₹150.00 - ₹200.00', count: 340 },
    { name: 'More Than ₹200.00', count: 1036 }
  ];

  const handleDiscountChange = (discountRange) => {
    setSelectedDiscounts(prev => {
      const isSelected = prev.includes(discountRange);
      let newDiscounts;
      
      if (isSelected) {
        newDiscounts = prev.filter(discount => discount !== discountRange);
      } else {
        newDiscounts = [...prev, discountRange];
      }
      
      // Update the filter with new discount selections
      onFilterChange({
        priceRange: [0, 1000],
        sortBy: 'name',
        availability: 'all',
        organicOnly: false,
        selectedCategory: selectedCategory,
        selectedItems: selectedItems,
        selectedPackageTypes: selectedPackageTypes,
        selectedDiscounts: newDiscounts,
        selectedPriceRange: selectedPriceRange
      });
      
      return newDiscounts;
    });
  };

  const handlePriceRangeChange = (priceRange) => {
    setSelectedPriceRange(priceRange);
    
    // Update the filter with new price range selection
    onFilterChange({
      priceRange: [0, 1000],
      sortBy: 'name',
      availability: 'all',
      organicOnly: false,
      selectedCategory: selectedCategory,
      selectedItems: selectedItems,
      selectedPackageTypes: selectedPackageTypes,
      selectedDiscounts: selectedDiscounts,
      selectedPriceRange: priceRange
    });
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h3 className="filter-title">Filter</h3>
        <button className="clear-all-btn" onClick={handleClearAll}>Clear All</button>
      </div>
      
      <div className="filter-section">
        <h4 className="filter-section-title">Category</h4>
        
        
        <div className="category-list">
          {Object.entries(categoryData).map(([categoryName, subcategories]) => (
            <div key={categoryName} className="category-item">
              <div 
                className="category-header"
                onClick={() => toggleCategory(categoryName)}
              >
                <span className="category-name">{categoryName}</span>
                <span className={`dropdown-icon ${expandedCategories[categoryName] ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              {expandedCategories[categoryName] && (
                <div className="subcategories">
                  {subcategories.map((subcategory) => {
                    const isSelected = selectedItems.some(item => 
                      item.category === categoryName && item.subcategory === subcategory.name
                    );
                    return (
                      <div 
                        key={subcategory.name} 
                        className={`subcategory-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSubcategoryClick(categoryName, subcategory)}
                      >
                        {subcategory.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-section-title">Package Types</h4>
        <div className="package-types-scroll-container">
          <div className="package-types-list">
            {packageTypes.map((packageType) => (
              <label key={packageType.name} className="package-type-option">
                <input
                  type="checkbox"
                  checked={selectedPackageTypes.includes(packageType.name)}
                  onChange={() => handlePackageTypeChange(packageType.name)}
                  className="package-type-checkbox"
                />
                <span className="package-type-label">
                  {packageType.name} ({packageType.count})
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-section-title">Discounts</h4>
        <div className="discounts-list">
          {discountRanges.map((discount) => (
            <label key={discount.name} className="discount-option">
              <input
                type="checkbox"
                checked={selectedDiscounts.includes(discount.name)}
                onChange={() => handleDiscountChange(discount.name)}
                className="discount-checkbox"
              />
              <span className="discount-label">
                {discount.name} ({discount.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-section-title">Price</h4>
        <div className="price-list">
          {priceRanges.map((price) => (
            <label key={price.name} className="price-option">
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === price.name}
                onChange={() => handlePriceRangeChange(price.name)}
                className="price-radio"
              />
              <span className="price-label">
                {price.name} ({price.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-section-title">Sort By</h4>
        <select
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="filter-select"
        >
          <option value="name">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price">Price Low to High</option>
          <option value="price-desc">Price High to Low</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>

    </div>
  );
};

export default Filter;