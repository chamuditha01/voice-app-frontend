import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import CallComponent from '../Twillio/CallComponent';

function LearnerDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableSpeaker, setAvailableSpeaker] = useState(null);
  const [reviews, setReviews] = useState([]); // State to store learner's reviews
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      // Fetch the available speaker
      const findSpeaker = async () => {
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'speaker')
          .eq('is_available', true)
          .limit(1);
    
        if (error) {
          console.error('Error finding speaker:', error);
          return;
        }
    
        if (data.length > 0) {
          setAvailableSpeaker(data[0]);
        }
      };
      findSpeaker();

      // Fetch the learner's own reviews
      const fetchReviews = async () => {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('rating, feedback, reviewed_email')
          .eq('reviewed_email', user.email);

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          return;
        }
        setReviews(reviewsData);
      };
      fetchReviews();
    }
  }, [user]);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>User not found. Redirecting...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome, Learner!</h1>
      <p style={styles.greeting}>You are logged in as: <span style={styles.highlight}>{user.email}</span></p>
      <div style={styles.card}>
        
       <CallComponent email={user.email} role="learner" />
      </div>

      {/* New section for displaying the learner's reviews */}
      <div style={styles.reviewsContainer}>
        <h2 style={styles.reviewsHeading}>Your Past Reviews</h2>
        <div style={styles.reviewsList}>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} style={styles.reviewCard}>
                <p style={styles.reviewRating}>You rated: {review.rating} / 5</p>
                {review.feedback && <p style={styles.reviewFeedback}>"{review.feedback}"</p>}
              </div>
            ))
          ) : (
            <p>You haven't left any reviews yet.</p>
          )}
        </div>
      </div>

      <button onClick={() => supabase.auth.signOut()} style={styles.logoutButton}>
        Log Out
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#e9f5ff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#005a9c',
    marginBottom: '10px',
  },
  greeting: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '30px',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '500px',
    marginBottom: '20px',
  },
  cardHeading: {
    fontSize: '1.8rem',
    color: '#007BFF',
    marginBottom: '10px',
  },
  cardText: {
    color: '#555',
    marginBottom: '20px',
  },
  reviewsContainer: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
  },
  reviewsHeading: {
    fontSize: '1.8rem',
    color: '#333',
  },
  reviewsList: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  reviewRating: {
    margin: '0',
    fontWeight: 'bold',
  },
  reviewFeedback: {
    margin: '5px 0 0 0',
    fontStyle: 'italic',
    color: '#555',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
};

export default LearnerDashboard;
