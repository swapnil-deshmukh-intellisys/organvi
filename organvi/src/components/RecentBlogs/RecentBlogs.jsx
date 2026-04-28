import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data/blogData';
import { getImage } from '../../utils/imageImports';
import './RecentBlogs.css';

const RecentBlogs = () => {
  // Get the 3 most recent blogs
  const recentBlogs = blogPosts.slice(0, 3);

  // Format date for display (e.g., "27, Jun, 2025")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}, ${month}, ${year}`;
  };

  return (
    <div className="recent-blogs-section">
      <div className="recent-blogs-container">
        <h2 className="recent-blogs-title">Recent posts</h2>
        <div className="recent-blogs-grid">
          {recentBlogs.map((post) => (
            <div key={post.id} className="recent-blog-card">
              <Link to={`/blog/${post.id}`} className="recent-blog-card-link">
                <div className="recent-blog-image-container">
                  <img 
                    src={getImage(post.image)} 
                    alt={post.title}
                    className="recent-blog-image"
                  />
                  <div className="recent-blog-date-box">
                    {formatDate(post.date)}
                  </div>
                </div>
                <div className="recent-blog-content">
                  <h3 className="recent-blog-title">{post.title}</h3>
                  <p className="recent-blog-excerpt">{post.excerpt}</p>
                  <button className="recent-blog-read-more-btn">READ MORE</button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentBlogs;

