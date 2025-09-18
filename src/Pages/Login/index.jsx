import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button2 from '../../Components/Button 2';
import { supabase } from '../../supabaseClient';

const LoginScreen = ({ role }) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Supabase login error:', error.message);
                alert('Login failed: ' + error.message);
            } else {
                console.log('User logged in successfully:', data.user);

                // Fetch the user's session to get their role
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session fetch error:', sessionError.message);
                    alert('Failed to get user session.');
                    return;
                }

                const user = sessionData.session?.user;
                const userRole = user?.user_metadata?.role;

                if (user && userRole) {
                    // Fetch additional user profile data from the `users` table
                    const { data: profileData, error: profileError } = await supabase
                        .from('users')
                        .select('name, age, bio, imageUrl, location')
                        .eq('email', user.email)
                        .single();

                    if (profileError) {
                        console.error('Error fetching user profile data:', profileError.message);
                        alert('Failed to fetch user profile data.');
                        // You can choose to proceed with only email and role or block login
                        // For now, we will proceed.
                    } else {
                        // Save all user data to local storage
                        localStorage.setItem('userEmail', user.email);
                        localStorage.setItem('userRole', userRole);
                        localStorage.setItem('userName', profileData.name || '');
                        localStorage.setItem('userAge', profileData.age || '');
                        localStorage.setItem('userBio', profileData.bio || '');
                        localStorage.setItem('userImageUrl', profileData.imageUrl || '');
                        localStorage.setItem('userLocation', profileData.location || '');

                        console.log('User data saved to local storage.');
                    }

                    // CONDITIONAL NAVIGATION BASED ON ROLE
                    if (userRole === 'learner') {
                        navigate('/speakers');
                    } else if (userRole === 'speaker') {
                        navigate('/sp-dashboard');
                    } else {
                        navigate('/home');
                    }
                } else {
                    console.error('User or role data is missing after login.');
                    alert('An unexpected error occurred. Please try again.');
                }
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
            <h1 style={{ margin: '0px', color: '#e14e97', textAlign: 'left' }}>Sign In to start talking right now...</h1>

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
                <Link to="/signup1" style={styles.signInLink}>Sign Up</Link>
            </div>

            {/* Main Text */}
            <div style={styles.textContainer}>
                <p style={styles.mainText}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>

            {/* Sign up button calls the correct handler */}
            <Button2 text="Sign In" onClick={handleLogin} />
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
    color: '#000000',
    outline: 'none',
    fontWeight: "600",
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
        textAlign: 'left',
        marginBottom: '20px',
        maxWidth: '320px',
        flexShrink: 1,
    },
    mainText: {
        fontSize: '12px',
        textAlign: 'left !important',
        fontWeight: '600',
        lineHeight: '1.3',
        color: '#333',
    },
};

export default LoginScreen;