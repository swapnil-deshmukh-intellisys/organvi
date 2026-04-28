import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../../data/blogData';
import RecentPosts from '../../components/RecentPosts/RecentPosts';
import { getImage } from '../../utils/imageImports';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-container">
          <h1>Blog Post Not Found</h1>
          <Link to="/blog" className="back-to-blog-link">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb-container">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">-</span>
          <Link to="/blog" className="breadcrumb-link">Blog</Link>
          <span className="breadcrumb-separator">-</span>
          <span className="breadcrumb-current">{post.title}</span>
        </div>

        {/* Blog Header */}
        <div className="blog-detail-header">
          <div className="blog-detail-meta">
            <span className="blog-category">{post.category}</span>
            <span className="blog-date">{post.date}</span>
          </div>
          <h1 className="blog-detail-title">{post.title}</h1>
        </div>

        {/* Main Image */}
        <div className="blog-detail-main-image">
          <img 
            src={getImage(post.image)} 
            alt={post.title}
            className="main-blog-image"
          />
        </div>

        {/* Blog Content */}
        <div className="blog-detail-content">
          <div 
            className="blog-content-text"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Additional Images */}
        {post.images && post.images.length > 1 && (
          <div className="blog-detail-images">
            {post.images.slice(1).map((image, index) => (
              <div key={index} className="blog-detail-image-item">
                <img 
                  src={getImage(image)} 
                  alt={`${post.title} - Image ${index + 2}`}
                  className="additional-blog-image"
                />
              </div>
            ))}
          </div>
        )}

        {/* Recent Posts Section */}
        <RecentPosts currentPostId={post.id} />
      </div>
    </div>
  );
};

export default BlogDetail;

