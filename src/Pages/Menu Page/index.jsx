import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button2 from '../../Components/Button 2';
import { supabase } from '../../supabaseClient';

const MenuPage = ({ role }) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Supabase sign out error:', error.message);
                alert('Sign out failed: ' + error.message);
            } else {
                console.log('User signed out successfully');
                // Clear local storage
                localStorage.clear();
                navigate('/'); // Redirect to home or login page after sign out
            }
        } catch (error) {
            console.error('An unexpected error occurred during sign out:', error.message);
            alert('An unexpected error occurred during sign out.');
        }
    };

    const handleEditProfile = () => {
        navigate('/update-profile', { state: { userEmail: localStorage.getItem('userEmail') } });
    }

    const handleDashboard = () => {
        const role = localStorage.getItem('userRole');
        if (role === 'learner') {
            navigate('/learnerdashboard');
        } else if (role === 'speaker') {
            navigate('/speakerdashboard');
        } else {
            console.error('Unknown user role:', role);
            alert('Unknown user role. Please log in again.');
            navigate('/');
        }
    }
    

    return (
        <div style={styles.container}>
            {/* Header */}
            <Header />

            {/* Grid Section */}
            <h1 style={{ margin: '0px', color: '#e14e97', textAlign: 'left' }}>Hola, </h1>

            {/* Inputs connected to state */}
            <div style={{ width: '100%', maxWidth: '320px', marginBottom: '0px', marginTop: '25%' }}>
    <h1 style={{ margin: '0px', color: '#000', textAlign: 'left' ,cursor: 'pointer'}} onClick={handleEditProfile}>Edit profile </h1>
    <hr style={{ border: '0', height: '2px', backgroundColor: '#000', margin: '15px 0'}} />
</div>
<div style={{ width: '100%', maxWidth: '320px', marginBottom: '0px' }}>
    <h1 style={{ margin: '0px', color: '#000', textAlign: 'left',cursor: 'pointer' }} onClick={handleDashboard}>Dashboard</h1>
    <hr style={{ border: '0', height: '2px', backgroundColor: '#000', margin: '15px 0' }} />
</div>
<div style={{ width: '100%', maxWidth: '320px', marginBottom: '0px' }}>
    <h1 style={{ margin: '0px', color: '#000', textAlign: 'left' ,cursor: 'pointer' }} onClick={handleSignOut}>Sign Out</h1>
    <hr style={{ border: '0', height: '2px', backgroundColor: '#000', margin: '15px 0' }} />
</div>
            {/* Main Text */}
            <div style={styles.textContainer}>
                <p style={styles.mainText}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>

            
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
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
        marginTop:'30px',
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

export default MenuPage;