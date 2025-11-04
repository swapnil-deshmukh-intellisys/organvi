import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Users } from 'lucide-react';
import './Subscribers.css';

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/subscribers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      
      const data = await response.json();
      setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err.message || 'Failed to load subscribers');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="admin-section">
        <h2 className="section-title">Subscribers</h2>
        <div className="placeholder-content">
          <p>Loading subscribers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <h2 className="section-title">Subscribers</h2>
        <div className="placeholder-content">
          <p style={{ color: '#d32f2f' }}>Error: {error}</p>
          <button onClick={fetchSubscribers} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="subscribers-header">
        <h2 className="section-title">Newsletter Subscribers</h2>
        <div className="subscribers-stats">
          <Users size={20} />
          <span className="stats-count">{subscribers.length}</span>
          <span className="stats-label">Total Subscribers</span>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="placeholder-content">
          <p>No subscribers yet.</p>
          <p className="placeholder-subtext">Subscribers will appear here once they sign up for the newsletter.</p>
        </div>
      ) : (
        <div className="subscribers-list">
          <div className="subscribers-table">
            <div className="table-header">
              <div className="table-cell email-cell">Email Address</div>
              <div className="table-cell date-cell">Subscribed Date</div>
            </div>
            {subscribers.map((subscriber) => (
              <div key={subscriber._id} className="table-row">
                <div className="table-cell email-cell">
                  <Mail size={16} className="cell-icon" />
                  <span>{subscriber.email}</span>
                </div>
                <div className="table-cell date-cell">
                  <Calendar size={16} className="cell-icon" />
                  <span>{formatDate(subscriber.subscribedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscribers;

