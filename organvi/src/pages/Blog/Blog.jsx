import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data/blogData';
import { getImage } from '../../utils/imageImports';
import './Blog.css';

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-page">
      <div className="blog-container">
        <h1 className="blog-page-title">Recent posts</h1>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <div key={post.id} className="blog-card">
              <Link to={`/blog/${post.id}`} className="blog-card-link">
                <div className="blog-image-container">
                  <img 
                    src={getImage(post.image)} 
                    alt={post.title}
                    className="blog-image"
                  />
                </div>
                <div className="blog-content">
                  <h2 className="blog-title">{post.title}</h2>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <button className="blog-read-more-btn">READ MORE</button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

