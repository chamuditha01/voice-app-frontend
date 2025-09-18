import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button from '../../Components/Button 1';

const HomeScreen = () => {
    const navigate = useNavigate();
    const [availableUsers, setAvailableUsers] = useState([]);
    const [gridUsers, setGridUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const wsRef = useRef(null);

    const usersPerPage = 4;
    const intervalRef = useRef(null);

    // This useEffect handles the WebSocket connection and data fetching
    useEffect(() => {
        // Initialize WebSocket connection
        wsRef.current = new WebSocket('ws://localhost:8080');

        wsRef.current.onopen = () => {
            console.log('WebSocket connection opened from HomeScreen');
            // Send user info to register with the server, which should trigger a user_list broadcast
            wsRef.current.send(JSON.stringify({
                type: 'user_info',
                email: 'homescreen_guest', // Use a temporary identifier for non-logged-in users
                role: 'guest'
            }));
        };

        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'user_list') {
                console.log('Received user list:', data.users);
                // Filter out the guest user itself and any users in a call
                const filteredUsers = data.users.filter(user => user.role !== 'guest' && !user.inCall);
                setAvailableUsers(filteredUsers);
            }
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Clean up the WebSocket connection on component unmount
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    // Set up the interval for swapping profiles
    useEffect(() => {
        if (availableUsers.length > usersPerPage) {
            intervalRef.current = setInterval(() => {
                setCurrentPage(prevPage => (prevPage + 1) % Math.ceil(availableUsers.length / usersPerPage));
            }, 3000); // Swaps every 3 seconds
        } else {
             // Clear the interval if there are not enough users to swap
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setCurrentPage(0); // Reset to the first page of users
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [availableUsers]);

    // Update grid users when the current page or available users change
    useEffect(() => {
        const startIndex = currentPage * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const currentGridUsers = availableUsers.slice(startIndex, endIndex);
        setGridUsers(currentGridUsers);
    }, [availableUsers, currentPage]);

    const handleSignInWithEmail = () => {
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <Header />

            {/* Grid Section */}
            <div style={styles.gridSection}>
                <div style={styles.gridContainer}>
                    {/* Dynamic grid profiles */}
                    <div style={styles.gridRow}>
                        {gridUsers.map((user, index) => (
                            <div key={user.id} style={styles.gridItem}>
                                <img src={user.imageUrl || 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D'} alt={`Profile ${index}`} style={styles.profileImage} />
                            </div>
                        ))}
                        {/* Render empty white squares if there are fewer than 4 users */}
                        {[...Array(usersPerPage - gridUsers.length)].map((_, index) => (
                            <div key={`empty-${index}`} style={styles.gridItem}></div>
                        ))}
                    </div>
                    {/* Remaining rows with white background */}
                    {[...Array(3)].map((_, rowIndex) => (
                        <div key={rowIndex} style={styles.gridRow}>
                            {[...Array(4)].map((_, itemIndex) => (
                                <div key={itemIndex} style={styles.gridItem}></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Text */}
            <div style={styles.textContainer}>
                <p style={styles.mainText}>
                    Talk with real people around the world, improve daily
                </p>
            </div>

            {/* Sign in button */}
            <Button text="Sign in with Email" onClick={handleSignInWithEmail} />
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
        minWidth: '360px',
        boxSizing: 'border-box',
        maxWidth: '360px',
        
    },
    header: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '10px',
        paddingTop: '10px',
        marginBottom: '30px',
    },
    menuIcon: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '24px',
        height: '18px',
        cursor: 'pointer',
    },
    menuLine: {
        width: '100%',
        height: '3px',
        backgroundColor: '#333',
        borderRadius: '2px',
    },
    gridSection: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        flexShrink: 1,
        marginBottom: '30px',
    },
    gridContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '15px',
        padding: '15px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
        maxWidth: '300px',
        width: '100%',
    },
    gridRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
    },
    gridItem: {
        width: 'calc(25% - 6px)',
        aspectRatio: '1 / 1',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '12px',
    },
    textContainer: {
        textAlign: 'center',
        marginBottom: '30px',
        maxWidth: '300px',
        flexShrink: 1,
    },
    mainText: {
        fontSize: '24px',
        fontWeight: '600',
        lineHeight: '1.3',
        color: '#333',
    },
    buttonContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 'auto',
    },
    appleSignInButton: {
        backgroundColor: '#000000',
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '15px 30px',
        borderRadius: '15px',
        border: 'none',
        cursor: 'pointer',
        maxWidth: '350px',
        transition: 'background-color 0.3s ease',
    },
};

export default HomeScreen;