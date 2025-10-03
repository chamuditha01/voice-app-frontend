import  { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import CallComponent from '../Twillio/CallComponent'; // This is the component that will handle the call

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        navigate('/'); // Redirect to login if not authenticated
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>Your current role is {user.user_metadata.role}.</p>
      <CallComponent userId={user.id} />
    </div>
  );
}

export default Dashboard;