import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button2 from '../../Components/Button 2';
import { supabase } from '../../supabaseClient';
import CallComponent from '../Twillio/CallComponent';

const ProfileScreen = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [role, setRole] = useState(null);
    
    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');
        console.log("User Email:", userEmail);
        console.log("User Role:", userRole);
        setEmail(userEmail);
        setRole(userRole);
    }, []); // The empty dependency array ensures this effect runs only once after the initial render


    return (
        <div >
            <CallComponent email={email} role={role} />
        </div>
    );
};



export default ProfileScreen;