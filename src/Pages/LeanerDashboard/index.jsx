import React, { useState, useEffect } from 'react';
import Header from "../../Components/Header";
import { supabase } from '../../supabaseClient';

const LearnerDashUpdate = () => { // Removed userEmail from props

    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState(null); // New state for email from localStorage
    const [totalCalls, setTotalCalls] = useState(0);
    const [totalPracticeTime, setTotalPracticeTime] = useState(0);
    const [minutesRemaining, setMinutesRemaining] = useState(0);
    const [averageScore, setAverageScore] = useState('N/A');
    const [imgUrl, setImgUrl] = useState(null);
    const [error, setError] = useState(null);

     useEffect(() => {
        const fetchProfileData = async () => {
          setLoading(true);
          setError(null);
    
          try {
            // Fetch the user's profile from the public.profiles table
            const { data, error } = await supabase
              .from('users')
              .select('imageUrl')
              .eq('email', userEmail) // Assuming you have an 'email' column in your profiles table
              .single();
    
            if (error) {
              throw error;
            }
    
            if (data) {
              setImgUrl(data.imageUrl);
            } else {
              setImgUrl(null);
            }
          } catch (err) {
            console.error('Error fetching profile:', err.message);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        if (userEmail) {
          fetchProfileData();
        }
      }, [userEmail]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setUserEmail(storedEmail);
        } else {
            setLoading(false);
            // Handle case where no email is found, e.g., redirect to login
        }
    }, []);

    useEffect(() => {
        const fetchLearnerData = async () => {
            if (!userEmail) return;

            setLoading(true);

            // Fetch user-specific data from 'users' table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('minutes_remaining')
                .eq('email', userEmail)
                .single();

            if (userError) {
                console.error("Error fetching user data:", userError.message);
            } else if (userData) {
                setMinutesRemaining(userData.minutes_remaining);
            }

            // Fetch call data from 'calls' table
            const { data: callData, error: callError } = await supabase
                .from('calls')
                .select('duration_seconds')
                .eq('learner_email', userEmail);

            if (callError) {
                console.error("Error fetching call data:", callError.message);
            } else if (callData) {
                if (callData.length > 0) {
                    const totalDuration = callData.reduce((sum, call) => sum + call.duration_seconds, 0);
                    setTotalPracticeTime(totalDuration);
                    setTotalCalls(callData.length);
                }
            }

            // Fetch review data from 'reviews' table
            const { data: reviewData, error: reviewError } = await supabase
                .from('reviews')
                .select('rating')
                .eq('reviewed_by_email', userEmail);

            if (reviewError) {
                console.error("Error fetching review data:", reviewError.message);
            } else if (reviewData) {
                if (reviewData.length > 0) {
                    const totalRating = reviewData.reduce((sum, review) => sum + review.rating, 0);
                    const avgRating = totalRating / reviewData.length;
                    setAverageScore(avgRating.toFixed(1));
                }
            }

            setLoading(false);
        };

        if (userEmail) {
            fetchLearnerData();
        }
    }, [userEmail]);

    const styles = {
        parentContainer: {
      display: "flex",
      justifyContent: "center", /* This centers the child horizontally */
    },
        outerContainer: {
           display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffffff',
        boxSizing: 'border-box',
        maxWidth: '360px',
        marginLeft:'35px',
        marginRight:'35px',
        width:'100%',
        },
        loadingContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
            textAlign: "center",
        },
        profileCard: {
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            marginBottom: "10px",
        },
        imageContainer: {
            width: "80%",
            height: "auto",
            borderRadius: "20px",
            margin: "10px auto",
            justifyContent: "center",
            alignItems: "center",
        },
        profileImage: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "20px",
        },
        infoContainer: {
            width: "100%",
            textAlign: "left",
            marginBottom: "20px",
            paddingLeft: "10px",
        },
        nameAndAge: {
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "0px",
            textAlign: "left",
        },
        location: {
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "5px",
            marginTop: '0px',
            textAlign: "left",
        },
        country: {
            fontSize: "18px",
            color: "#777",
            marginBottom: "auto",
        },
        endCallButton: {
            backgroundColor: "#e14e97",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            textTransform: "capitalize",
            fontFamily: "'Funnel Display', sans-serif",
        },
    };

    const stylebutton2 = {
        width: "100%",
        padding: "15px 20px",
        backgroundColor: "#f9e7f3",
        color: "#e14e97",
        fontSize: "18px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.2s ease-in-out",
        marginTop: "20%",
        textTransform: "capitalize",
        fontFamily: "'Funnel Display', sans-serif",
    };

    const buttonStyle = {
        width: "100%",
        padding: "20px 20px",
        backgroundColor: "#e14e97",
        color: "white",
        fontSize: "20px",
        fontWeight: "normal",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.2s ease-in-out",
        textTransform: "capitalize",
        fontFamily: "'Funnel Display', sans-serif",
    };

    const stylebutton3 = {
        width: "100%",
        padding: "20px 20px",
        backgroundColor: "#f9e7f3",
        color: "#e14e97",
        fontSize: "20px",
        fontWeight: "normal",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.2s ease-in-out",
        marginTop: "10%",
        
        textTransform: "capitalize",
        fontFamily: "'Funnel Display', sans-serif",
    };

    const handleUpgradeClick = () => {
        window.history.back();
    }

    const handleBackClick = () => {
        window.history.back();
    }

    if (loading) {
        return (
            <div style={styles.parentContainer}>
            <div style={styles.outerContainer}>
                <Header />
                <h1 style={{ margin: 'auto', textAlign: 'center' }}>...</h1>
            </div>
            </div>
        );
    }

    return (
        <div style={styles.parentContainer}>
        <div style={styles.outerContainer}>
            <Header />
           
                <div style={{ backgroundColor: "#f9e7f3", padding: "20px", borderRadius: "30px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",width:'90%', maxWidth: "360px", margin: "0 auto" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            maxWidth: "360px",
                            gap:'20px'
                        }}
                    >
                        <div>
                            <h1 style={{ margin: "0px", color: "#000000", fontSize:"32px", fontWeight:"bold", lineHeight:"1.2" }}>
                                Hola, Learner
                            </h1>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <img
                                src={
                                    imgUrl ||
                                    "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                                }
                                width={"50px"}
                                height={"50px"}
                                style={{
                                    borderRadius: "10px",
                                    objectFit: "cover",
                                    margin: "0 auto",
                                }}
                                alt="Profile"
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
                        <h4 style={{ fontSize: '20px', margin: '0px' }}>{totalCalls} Calls, </h4>
                        <h4 style={{ fontSize: '20px', margin: '0px' }}>
                            &nbsp;{averageScore}/5 Score
                        </h4>
                    </div>
                    <h4 style={{ marginTop: "15%", marginBottom: "0px" }}>Total practice time</h4>
                    <h1 style={{ margin: "0px", color: "#000000" }}>
                        {formatTime(totalPracticeTime)}
                    </h1>
                    <hr style={{ border: '0', height: '2px', backgroundColor: '#000', margin: '15px 0' }} />
                    <h4 style={{ marginBottom: "0px" }}>Minutes Remaining</h4>
                    <h1 style={{ margin: "0px", color: "#000000" }}>
                        {String(minutesRemaining).padStart(2, '0')}:00
                    </h1>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'15px'}}>
                <div style={{ position: 'fixed', bottom: '135px', width: '80%', maxWidth: '360px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
                    <button onClick={handleBackClick} style={stylebutton3}>
                        Back
                    </button>
                </div>
                <div style={{ position: 'fixed', bottom: '50px', width: '80%', maxWidth: '360px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
                    <button onClick={handleUpgradeClick} style={buttonStyle}>
                        Upgrade
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default LearnerDashUpdate;