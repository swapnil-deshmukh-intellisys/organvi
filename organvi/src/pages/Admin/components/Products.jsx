import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Products.css';

const CATEGORY_KEYS = {
  'products-pulses': 'pulses',
  'products-sweetener': 'sweetener',
  'products-dryfruits': 'dryfruits',
  'products-spices': 'spices',
};

const getKeyForCategory = (category) => CATEGORY_KEYS[category] || 'pulses';

const API_BASE = 'http://localhost:5000/api/products';

const Products = ({ category }) => {
  const categoryKey = useMemo(() => getKeyForCategory(category), [category]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    originalPrice: '',
    discount: '', 
    description: '', 
    features: ['', '', '', '', ''], // Array for 5 feature inputs
    idealForMaking: '', 
    imageUrl: '' 
  });
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const title = useMemo(() => {
    switch (categoryKey) {
      case 'pulses': return 'Pulses & Dal';
      case 'sweetener': return 'Sweetner';
      case 'dryfruits': return 'Dry Fruits & Nuts';
      case 'spices': return 'Spices & Masalas';
      default: return 'Products';
    }
  }, [categoryKey]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}?category=${categoryKey}`);
      if (response.ok) {
        const products = await response.json();
        // Convert backend format to frontend format (with id field)
        const formatted = products.map(p => ({
          id: p._id || p.id,
          _id: p._id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          discount: p.discount,
          description: p.description,
          image: p.image
        }));
        setItems(formatted);
      } else {
        console.error('Failed to fetch products');
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryKey]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(p => (p.name || '').toLowerCase().includes(q));
  }, [items, filter]);

  const resetForm = () => {
    setForm({ 
      name: '', 
      price: '', 
      originalPrice: '',
      discount: '', 
      description: '', 
      features: ['', '', '', '', ''], 
      idealForMaking: '', 
      imageUrl: '' 
    });
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openModal = () => {
    resetForm();
    setEditingProduct(null);
    setShowModal(true);
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    // Pre-fill form with product data
    const featuresArray = Array.isArray(product.features) 
      ? [...product.features, '', '', '', '', ''].slice(0, 5) // Ensure exactly 5 items
      : ['', '', '', '', ''];
    
    setForm({
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || product.price || '',
      discount: product.discount || 0,
      description: product.description || '',
      features: featuresArray,
      idealForMaking: product.idealForMaking || '',
      imageUrl: product.image || ''
    });
    setImagePreview(product.image || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const onChange = (e) => {
    if (e.target.name.startsWith('feature_')) {
      const index = parseInt(e.target.name.split('_')[1]);
      const newFeatures = [...form.features];
      newFeatures[index] = e.target.value;
      setForm({ ...form, features: newFeatures });
    } else if (e.target.name === 'discount') {
      const discount = e.target.value;
      // Auto-calculate price if originalPrice exists
      setForm(prev => {
        const original = Number(prev.originalPrice) || 0;
        const discountValue = Number(discount) || 0;
        const discountedPrice = original > 0 ? (original - (original * discountValue / 100)).toFixed(2) : prev.price;
        return { ...prev, discount, price: discountedPrice };
      });
    } else if (e.target.name === 'originalPrice') {
      const originalPrice = e.target.value;
      // Auto-calculate price based on discount
      setForm(prev => {
        const original = Number(originalPrice) || 0;
        const discountValue = Number(prev.discount) || 0;
        let newPrice = originalPrice; // Default to originalPrice
        
        if (original > 0) {
          if (discountValue > 0) {
            // Calculate discounted price
            newPrice = (original - (original * discountValue / 100)).toFixed(2);
          } else {
            // No discount, price equals original
            newPrice = originalPrice;
          }
        }
        
        return { ...prev, originalPrice, price: newPrice };
      });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          canvas.toBlob(
            (blob) => {
              const reader2 = new FileReader();
              reader2.onload = () => resolve(reader2.result);
              reader2.onerror = reject;
              reader2.readAsDataURL(blob);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB original file)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB. Please compress the image first.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    try {
      // Compress image if it's larger than 500KB
      if (file.size > 500 * 1024) {
        const compressedBase64 = await compressImage(file);
        setImagePreview(compressedBase64);
      } else {
        // If small enough, use as-is
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result || '');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try a different image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    const name = (form.name || '').trim();
    if (!name) return alert('Name is required');
    
    const originalPrice = Number(form.originalPrice || form.price || 0);
    if (isNaN(originalPrice) || originalPrice <= 0) return alert('Valid price is required');
    
    const discount = Number(form.discount || 0);
    const price = form.price ? Number(form.price) : originalPrice;
    
    if (isNaN(price) || price <= 0) return alert('Valid price is required');
    if (isNaN(discount) || discount < 0 || discount > 100) return alert('Discount must be between 0 and 100');
    
    const description = (form.description || '').trim();
    if (!description) return alert('Description is required');
    
    // Build payload, only including non-empty fields
    const payload = {
      name,
      price,
      originalPrice,
      discount: discount || 0,
      description,
      category: categoryKey
    };
    
    // Add features only if at least one is provided
    const features = form.features.filter(f => f && f.trim());
    if (features.length > 0) {
      payload.features = features;
    }
    
    // Add idealForMaking only if provided
    const idealForMaking = (form.idealForMaking || '').trim();
    if (idealForMaking) {
      payload.idealForMaking = idealForMaking;
    }
    
    // Add image only if provided
    const image = imagePreview || (form.imageUrl || '').trim();
    if (image) {
      payload.image = image;
    }

    try {
      const isEdit = editingProduct !== null;
      const productId = editingProduct ? (editingProduct.id || editingProduct._id) : null;
      
      const url = isEdit ? `${API_BASE}/${productId}` : API_BASE;
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Refresh the list
        await fetchProducts();
        closeModal();
        alert(isEdit ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        // Try to parse error, but handle HTML responses (404 pages)
        let errorMessage = isEdit ? 'Failed to update product' : 'Failed to add product';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON (like HTML 404 page), use status text
          errorMessage = `Server error (${response.status}): ${response.statusText || 'Route not found. Please check if backend is running on port 5000.'}`;
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error(isEdit ? 'Error updating product:' : 'Error adding product:', error);
      alert(`Failed to ${isEdit ? 'update' : 'add'} product: ${error.message || 'Network error. Please check if backend is running on http://localhost:5000'}`);
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchProducts();
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };


  if (loading) {
    return (
      <div className="admin-section">
        <div className="category-header">
          <h2 className="category-title">{title}</h2>
          <span className="category-subtitle">Product Management</span>
        </div>
        <div className="admin-empty">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="category-header">
        <h2 className="category-title">{title}</h2>
        <span className="category-subtitle">Product Management</span>
      </div>

      {/* Controls Row */}
      <div className="admin-products-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="admin-input"
        />
        <button className="admin-add-btn" onClick={openModal}>Add Product</button>
      </div>

      {/* Grid List */}
      {filtered.length === 0 ? (
        <div className="admin-empty">No products found.</div>
      ) : (
        <div className="admin-products-grid">
          {filtered.map((p) => (
            <div key={p.id || p._id} className="admin-card">
              <div className="admin-card-image">
                {p.image ? <img src={p.image} alt={p.name} /> : <div className="img-ph">No Image</div>}
              </div>
              <div className="admin-card-body">
                <div className="admin-card-title">{p.name}</div>
                <div className="admin-card-meta">
                  <span className="admin-price">₹{Number(p.price || 0)}</span>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <>
                      <span className="admin-original-price">₹{Number(p.originalPrice || 0)}</span>
                      {p.discount > 0 && (
                        <span className="admin-discount-badge">{p.discount}% OFF</span>
                      )}
                    </>
                  )}
                </div>
                <div className="admin-card-actions">
                  <button className="admin-edit-btn" onClick={() => editProduct(p)}>Edit</button>
                  <button className="admin-delete-btn" onClick={() => removeItem(p.id || p._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit' : 'Add'} Product - {title}</h3>
              <button className="admin-modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={addItem} className="admin-modal-form">
              <div className="form-row">
                <label>Name *</label>
                <input name="name" value={form.name} onChange={onChange} className="admin-input" placeholder="E.g., Organic Almonds" required />
              </div>
              <div className="form-row">
                <label>Original Price (₹) *</label>
                <input name="originalPrice" type="number" value={form.originalPrice} onChange={onChange} className="admin-input" placeholder="E.g., 500" required min="0" step="0.01" />
              </div>
              <div className="form-row">
                <label>Discount (%)</label>
                <input name="discount" type="number" value={form.discount} onChange={onChange} className="admin-input" placeholder="E.g., 10" min="0" max="100" step="0.01" />
              </div>
              <div className="form-row">
                <label>Final Price (₹) *</label>
                <input 
                  name="price" 
                  type="number" 
                  value={form.price || (form.originalPrice ? (Number(form.originalPrice) - (Number(form.originalPrice) * (Number(form.discount || 0) / 100))).toFixed(2) : '')} 
                  onChange={onChange} 
                  className="admin-input" 
                  placeholder="Calculated automatically" 
                  required 
                  min="0" 
                  step="0.01" 
                  readOnly
                  style={{ backgroundColor: '#F9FAFB', cursor: 'not-allowed' }}
                />
                {form.discount && form.originalPrice && (
                  <small style={{ color: '#10B981', marginTop: '4px' }}>
                    {form.discount}% off ₹{form.originalPrice} = ₹{form.price || (Number(form.originalPrice) - (Number(form.originalPrice) * (Number(form.discount) / 100))).toFixed(2)}
                  </small>
                )}
              </div>
              <div className="form-row">
                <label>Description *</label>
                <textarea name="description" value={form.description} onChange={onChange} className="admin-input" placeholder="Enter product description..." required rows="4" style={{ resize: 'vertical', minHeight: '80px' }} />
              </div>
              <div className="form-row">
                <label>Product Features (Optional - Max 5)</label>
                {form.features.map((feature, index) => (
                  <input
                    key={index}
                    name={`feature_${index}`}
                    value={feature}
                    onChange={onChange}
                    className="admin-input"
                    placeholder={`Feature ${index + 1} (e.g., 100% Organic & Natural)`}
                    style={{ marginBottom: index < form.features.length - 1 ? '8px' : '0' }}
                  />
                ))}
              </div>
              <div className="form-row">
                <label>Ideal For Making</label>
                <textarea name="idealForMaking" value={form.idealForMaking} onChange={onChange} className="admin-input" placeholder="E.g., Traditional Indian dal recipes, soups, curries, and healthy meals." rows="2" style={{ resize: 'vertical', minHeight: '60px' }} />
              </div>
              <div className="form-row">
                <label>Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={onChange} className="admin-input" placeholder="https://..." />
              </div>
              <div className="form-row">
                <label>Or Upload Image (Max 2MB)</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} />
              </div>
              {imagePreview && (
                <div className="preview-row">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
              <div className="admin-modal-actions">
                <button type="button" className="admin-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="admin-save">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
