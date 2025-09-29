import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button from '../../Components/Button 1';
import { supabase } from '../../supabaseClient';
import './index.css';

const HomeScreen = () => {
    const navigate = useNavigate();
    const [availableUsers, setAvailableUsers] = useState([]);
    const [gridUsers, setGridUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const usersPerPage = 8;
    const intervalRef = useRef(null);

    // This useEffect handles data fetching from Supabase
    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*');

            if (error) {
                console.error("Error fetching users:", error.message);
            } else {
                setAvailableUsers(data);
                console.log("Users fetched successfully:", data.length);
            }
        };

        fetchUsers();
    }, []);

    // Set up the interval for swapping pages
    useEffect(() => {
        const totalPages = Math.ceil(availableUsers.length / usersPerPage);
        
        if (availableUsers.length > usersPerPage) {
            intervalRef.current = setInterval(() => {
                setCurrentPage(prevPage => {
                    const nextPage = (prevPage + 1) % totalPages;
                    console.log('Swapping to page', nextPage);
                    return nextPage;
                });
            }, 2000); // Swaps every 2 seconds
        }

        // Cleanup function to clear the interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [availableUsers]);

    // This useEffect updates the grid with shuffled users and placeholders
    useEffect(() => {
        const startIndex = currentPage * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        let currentGridUsers = availableUsers.slice(startIndex, endIndex);

        // Shuffle the current set of users to randomize their positions
        const shuffledUsers = shuffleArray(currentGridUsers);
        
        // Add placeholders if needed
        const placeholdersNeeded = usersPerPage - shuffledUsers.length;
        const placeholders = Array(placeholdersNeeded).fill({ isPlaceholder: true });

        setGridUsers([...shuffledUsers, ...placeholders]);
        console.log("Grid users updated.");
    }, [availableUsers, currentPage]);

    // Function to shuffle an array (Fisher-Yates algorithm)
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handleSignInWithEmail = () => {
        navigate('/login');
    };

    return (
        <div className="parentContainer">
        {/* Use className="container" */}
        <div className="container">
            {/* Header */}
            <Header />

            {/* Grid Section */}
            {/* Use className="gridSection" */}
            <div className="gridSection">
                {/* Use className="gridContainer" */}
                <div className="gridContainer">
                    {/* Render all grid items in a single, wrapping container */}
                    {gridUsers.map((user, index) => (
                        // Use className="gridItem"
                        <div key={user.id || `placeholder-${index}`} className="gridItem">
                            <img
                                draggable="false"
                                src={user.imageUrl || 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4855.jpg'}
                                alt={`Profile ${index}`}
                                // Use className="profileImage" with conditional inline style for opacity
                                className="profileImage"
                                style={user.imageUrl ? {} : { opacity: 0 }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Text */}
            {/* Use className="textContainer" */}
            <div className="textContainer">
                <p className="mainText1">
                    Talk with real people around the world, improve daily
                </p>
            </div>

            {/* Sign in button */}
            {/* Assuming 'Button' is a custom component, no change needed here,
               but if it was a standard HTML button using a style from the
               original styles object, you would change it to a className. */}
            <Button text="Sign in with Email" onClick={handleSignInWithEmail} />
        </div>
    </div>
    );
};


export default HomeScreen;
