import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Filter } from 'lucide-react';
import API_ENDPOINTS from '../../../config/api';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const url = filterStatus === 'all' 
        ? API_ENDPOINTS.REVIEWS.ALL
        : `${API_ENDPOINTS.REVIEWS.ALL}?status=${filterStatus}`;
      
      console.log('Fetching reviews from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        setError('Cannot connect to backend server. Please ensure the backend is running on ' + API_ENDPOINTS.BASE);
      } else {
        setError(err.message || 'Failed to load reviews');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      setActionLoading(reviewId);
      const response = await fetch(API_ENDPOINTS.REVIEWS.APPROVE(reviewId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approvedBy: 'admin' })
      });

      if (response.ok) {
        await fetchReviews();
      } else {
        throw new Error('Failed to approve review');
      }
    } catch (err) {
      console.error('Error approving review:', err);
      alert('Failed to approve review. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      setActionLoading(reviewId);
      const response = await fetch(API_ENDPOINTS.REVIEWS.REJECT(reviewId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approvedBy: 'admin' })
      });

      if (response.ok) {
        await fetchReviews();
      } else {
        throw new Error('Failed to reject review');
      }
    } catch (err) {
      console.error('Error rejecting review:', err);
      alert('Failed to reject review. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setActionLoading(reviewId);
      const response = await fetch(API_ENDPOINTS.REVIEWS.DELETE(reviewId), {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchReviews();
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-pending', text: 'Pending' },
      approved: { class: 'status-approved', text: 'Approved' },
      rejected: { class: 'status-rejected', text: 'Rejected' }
    };
    return badges[status] || badges.pending;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={i < rating ? 'star filled' : 'star empty'}
        size={16}
        fill={i < rating ? '#ffc107' : 'none'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="admin-section">
        <h2 className="section-title">Reviews</h2>
        <div className="placeholder-content">
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <h2 className="section-title">Reviews</h2>
        <div className="placeholder-content">
          <p className="error-text">Error: {error}</p>
          <button onClick={fetchReviews} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length;

  return (
    <div className="admin-section">
      <div className="reviews-header">
        <h2 className="section-title">Product Reviews</h2>
        <div className="reviews-stats">
          <div className="stat-item">
            <span className="stat-count pending">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-count approved">{approvedCount}</span>
            <span className="stat-label">Approved</span>
          </div>
          <div className="stat-item">
            <span className="stat-count rejected">{rejectedCount}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>
      </div>

      <div className="reviews-filters">
        <Filter size={18} />
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All ({reviews.length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
          onClick={() => setFilterStatus('approved')}
        >
          Approved ({approvedCount})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilterStatus('rejected')}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="placeholder-content">
          <p>No reviews found.</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => {
            const statusBadge = getStatusBadge(review.status);
            return (
              <div key={review._id} className="review-item">
                <div className="review-main">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <h4>{review.name}</h4>
                      <span className="reviewer-email">{review.email}</span>
                    </div>
                    <div className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </div>
                  </div>

                  <div className="review-product">
                    <strong>Product:</strong> {review.productName}
                    <span className="product-id">(ID: {review.productId})</span>
                  </div>

                  <div className="review-rating">
                    {renderStars(review.rating)}
                    <span className="rating-number">{review.rating}/5</span>
                  </div>

                  {review.title && (
                    <h5 className="review-title">{review.title}</h5>
                  )}

                  <p className="review-comment">{review.comment}</p>

                  {review.reviewImage && review.reviewImage.length > 0 && (
                    <div className="review-image-container">
                      <img
                        src={review.reviewImage}
                        alt="Review attachment"
                        className="review-image"
                      />
                    </div>
                  )}

                  {review.recommend && (
                    <div className="review-recommend">
                      <span>✓ Recommends this product</span>
                    </div>
                  )}

                  <div className="review-meta">
                    <span>Submitted: {formatDate(review.createdAt)}</span>
                    {review.approvedAt && (
                      <span>Reviewed: {formatDate(review.approvedAt)}</span>
                    )}
                  </div>
                </div>

                <div className="review-actions">
                  {review.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        onClick={() => handleApprove(review._id)}
                        disabled={actionLoading === review._id}
                      >
                        <Check size={16} />
                        Approve
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleReject(review._id)}
                        disabled={actionLoading === review._id}
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(review._id)}
                    disabled={actionLoading === review._id}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;

