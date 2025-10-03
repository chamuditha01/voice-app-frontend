import  { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import CallComponent from '../Twillio/CallComponent'; // Assuming this is the correct path

function SpeakerDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [reviews, ] = useState([]); // State to store reviews
  const [averageRating, ] = useState(0); // State for average rating
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndReviews = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('is_available')
            .eq('id', user.id)
            .single();

          if (userError) throw userError;
          setUser(user);
          setIsAvailable(userData.is_available);

          
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndReviews();
  }, [navigate]);

  

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>User not found. Redirecting...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome, Speaker!</h1>
      <p style={styles.greeting}>You are logged in as: <span style={styles.highlight}>{user.email}</span></p>
      <div style={styles.card}>
        
       <CallComponent email={user.email} role="speaker" />
      </div>
      
      {/* New section for displaying ratings and feedback */}
      <div style={styles.reviewsContainer}>
        <h2 style={styles.reviewsHeading}>Your Performance</h2>
        <p style={styles.averageRatingText}>
          Average Rating: {averageRating > 0 ? averageRating : 'No ratings yet'} / 5
        </p>
        <div style={styles.reviewsList}>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} style={styles.reviewCard}>
                <p style={styles.reviewRating}>Rating: {review.rating} / 5</p>
                {review.feedback && <p style={styles.reviewFeedback}>"{review.feedback}"</p>}
              </div>
            ))
          ) : (
            <p>No feedback to display.</p>
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
    backgroundColor: '#f5fff5',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#28a745',
    marginBottom: '10px',
  },
  greeting: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '30px',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#28a745',
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
    color: '#28a745',
    marginBottom: '10px',
  },
  cardText: {
    color: '#555',
    marginBottom: '20px',
  },
  unavailableButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  availableButton: {
    padding: '12px 24px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  callSection: {
    marginTop: '20px',
    borderTop: '1px solid #eee',
    paddingTop: '20px',
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
  averageRatingText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#007BFF',
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

export default SpeakerDashboard;