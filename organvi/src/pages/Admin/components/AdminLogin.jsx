import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import './AdminLogin.css';

const ADMIN_EMAIL = 'organvi7820@gmai.com';
const ADMIN_PASSWORD = 'organvi@7820';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setSubmitting(true);
      
      // Simulate API call delay (optional - can be removed)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Validate credentials
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        // Store admin session
        const adminSession = {
          email: ADMIN_EMAIL,
          loggedInAt: new Date().toISOString()
        };
        localStorage.setItem('adminSession', JSON.stringify(adminSession));
        
        // Call onLogin callback
        if (onLogin) {
          onLogin();
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <div className="admin-logo">
            <Lock size={48} />
          </div>
          <h1 className="admin-login-title">Admin Login</h1>
          <p className="admin-login-subtitle">Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <label className="admin-input-label">Email Address</label>
            <div className="admin-input-container">
              <Mail size={20} className="admin-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin email"
                className="admin-input"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">Password</label>
            <div className="admin-input-container">
              <Lock size={20} className="admin-input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                className="admin-input"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="admin-error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={submitting}
          >
            {submitting ? (
              'Logging in...'
            ) : (
              <>
                <LogIn size={20} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <p className="admin-security-note">
            🔒 Secure Admin Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

