import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button2 from '../../Components/Button 2';
import { supabase } from '../../supabaseClient';
import { useLocation } from 'react-router-dom';

const Register = () => {
   const location = useLocation();
  const role = location.state?.role;

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role, // Pass the role to user_metadata
          },
        },
      });

      if (error) {
        console.error('Supabase signup error:', error.message);
        alert('Signup failed: ' + error.message);
        return;
      }
      
      const user = data.user;

      if (user) {
        // Correctly save the user and role to the 'users' table
        await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email,
              role: user.user_metadata.role, // Access the role from user_metadata
            },
          ]);

        console.log('User signed up successfully:', user);
       navigate('/update-profile', { state: { userEmail: email } }); // Navigate to profile update after signup
      }
      
    } catch (error) {
      console.error('An unexpected error occurred:', error.message);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <Header />

      {/* Grid Section */}
      <h1 style={{ margin: '0px', color: '#e94e9f', textAlign: 'left' }}>Sign Up to start talking right now...</h1>

      {/* Inputs connected to state */}
      <div style={{ width: '100%', maxWidth: '320px', marginBottom: '20px', marginTop: '25%' }}>
        <input
          placeholder="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={{ width: '100%', maxWidth: '320px', marginBottom: '25%' }}>
        <input
          placeholder="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <Link to="/login" style={styles.signInLink}>Sign in</Link>
      </div>

      {/* Main Text */}
      <div style={styles.textContainer}>
        <p style={styles.mainText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>

      {/* Sign up button calls the correct handler */}
      <Button2 text="Sign Up" onClick={handleSignup} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    boxSizing: 'border-box',
    maxWidth: '360px',
    minWidth: '360px',
  },
  input: {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #ccc',
    padding: '10px 0',
    background: 'transparent',
    fontSize: '18px',
    color: '#333',
    outline: 'none',
  },
  signInLink: {
    display: 'block',
    marginTop: '10px',
    textAlign: 'center',
    color: '#000',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  textContainer: {
    textAlign: 'center',
    marginBottom: '30px',
    maxWidth: '320px',
    flexShrink: 1,
  },
  mainText: {
    fontSize: '12px',
    textAlign: 'left',
    fontWeight: '600',
    lineHeight: '1.3',
    color: '#333',
  },
};

export default Register;