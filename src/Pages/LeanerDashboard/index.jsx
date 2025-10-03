import  { useState, useEffect } from 'react';
import Header from "../../Components/Header";
import { supabase } from '../../supabaseClient';
import './index.css';

const LearnerDashUpdate = () => { // Removed userEmail from props

    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState(null); // New state for email from localStorage
    const [totalCalls, setTotalCalls] = useState(0);
    const [totalPracticeTime, setTotalPracticeTime] = useState(0);
    const [minutesRemaining, setMinutesRemaining] = useState(0);
    const [averageScore, setAverageScore] = useState('N/A');
    const [imgUrl, setImgUrl] = useState(null);
    const [, setError] = useState(null);

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

   
    const handleUpgradeClick = () => {
        window.history.back();
    }

    const handleBackClick = () => {
        window.history.back();
    }

    if (loading) {
        return (
            <div className="parentContainer">
    <div className="outerContainer">
                <Header />
                <h1 style={{ margin: 'auto', textAlign: 'center' }}>...</h1>
            </div>
            </div>
        );
    }

    return (
       <div className="parentContainer">
    <div className="outerContainer">
        <Header />
        
        <div className="dashcontainer">
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    maxWidth: "360px",
                    gap:'20px'
                }}
            >
                <div>
                    <h1 
                        style={{ 
                            margin: "0px", 
                            color: "#000000", 
                            fontSize:"32px", 
                            fontWeight:"bold", 
                            lineHeight:"1.2" 
                        }}
                    >
                        Hola, Learner
                    </h1>
                </div>
                <div style={{ textAlign: "center" }}>
                    <img
                        src={
                            imgUrl ||
                            "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4855.jpg"
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
            <h1 style={{ margin: "0px", color: "#000000",fontSize:"48px" }}>
                {formatTime(totalPracticeTime)}
            </h1>
            <hr style={{ border: '0', height: '2px', backgroundColor: '#000', margin: '0px 0' }} />
            <h4 style={{ marginBottom: "0px",marginTop:'10px' }}>Minutes Remaining</h4>
            <h1 style={{ margin: "0px", color: "#000000",fontSize:"48px" }}>
                {String(minutesRemaining).padStart(2, '0')}:00
            </h1>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'15px'}}>
            <div className='fixedButtonWrapper2'>
                <button onClick={handleBackClick} className="stylebutton3">
                    Back
                </button>
            </div>
            <div className='fixedButtonWrapper'>
                <button onClick={handleUpgradeClick} className="buttonStyle">
                    Upgrade
                </button>
            </div>
        </div>
    </div>
</div>
    );
};

export default LearnerDashUpdate;