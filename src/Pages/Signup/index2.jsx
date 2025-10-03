import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';

import { supabase } from '../../supabaseClient';
import { useLocation } from 'react-router-dom';
import Button4 from '../../Components/Button4';
import './index.css';

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
          role: role,
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
      // Correctly check for errors on the insert operation
      const { data: userData, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            role: user.user_metadata.role,
            minutes_remaining: 50
          },
        ]);

        console.log('Insert operation result:', userData, insertError);

      if (insertError) {
        // This is the line that will now show you the real error
        console.error('Error inserting user data:', insertError.message);
        alert('Failed to save profile. Please try again.');
        return;
      }

      console.log('User signed up successfully:', user);
      console.log('User role:', user.user_metadata.role);
      navigate('/update-profile', { state: { userEmail: user.email } });
    }

  } catch (error) {
    console.error('An unexpected error occurred:', error.message);
    alert('An unexpected error occurred.');
  }
};

  return (
    <div className="parentContainer">
    <div className="container">
        {/* Header */}
        <Header />

        {/* Title */}
        <h1 
            style={{ 
                margin: '0px', 
                color: '#e14e97', 
                textAlign: 'left',
                fontSize: '32px', 
                lineHeight: '1.2' 
            }}
        >
            Sign Up to start talking right now...
        </h1>

        {/* Email Input */}
        <div className='customInputWrapper'>
            <input
                placeholder="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input1"
            />
        </div>

        {/* Password Input */}
        <div className='passwordwrapper'>
            <input
                placeholder="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input1"
            />
        </div>

        {/* Main Text */}
        <div className="textContainer">
            <p className="mainText">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
             <p className="mainText">
                Lorem ipsum dolor sit amet, consectetur ipsum adipiscing <a style={{textDecoration:'none'}} href='/login'><span style={{color:'#e14e97'}}>Sign In</span></a> here. 
            </p>
        </div>

        

        {/* Sign up button calls the correct handler */}
        <Button4 text="Sign Up" onClick={handleSignup} />
    </div>
</div>
  );
};



export default Register;