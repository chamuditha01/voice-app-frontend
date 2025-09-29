import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button2 from '../../Components/Button 2';
import { supabase } from '../../supabaseClient';
import { useEffect } from 'react';
import './index.css';

const MenuPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); // Default role is 'learner'

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const handleSignOut = async (e) => {
    e.preventDefault();
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Supabase sign out error:', error.message);
            console.error('Sign out failed: ' + error.message);
        } else {
            console.log('User signed out successfully');
            
            // Explicitly remove all specified user data from local storage
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            localStorage.removeItem('userAge');
            localStorage.removeItem('userBio');
            localStorage.removeItem('userImageUrl');

            // NOTE: If you strictly meant to remove ALL data, you could replace the
            // above lines with the more aggressive localStorage.clear();
            
            navigate('/'); // Redirect to home or login page after sign out
        }
    } catch (error) {
        console.error('An unexpected error occurred during sign out:', error.message);
        console.error('An unexpected error occurred during sign out.');
    }
};

    const handleEditProfile = () => {
        navigate('/update-profile', { state: { userEmail: localStorage.getItem('userEmail') } });
    }

    const handleDashboard = () => {
        const role1 = localStorage.getItem('userRole');
        if (role1 === 'learner') {
            navigate('/learnerdashboard');
        } else if (role === 'speaker') {
            navigate('/speakerdashboard');
        } else {
            console.error('Unknown user role:', role1);
            // Replaced alert with console.error as per instructions
            console.error('Unknown user role. Please log in again.');
            navigate('/');
        }
    }
    
    // Function to handle the close button click
    const handleClose = () => {
        navigate(-1);
    };

    return (
        <div className="parentContainer">
    <div className="container">
        {/* Header with close icon logic */}
        <Header showCloseButton={true} onClose={handleClose} />

        {/* Welcome Text */}
        <h1 
            style={{ 
                margin: '0px', 
                color: '#e14e97', 
                textAlign: 'left',
                fontSize: "32px", 
                lineHeight: '1.2' 
            }}
        >
            Hola, {role}
        </h1>

        {/* Profile Link */}
        <div style={{ width: '100%', maxWidth: '320px', marginBottom: '0px', marginTop: '25%', fontWeight: 'normal' }}>
            <h1 
                style={{ 
                    margin: '0px', 
                    color: '#000', 
                    textAlign: 'left', 
                    cursor: 'pointer',
                    fontWeight: 'normal',
                    fontSize: '32px',
                    lineHeight: '1.2'
                }} 
                onClick={handleEditProfile}
            >
                Profile
            </h1>
            <hr style={{ border: '0', height: '1px', backgroundColor: 'rgb(204, 204, 204)', marginTop: '10px', marginBottom: '30px' }} />
        </div>

        {/* Dashboard Link */}
        <div style={{ width: '100%', maxWidth: '320px', marginBottom: '0px' }}>
            <h1 
                style={{ 
                    margin: '0px', 
                    color: '#000', 
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 'normal',
                    fontSize: '32px',
                    lineHeight: '1.2'
                }} 
                onClick={handleDashboard}
            >
                Dashboard
            </h1>
            <hr style={{ border: '0', height: '1px', backgroundColor: 'rgb(204, 204, 204)', marginTop: '10px', marginBottom: '30px' }} />
        </div>

        {/* Sign Out Link */}
        <div style={{ width: '100%', maxWidth: '320px', marginBottom: '0px' }}>
            <h1 
                style={{ 
                    margin: '0px', 
                    color: '#000', 
                    textAlign: 'left', 
                    cursor: 'pointer',
                    fontWeight: 'normal',
                    fontSize: '32px',
                    lineHeight: '1.2'
                }} 
                onClick={handleSignOut}
            >
                Sign Out
            </h1>
            <hr style={{ border: '0', height: '1px', backgroundColor: 'rgb(204, 204, 204)', marginTop: '10px', marginBottom: '20px' }} />
        </div>

        {/* Main Text */}
        <div className="textContainer">
            <p className="mainText">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
        </div>
    </div>
</div>
    );
};



export default MenuPage;