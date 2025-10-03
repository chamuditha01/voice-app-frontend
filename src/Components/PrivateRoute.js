import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function PrivateRoute({ children, requiredRole }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // No user is logged in, redirect to login page
        navigate('/');
      } else {
        const userRole = user.user_metadata.role;

        // Check if the user's role matches the required role
        if (userRole !== requiredRole) {
          // If roles don't match, redirect to a safe page (e.g., home or login)
          alert("Access denied. You don't have the required permissions.");
          navigate('/'); // Or navigate('/login');
        }
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate, requiredRole]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking auth
  }

  return children; // If authorized, render the child component (the dashboard)
}

export default PrivateRoute;