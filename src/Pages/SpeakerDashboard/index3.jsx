import React, { useState, useEffect } from 'react';
import Header from "../../Components/Header";
import { supabase } from '../../supabaseClient';

const SpeakerDashboard3 = () => {

    const [loading, setLoading] = useState(true);
    const [totalCalls, setTotalCalls] = useState(0);
    const [totalTalkTime, setTotalTalkTime] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [averageScore, setAverageScore] = useState('N/A');
        const [imgUrl, setImgUrl] = useState(null);
        const [error, setError] = useState(null);
        const [userEmail, setUserEmail] = useState(null);

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

    // Helper function to format seconds into HH:MM:SS
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    // Fetch data from Supabase
    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        setUserEmail(email);
        const fetchSpeakerData = async () => {
            setLoading(true);

            // Fetch call data and review data in parallel
            const [callDataResponse, reviewDataResponse] = await Promise.all([
                supabase.from('calls').select('duration_seconds').eq('speaker_email', email),
                supabase.from('reviews').select('rating').eq('reviewed_email', email)
            ]);

            const { data: callData, error: callError } = callDataResponse;
            const { data: reviewData, error: reviewError } = reviewDataResponse;
            console.log(email)
            console.log("Call Data:", callData);
            console.log("Review Data:", reviewData);

            if (callError) {
                console.error("Error fetching call data:", callError.message);
            } else {
                if (callData.length > 0) {
                    const totalDuration = callData.reduce((sum, call) => sum + call.duration_seconds, 0);
                    setTotalTalkTime(totalDuration);
                    
                    // Assuming a rate of $0.05 per minute
                    const earnings = (totalDuration / 60) * 0.05;
                    setTotalEarnings(earnings);
                    setTotalCalls(callData.length);
                } else {
                    setTotalCalls(0);
                    setTotalTalkTime(0);
                    setTotalEarnings(0);
                }
            }

            if (reviewError) {
                console.error("Error fetching review data:", reviewError.message);
            } else {
                if (reviewData.length > 0) {
                    const totalRating = reviewData.reduce((sum, review) => sum + review.rating, 0);
                    const avgRating = totalRating / reviewData.length;
                    setAverageScore(avgRating.toFixed(1));
                }
            }
            
            setLoading(false);
        };

        fetchSpeakerData();
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
        marginBottom: '10px',
        textTransform: "capitalize",
        fontFamily: "'Funnel Display', sans-serif",
    };

    const handleEarningsClick = () => {
        window.history.back();
    }

    const handleBackClick = () => {
        window.history.back();
    }


    return (
        <div style={styles.parentContainer}>
        <div style={styles.outerContainer}>
            <Header />
            
                <div style={{ backgroundColor: "#f9e7f3", padding: "20px", borderRadius: "30px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: "90%", maxWidth: "360px", margin: "0 auto" }}>
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
                                Hola, Speaker
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
                    <h4 style={{ marginTop: "15%", marginBottom: "0px" }}>Total talk time</h4>
                    <h1 style={{ margin: "0px", color: "#000000" }}>
                        {loading ? 'Loading...' : formatTime(totalTalkTime)}
                    </h1>
                    <hr style={{ border: '0', height: '2px', backgroundColor: '#000', margin: '15px 0' }} />
                    <h4 style={{ marginBottom: "0px" }}>Earnings</h4>
                    <h1 style={{ margin: "0px", color: "#000000" }}>
                        {loading ? 'Loading...' : `$${totalEarnings.toFixed(2)}`}
                    </h1>
                </div>
                <div style={{ position: 'fixed', bottom: '135px', width: '80%', maxWidth: '360px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
  <button onClick={handleBackClick} style={stylebutton3}>
    Back
  </button>
</div>

                  <div style={{ position: 'fixed', bottom: '50px', width: '80%', maxWidth: '360px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
  <button onClick={handleEarningsClick} style={buttonStyle}>
    Claim Earnings
  </button>
  </div>
            </div>
        
        </div>
    );
};

export default SpeakerDashboard3;