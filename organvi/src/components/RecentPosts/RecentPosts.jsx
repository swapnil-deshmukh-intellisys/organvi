import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data/blogData';
import { getImage } from '../../utils/imageImports';
import './RecentPosts.css';

const RecentPosts = ({ currentPostId }) => {
  // Get the 3 most recent posts, excluding the current post
  const recentPosts = blogPosts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3);

  return (
    <div className="recent-posts-section">
      <h2 className="recent-posts-title">Recent posts</h2>
      <div className="recent-posts-grid">
        {recentPosts.map((post) => (
          <div key={post.id} className="recent-post-card">
            <Link to={`/blog/${post.id}`} className="recent-post-link">
              <div className="recent-post-image-container">
                <img 
                  src={getImage(post.image)} 
                  alt={post.title}
                  className="recent-post-image"
                />
              </div>
              <div className="recent-post-content">
                <h3 className="recent-post-title">{post.title}</h3>
                <button className="recent-post-read-more-btn">READ MORE</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;

