import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// Submit a new review (status: pending)
router.post('/submit', async (req, res) => {
  try {
    const {
      productId,
      productName,
      name,
      email,
      rating,
      title,
      comment,
      reviewImage,
      recommend
    } = req.body;

    // Validate required fields
    if (!productId || !productName || !name || !email || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = new Review({
      productId,
      productName,
      name,
      email: email.toLowerCase(),
      rating,
      title: title || '',
      comment,
      reviewImage: reviewImage || '',
      recommend: recommend || false,
      status: 'pending'
    });

    await review.save();
    res.status(201).json({ message: 'Review submitted successfully. It will be reviewed by admin.', review });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get approved reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({
      productId,
      status: 'approved'
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get all reviews (for admin) - pending, approved, rejected
router.get('/all', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get pending reviews count (for admin dashboard)
router.get('/pending/count', async (req, res) => {
  try {
    const count = await Review.countDocuments({ status: 'pending' });
    res.json({ count });
  } catch (error) {
    console.error('Error counting pending reviews:', error);
    res.status(500).json({ error: 'Failed to count pending reviews' });
  }
});

// Approve a review
router.put('/:reviewId/approve', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { approvedBy } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        status: 'approved',
        approvedBy: approvedBy || 'admin',
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review approved successfully', review });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({ error: 'Failed to approve review' });
  }
});

// Reject a review
router.put('/:reviewId/reject', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { approvedBy } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        status: 'rejected',
        approvedBy: approvedBy || 'admin',
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review rejected successfully', review });
  } catch (error) {
    console.error('Error rejecting review:', error);
    res.status(500).json({ error: 'Failed to reject review' });
  }
});

// Delete a review
router.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;

