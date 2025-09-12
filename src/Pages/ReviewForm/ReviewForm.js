import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

function ReviewForm({ callId, reviewedId, reviewerId }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ call_id: callId, reviewer_id: reviewerId, reviewed_id: reviewedId, rating, feedback }]);

      if (error) throw error;
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Review submission error:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmitReview}>
      <h3>Rate this speaker</h3>
      <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" required />
      <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Optional feedback" />
      <button type="submit">Submit Review</button>
    </form>
  );
}
export default ReviewForm;