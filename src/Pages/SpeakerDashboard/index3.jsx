import  { useState, useEffect } from 'react';
import Header from "../../Components/Header";
import { supabase } from '../../supabaseClient';
import './index.css';

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

  

    const handleEarningsClick = () => {
        window.history.back();
    }

    const handleBackClick = () => {
        window.history.back();
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
                    gap: '20px'
                }}
            >
                <div>
                    <h1 
                        style={{ 
                            margin: "0px", 
                            color: "#000000", 
                            fontSize: "32px", 
                            fontWeight: "bold", 
                            lineHeight: "1.2" 
                        }}
                    >
                        Hola, Speaker
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
            <h4 style={{ marginTop: "15%", marginBottom: "0px" }}>Total talk time</h4>
            <h1 
                style={{ 
                    margin: "0px", 
                    color: "#000000", 
                    fontSize: "48px", 
                    fontWeight: "bold", 
                    lineHeight: "1.2" 
                }}
            >
                {loading ? 'Loading...' : formatTime(totalTalkTime)}
            </h1>
            <hr style={{ border: '0', height: '2px', backgroundColor: '#000', margin: '0px 0' }} />
            <h4 style={{ marginBottom: "0px",marginTop:'10px' }}>Earnings</h4>
            <h1 
                style={{ 
                    margin: "0px", 
                    color: "#000000",
                    fontSize: "48px", 
                    fontWeight: "bold", 
                    lineHeight: "1.2" 
                }}
            >
                {loading ? 'Loading...' : `$${totalEarnings.toFixed(2)}`}
            </h1>
        </div>
        
        {/* Back Button Container (Fixed Position) */}
        <div className='fixedButtonWrapper2'>
            <button onClick={handleBackClick} className="stylebutton3">
                Back
            </button>
        </div>

        {/* Claim Earnings Button Container (Fixed Position) */}
        <div className='fixedButtonWrapper'>
            <button onClick={handleEarningsClick} className="buttonStyle">
                Claim Earnings
            </button>
        </div>
    </div>
</div>
    );
};

export default SpeakerDashboard3;