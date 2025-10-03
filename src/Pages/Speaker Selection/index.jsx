import  { useState, useEffect, } from 'react';
import CallComponent from '../Twillio/CallComponent';

const ProfileScreen = () => {
   
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