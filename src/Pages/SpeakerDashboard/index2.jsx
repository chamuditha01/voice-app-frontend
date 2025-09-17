import React, { useState, useEffect, useRef } from 'react';
import Header from '../../Components/Header';
import { supabase } from '../../supabaseClient';
import CallComponent from '../Twillio/CallComponentSpeaker';
import { useNavigate } from 'react-router-dom';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        boxSizing: 'border-box',
        maxWidth: '360px',
        margin: '0 auto',
        padding: '20px',
    },
    section: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
        marginBottom: '20px',
    },
    heading: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    dataPoint: {
        fontSize: '18px',
        color: '#666',
        marginBottom: '8px',
    },
    dataValue: {
        fontWeight: 'bold',
        color: '#e94e9f',
    },
    divider: {
        borderBottom: '1px solid #eee',
        margin: '15px 0',
    },
    callRequestContainer: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        textAlign: 'center',
        marginTop: '20px',
    },
    callRequestText: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#e94e9f',
        marginBottom: '15px',
    },
    callButtons: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    acceptButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    rejectButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

const SpeakerDashboard2 = () => {
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

export default SpeakerDashboard2;