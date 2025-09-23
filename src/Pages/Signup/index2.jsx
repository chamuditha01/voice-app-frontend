import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button2 from '../../Components/Button 2';
import { supabase } from '../../supabaseClient';
import { useLocation } from 'react-router-dom';
import Button4 from '../../Components/Button4';

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
              remaining_minutes: 50
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
    <div style={styles.parentContainer}>
    <div style={styles.container}>
      {/* Header */}
      <Header />

      {/* Grid Section */}
      <h1 style={{ margin: '0px', color: '#e14e97', textAlign: 'left',fontSize:'32px', lineHeight:'1.2', }}>Sign Up to start talking right now...</h1>

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

      <div style={{ width: '100%', maxWidth: '320px', marginBottom: '15%' }}>
        <input
          placeholder="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        
      </div>

      {/* Main Text */}
      <div style={styles.textContainer}>
        <p style={styles.mainText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>

      <div style={styles.textContainer}>
                <p style={styles.mainText}>
                    Lorem ipsum dolor sit amet, consectetur ipsum adipiscing <a style={{textDecoration:'none'}} href='/login'><span style={{color:'#e14e97'}}>Sign In</span></a> here. 
                </p>
            </div>

      {/* Sign up button calls the correct handler */}
      <Button4 text="Sign Up" onClick={handleSignup} />
    </div>
    </div>
  );
};

const styles = {
  parentContainer: {
      display: "flex",
      justifyContent: "center", /* This centers the child horizontally */
    },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    maxWidth: '360px',
  marginRight:'35px',
  marginLeft:'35px',
  width:'100%',
  },
  input: {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #ccc',
    padding: '10px 0px',
    background: 'transparent',
    fontSize: '32px',
    lineHeight: '1.2',
    color: '#000000',
    outline: 'none',
    fontWeight: "normal",
    fontFamily: "'Funnel Display', sans-serif",  // 👈 Added
},
  signInLink: {
    display: 'block',
    marginTop: '10px',
    textAlign: 'left',
    color: '#000',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  textContainer: {
    textAlign: 'center',
    
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