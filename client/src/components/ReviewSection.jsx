import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/api';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const ReviewSection = ({ propertyId, initialReviews = [], onReviewAdded }) => {
  const { user, showToast } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to leave a review', 'warning');
      return;
    }

    if (!comment.trim()) {
      showToast('Please enter your review comments', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await reviewService.createReview({
        propertyId,
        rating,
        comment,
      });

      const newReview = res.data.data;
      // Update local reviews list
      const existingIdx = reviews.findIndex((r) => r.user?._id === user._id || r.user === user._id);
      let updatedList;
      if (existingIdx !== -1) {
        updatedList = [...reviews];
        updatedList[existingIdx] = newReview;
      } else {
        updatedList = [newReview, ...reviews];
      }
      setReviews(updatedList);
      setComment('');
      showToast('Thank you! Your review has been published.', 'success');

      if (onReviewAdded) onReviewAdded(newReview);
    } catch (error) {
      showToast(error.message || 'Failed to submit review', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <MessageSquare size={22} color="#3b82f6" />
        <h3 style={{ fontSize: '1.35rem', color: '#fff', margin: 0 }}>
          Tenant Reviews & Ratings ({reviews.length})
        </h3>
      </div>

      {/* Submit Review Form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="glass-panel"
          style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            background: 'rgba(15, 23, 42, 0.65)',
          }}
        >
          <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.75rem' }}>
            Write a Verified Review
          </h4>

          {/* Star Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginRight: '0.5rem' }}>
              Your Rating:
            </span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.2rem',
                }}
              >
                <Star
                  size={22}
                  fill={(hoverRating || rating) >= star ? '#fbbf24' : 'none'}
                  color={(hoverRating || rating) >= star ? '#fbbf24' : '#475569'}
                />
              </button>
            ))}
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fbbf24', marginLeft: '0.5rem' }}>
              {rating}.0 / 5.0
            </span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <textarea
              rows={3}
              required
              placeholder="Describe your living experience, building management, acoustics, neighborhood, and amenities..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="glass-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-sm"
          >
            <Send size={15} />
            {loading ? 'Posting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#94a3b8',
            fontSize: '0.9rem',
          }}
        >
          <span>Sign in to your HouseHunt account to post a rating and review for this property.</span>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          No reviews have been written yet for this property. Be the first to share your experience!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((r, i) => (
            <div
              key={r._id || i}
              className="glass-panel"
              style={{
                padding: '1.25rem 1.5rem',
                background: 'rgba(15, 23, 42, 0.45)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={r.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={r.user?.name || 'Tenant'}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
                      {r.user?.name || 'Verified Tenant'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= r.rating ? '#fbbf24' : 'none'}
                      color={s <= r.rating ? '#fbbf24' : '#475569'}
                    />
                  ))}
                </div>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
