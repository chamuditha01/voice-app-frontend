import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Button from '../../Components/Button 1';
import { useRef } from 'react';
import { supabase } from '../../supabaseClient';

const HomeScreen = () => {
    const navigate = useNavigate();
    const [availableUsers, setAvailableUsers] = useState([]);
    const [gridUsers, setGridUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const usersPerPage = 4;
    const intervalRef = useRef(null);

    // This useEffect handles data fetching from Supabase
    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                 // Fetch all users with the 'speaker' role

            if (error) {
                console.error("Error fetching users:", error.message);
            } else {
                setAvailableUsers(data);
            }
        };

        fetchUsers();
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
        <div style={styles.parentContainer}>
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
                                <img draggable="false" src={user.imageUrl || 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D'} alt={`Profile ${index}`} style={styles.profileImage} />
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
        marginLeft:'35px',
        marginRight:'35px',
        width:'100%',
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
        gap: '10px',
        backgroundColor: '#f0f2f5',
        borderRadius: '30px',
        padding: '15px',
       
        
    },
    gridRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
    },
    gridItem: {
        width: 'calc(23% - 6px)',
        aspectRatio: '1 / 1',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
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
        margin: "10% auto",
        maxWidth: '300px',
        flexShrink: 1,
    },
    mainText: {
        fontSize: '32px',
        fontWeight: '600',
        lineHeight: '1.2',
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