import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { useSwipeable } from "react-swipeable";
import Header from "../../Components/Header";
import imgunmute from "./microphone.png";
import imgmute from "./mute-button.png";
import imgsound from "./sound.png";
import ringtone from './ringtone.mp3';
import Button3 from "../../Components/Button 3";
import { supabase } from "../../supabaseClient";

const CallComponent = ({ email, role }) => {
  const [status, setStatus] = useState("Disconnected");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [callRequest, setCallRequest] = useState(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [online, setOnline] = useState(true);
  const wsRef = useRef(null);
  const myIdRef = useRef(null);
  const [ringtoneAudio, setRingtoneAudio] = useState(null);
  const [myId, setMyId] = useState(null);
  const [rawUsers, setRawUsers] = useState([]);
  const [callTime, setCallTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [dbCallId, setDbCallId] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const timerRef = useRef(null);

  const [callDetails, setCallDetails] = useState({
    opponentEmail: null,
    opponentName: null,
    opponentAge: null,
    opponentBio: null,
    opponentImageUrl: null,
    targetId: null,
    callId: null,
  });
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState(""); // Current user's name
  const [age, setAge] = useState(0);   // Current user's age
  const [bio, setBio] = useState("");  // Current user's bio
  const [imageUrl, setImageUrl] = useState(""); // Current user's imageUrl
  const [location, setLocation] = useState(""); // Current user's location
  const [myimgUrl, setmyImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canceledMessage, setCanceledMessage] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMySpeaking, setIsMySpeaking] = useState(false); 
  
    
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
      if (remoteStream) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
  
          const source = audioContextRef.current.createMediaStreamSource(remoteStream);
          source.connect(analyserRef.current);
  
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
  
          const analyzeAudio = () => {
              analyserRef.current.getByteFrequencyData(dataArray);
  
              // Check the average volume level
              const sum = dataArray.reduce((acc, val) => acc + val, 0);
              const average = sum / bufferLength;
              
              // Set a threshold to detect if the user is speaking
              const speakingThreshold = 20; // Adjust this value as needed
              setIsSpeaking(average > speakingThreshold);
  
              animationFrameIdRef.current = requestAnimationFrame(analyzeAudio);
          };
  
          analyzeAudio();
      }
  
      return () => {
          if (animationFrameIdRef.current) {
              cancelAnimationFrame(animationFrameIdRef.current);
          }
          if (audioContextRef.current) {
              audioContextRef.current.close();
          }
      };
  }, [remoteStream]);
    

  const localAudioContextRef = useRef(null);
  const localAnalyserRef = useRef(null);
  const localAnimationFrameIdRef = useRef(null);
  
  useEffect(() => {
      const localStream = localStreamRef.current;
      if (localStream) {
          // Initialize local audio analysis components
          localAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          localAnalyserRef.current = localAudioContextRef.current.createAnalyser();
          localAnalyserRef.current.fftSize = 256;
  
          const source = localAudioContextRef.current.createMediaStreamSource(localStream);
          source.connect(localAnalyserRef.current);
          // Do NOT connect to destination to avoid self-hearing in some browsers, 
          // as the stream is already handled by RTCPeerConnection.
  
          const bufferLength = localAnalyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
  
          const analyzeLocalAudio = () => {
              localAnalyserRef.current.getByteFrequencyData(dataArray);
  
              const sum = dataArray.reduce((acc, val) => acc + val, 0);
              const average = sum / bufferLength;
              
              // Adjust this threshold if the detection is too sensitive or not sensitive enough
              const speakingThreshold = 30; 
              setIsMySpeaking(average > speakingThreshold);
  
              localAnimationFrameIdRef.current = requestAnimationFrame(analyzeLocalAudio);
          };
  
          analyzeLocalAudio();
      }
  
      return () => {
          if (localAnimationFrameIdRef.current) {
              cancelAnimationFrame(localAnimationFrameIdRef.current);
          }
          if (localAudioContextRef.current) {
              localAudioContextRef.current.close();
          }
      };
  }, [localStreamRef.current]); // Dependency on localStreamRef.current ensures it runs when the stream is acquired
    

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the user's profile from the public.profiles table
        const { data, error } = await supabase
          .from('users')
          .select('imageUrl')
          .eq('email', email) // Assuming you have an 'email' column in your profiles table
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setmyImgUrl(data.imageUrl);
        } else {
          setmyImgUrl(null);
        }
      } catch (err) {
        console.error('Error fetching profile:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchProfileData();
    }
  }, [email]);

  useEffect(() => {
    // Initialize the audio object on component mount
    const audio = new Audio(ringtone);
    audio.loop = true; // Make the ringtone loop
    setRingtoneAudio(audio);
}, []);

useEffect(() => {
    // Control playback based on the callRequest state
    if (ringtoneAudio) {
        if (callRequest) {
            ringtoneAudio.play().catch(e => console.error("Error playing ringtone:", e));
        } else {
            ringtoneAudio.pause();
            ringtoneAudio.currentTime = 0; // Rewind the audio
        }
    }
}, [callRequest, ringtoneAudio]);

  useEffect(() => {
    // Fetch data from local storage
    const storedName = localStorage.getItem('userName');
    const storedAge = localStorage.getItem('userAge');
    const storedBio = localStorage.getItem('userBio');
    const storedImageUrl = localStorage.getItem('userImageUrl');
    const storedLocation = localStorage.getItem('userLocation');

    // Update state only if data exists in local storage
    if (storedName) setName(storedName);
    if (storedAge) setAge(parseInt(storedAge, 10)); // Convert age to a number
    if (storedBio) setBio(storedBio);
    if (storedImageUrl) setImageUrl(storedImageUrl);
    if (storedLocation) setLocation(storedLocation);
  }, []);

  const resetStates = () => {
    setCallRequest(null);
    setDbCallId(null);
    setCallDetails({
      opponentEmail: null,
      opponentName: null,
      opponentAge: null,
      opponentBio: null,
      opponentImageUrl: null,
      opponentLocation: null,
      targetId: null,
      callId: null,
    });
  };

  const startCall = async (
    targetId,
    callId,
    opponentEmail,
    opponentName,
    opponentAge,
    opponentBio,
    opponentImageUrl,
    opponentLocation,
    isCaller = false
  ) => {
    setStatus("Connecting...");
    setCallDetails({ opponentEmail, opponentName, opponentAge, opponentBio, opponentImageUrl, opponentLocation, targetId, callId });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:your-turn-server.com:3478",
            username: "000000002073294181",
            credential: "BpS5UodTlu6FUeFb61dATqQLMH0=",
          },
        ],
      });

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

       peerConnectionRef.current.ontrack = (event) => {
    const [remoteStream] = event.streams;
    const remoteAudio = new Audio();
    remoteAudio.srcObject = remoteStream;
    remoteAudio.play();
    setRemoteStream(remoteStream); // <-- Store the stream here
    setStatus("In a call");
};

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                candidate: event.candidate,
                targetId,
              })
            );
          }
        }
      };

      if (isCaller) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "sdp",
              sdp: peerConnectionRef.current.localDescription,
              targetId,
              opponentEmail,
              opponentName,
              opponentAge,
              opponentBio,
              opponentImageUrl,
              opponentLocation,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error getting media stream:", error);
      setStatus("Error");
    }
  };

  useEffect(() => {
    wsRef.current = new WebSocket("wss://voice-app-production.up.railway.app");

    wsRef.current.onopen = () => {
      console.log("Connected to signaling server");
      setStatus("Ready");
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "user_info",
            email,
            role,
            name: name || email.split("@")[0], // Fallback to email username if name is missing
            age: age || 0, // Default to 0 if age is missing
            bio: bio || "No bio available", // Default bio if missing
            imageUrl: imageUrl || "https://via.placeholder.com/150", // Default image if missing
            location: location || "Unknown Location", // Default location if missing
          })
        );
      }
    };

    wsRef.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "your_id") {
        myIdRef.current = data.id;
        setMyId(data.id);
      } else if (data.type === "user_list") {
        console.log("Received user list:", data.users); // Debug log
        setRawUsers(data.users);
      } else if (data.type === "no_speaker_available") {
        setStatus(
          "No speakers are currently available. Please try again later."
        );
      } else if (data.type === "call_request") {
        setCallRequest(data.senderId);
        setCallDetails({
          callId: data.callId,
          opponentEmail: data.opponentEmail,
          opponentName: data.opponentName,
          opponentAge: data.opponentAge,
          opponentBio: data.opponentBio,
          opponentImageUrl: data.opponentImageUrl,
            opponentLocation: data.opponentLocation,
          targetId: data.senderId,
        });
        setStatus("Incoming Call...");
      } else if (data.type === "call_ended_prompt") {
        endCall(false, true);
      } else if (data.type === "call_started") {
        setStatus("In a call");
      } else if (data.type === "call_accepted") {
        const { callId, senderId, opponentEmail, opponentName, opponentAge, opponentBio, opponentImageUrl, opponentLocation } = data;
        setCallDetails({ callId, opponentEmail, opponentName, opponentAge, opponentBio, opponentImageUrl, opponentLocation, targetId: senderId });
        startCall(senderId, callId, opponentEmail, opponentName, opponentAge, opponentBio, opponentImageUrl, opponentLocation, true);
      }else if (data.type === "call_canceled_notification") {
    setStatus("Canceled");
    setCanceledMessage("The learner canceled the call.");
}
      else if (data.type === "call_rejected") {
   
    
  } else if (data.type === "call_id_assigned") {
        setDbCallId(data.dbCallId);
      } else if (data.sdp) {
        if (!peerConnectionRef.current) {
          startCall(data.senderId, data.callId, data.opponentEmail, data.opponentName, data.opponentAge, data.opponentBio, data.opponentImageUrl, data.opponentLocation);
        }

        if (
          peerConnectionRef.current &&
          peerConnectionRef.current.signalingState !== "closed"
        ) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp)
          );
          if (data.sdp.type === "offer") {
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            if (wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  sdp: peerConnectionRef.current.localDescription,
                  targetId: data.senderId,
                  type: "sdp",
                  opponentEmail: data.opponentEmail,
                  opponentName: data.opponentName,
                  opponentAge: data.opponentAge,
                  opponentBio: data.opponentBio,
                  opponentImageUrl: data.opponentImageUrl,
                    opponentLocation: data.opponentLocation,
                })
              );
            }
          }
        }
      } else if (data.candidate) {
        try {
          if (
            peerConnectionRef.current &&
            peerConnectionRef.current.signalingState !== "closed"
          ) {
            await peerConnectionRef.current.addIceCandidate(data.candidate);
          }
        } catch (e) {
          console.error("Error adding received ICE candidate", e);
        }
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
  }, [email, role, name, age, bio, imageUrl]);

  useEffect(() => {
    if (myId !== null && rawUsers.length > 0) {
      let filtered = [];
      if (role === "learner") {
        filtered = rawUsers.filter(
          (user) => user.role === "speaker" && user.id !== myId && !user.inCall
        );
      } else if (role === "speaker") {
        filtered = rawUsers.filter(
          (user) => user.role === "learner" && user.id !== myId && !user.inCall
        );
      }
      setAvailableUsers(filtered);
    }
  }, [myId, rawUsers, role]);

  useEffect(() => {
    if (status === "In a call") {
      setStartTime(new Date().toISOString());
      timerRef.current = setInterval(() => {
        setCallTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setCallTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleCallSpecificUser = (targetId, opponentEmail, opponentName, opponentAge, opponentBio, opponentImageUrl, opponentLocation) => {
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "call_request",
          targetId: targetId,
          opponentEmail: opponentEmail,
          opponentName: opponentName,
          opponentAge: opponentAge,
          opponentBio: opponentBio,
          opponentImageUrl: opponentImageUrl,
            opponentLocation: opponentLocation,
        })
      );
      setStatus("Requesting Call...");
    }
  };

  const handleAcceptCall = async () => {
    if (wsRef.current.readyState === WebSocket.OPEN) {
      setStatus("Connecting...");
      const { targetId, callId, opponentEmail, opponentName, opponentAge, opponentBio, opponentImageUrl, opponentLocation } = callDetails;
      await startCall(targetId, callId, opponentEmail, opponentName, opponentAge, opponentBio, opponentImageUrl, opponentLocation);

      if (
        peerConnectionRef.current &&
        peerConnectionRef.current.signalingState !== "closed"
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: "call_accepted",
            targetId: targetId,
            opponentEmail: opponentEmail,
            opponentName: opponentName,
            opponentAge: opponentAge,
            opponentBio: opponentBio,
            opponentImageUrl: opponentImageUrl,
            opponentLocation: opponentLocation,
          })
        );
      }
       peerConnectionRef.current.ontrack = (event) => {
    const [remoteStream] = event.streams;
    const remoteAudio = new Audio();
    remoteAudio.srcObject = remoteStream;
    remoteAudio.play();
    setRemoteStream(remoteStream); // <-- Store the stream here
    setStatus("In a call");
};
      setCallRequest(null);
    }
  };

  const handleRejectCall = () => {
    if (
      peerConnectionRef.current &&
      peerConnectionRef.current.signalingState !== "closed"
    ) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("Notifying server of call rejection");
      wsRef.current.send(
        JSON.stringify({
          type: "call_rejected",
          targetId: callDetails.targetId,
        })
      );
    }
    resetStates();
    setStatus("Disconnected");
    setShowRatingForm(false);
  };

  const endCall = (notifyServer = true, showForm = false) => {
    console.log("Ending call...");
    if (
      peerConnectionRef.current &&
      peerConnectionRef.current.signalingState !== "closed"
    ) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (status === "In a call" && notifyServer) {
      const endTime = new Date().toISOString();
      const { opponentEmail, opponentName, opponentAge, opponentBio, opponentImageUrl, opponentLocation } = callDetails;

      const callData = {
        learner_email: role === "learner" ? email : opponentEmail,
        speaker_email: role === "speaker" ? email : opponentEmail,
        opponentName: opponentName,
        opponentAge: opponentAge,
        opponentBio: opponentBio,
        opponentImageUrl: opponentImageUrl,
        opponentLocation: opponentLocation,
        duration: callTime,
        startTime,
        endTime,
      };
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "call_ended", ...callData }));
      }
    }

    setStatus("Disconnected");
    if (showForm) {
      setShowRatingForm(true);
    }
  };

  const resetStates1 = () => {
    setCallRequest(null);
    setDbCallId(null);
    setCallDetails({
      opponentEmail: null,
      opponentName: null,
      opponentAge: null,
      opponentBio: null,
      opponentImageUrl: null,
        opponentLocation: null,
      targetId: null,
      callId: null,
    });
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    const { opponentEmail } = callDetails;

    const reviewData = {
      call_id: dbCallId,
      reviewed_email: opponentEmail,
      reviewed_by_email: email,
      rating,
      feedback,
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "submit_review", ...reviewData })
      );
    }

    setShowRatingForm(false);
    setRating(0);
    setFeedback("");
    setDbCallId(null);
    resetStates();
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
   
    transition: "background-color 0.2s ease-in-out",
    marginTop: "10%",
    textTransform:"capitalize",
    fontFamily: "'Funnel Display', sans-serif",  
  };

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
        width:"100%",
        marginLeft:'35px',
        marginRight:'35px' 
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
      fontSize: "32px",
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
      marginTop:'0px',
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
    padding: "20px 20px",
    backgroundColor: "#f9e7f3",
    color: "#e14e97",
    fontSize: "20px",
    fontWeight: "normal",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    
    transition: "background-color 0.2s ease-in-out",
    marginTop: "20%",
    textTransform:"capitalize",
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
    
    transition: "background-color 0.2s ease-in-out",
    textTransform:"capitalize",
    fontFamily: "'Funnel Display', sans-serif",  
  };

 
  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (availableUsers.length > 0) {
        setCurrentUserIndex((prevIndex) =>
          prevIndex === availableUsers.length - 1 ? 0 : prevIndex + 1
        );
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Allows swipe with mouse for testing
  });

  const currentUser = availableUsers[currentUserIndex];

  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
      });
    }
  };

  const handleOnline = () => {
    if(online){
console.log("Going offline...");
    wsRef.current.close();
    setStatus("Disconnected");
    setOnline(false);
  }
  else{
    console.log("Going online...");
    window.location.reload();
    setOnline(true);
  }
};

  return (
    <div style={styles.parentContainer}>
    <div style={styles.outerContainer}>
      <Header />
      {canceledMessage && (
  <div >
    <h1 style={{ margin: "0px", color: "#e14e97", fontSize: '32px', fontWeight: 'bold', lineHeight: '1.2' }}>
      {canceledMessage}
    </h1>
    {/* You may want to add a button to clear the message and reset state */}
    <div style={{ marginTop: "100%", width: "100%" }}>
      <Button3
        text={"OK"}
        onClick={() => {
          // This resets all states to the initial disconnected state
          resetStates1(); 
          setCanceledMessage(null); 
        }}
      />
    </div>
  </div>
)}

      {!callRequest &&
  status !== "In a call" &&
  status !== "Connecting..." &&
  status !== "Requesting Call..." &&
  !showRatingForm ? (
       <div style={{width:"100%"}}>
 <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      maxWidth: "360px",
                      gap:'20px',
                    }}
                  >
                    <div >
                      <h1 style={{ margin: "0px", color: "#e14e97", fontSize:"32px", fontWeight:'bold', lineHeight:"1.2" }}>
                       You're {online ? "Online" : "Offline"}
                      </h1>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={
                          myimgUrl ||
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
                  <div style={{marginTop:"100%",width:"100%"}}>
                   <Button3 
  text={online ? "Go Offline" : "Go Online"} 
  onClick={handleOnline} 
/> 
                    </div>
        <div>
                  </div>
        </div>
      ) : (
        <>
          {showRatingForm ? (
            <form onSubmit={handleRatingSubmit} className="rating-form" style={{width:'100%'}}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  
                  alignItems: "left",
                  width: "100%",
                  maxWidth: "360px",
                  width:'100%',
                  gap:'20px',
                }}
              >
                <div>
                  <h1 style={{ margin: "0px", color: "#000000", fontSize:"32px", fontWeight:'bold', lineHeight:"1.2" }}>
  Rate {callDetails.opponentName?.split(' ')[0] || callDetails.opponentEmail.split("@")[0]}
</h1>
                </div>
                <div>
                  <img
                    src={
                      callDetails.opponentImageUrl ||
                      "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4855.jpg"
                    }
                    width={"50px"}
                    height={"50px"}
                    style={{
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                    alt="Profile"
                  />
                </div>
              </div>
              
              <div
  className="rating-hexagons"
  style={{
    margin: "10px auto",
    backgroundColor: "#facce4ff",
    width: "100%",
    paddingBottom: "5px",
    borderRadius: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  }}
>
  {[1, 2, 3, 4, 5].map((hexagon) => (
    <span
      key={hexagon}
      className={hexagon <= rating ? "hexagon active" : "hexagon"}
      onClick={() => setRating(hexagon)}
      style={{
        cursor: "pointer",
        fontSize: "64px",
        color: hexagon <= rating ? "#e14e97" : "#A9A9A9",
        transform: "rotate(90deg)", // This is the key change
      }}
    >
      &#x2B22;
    </span>
  ))}
</div>
              <textarea
  value={feedback}
  onChange={(e) => setFeedback(e.target.value)}
  placeholder="Submit a review..."
  style={{
    width: "100%",
    boxSizing: "border-box",
    minHeight: "150px",
    maxHeight: "300px",
    resize: "vertical",
    backgroundColor: "#facce4ff",
    color: "#000000",
    border: "0px solid #f9a8d4",
    borderRadius: "30px",
    padding: "20px",
    fontSize: "16px",
    lineHeight: "1.5",
    fontFamily: "inherit",
    outline: "none",
  }}
></textarea>
              <br></br>
               <div className="fixedButtonWrapper2">
 
              <button
                type="submit"
                style={stylebutton2}
                onClick={() => {
                  resetStates1();
                  window.location.reload();
                }}
                

              >
                Skip
              </button>
              </div>
               <div className="fixedButtonWrapper">
 
              <button
                style={{ ...buttonStyle, marginTop: "10px" }}
                disabled={rating === 0}
              >
                Submit review
              </button>
              </div>
            </form>
          ) : (
            <>
              {status === "In a call" && (
                <>
                  <div >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      maxWidth: "360px",
                      gap:'20px'
                    }}
                  >
                    <div>
                      <h1 style={{ margin: "0px", color: "#000000", lineHeight:'normal' ,fontSize:'32px',}}>
                        You're talking to {callDetails.opponentName || callDetails.opponentEmail.split("@")[0]}
                      </h1>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={
                          callDetails.opponentImageUrl ||
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
                 <div style={{
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "600px",
  
  /* --- Centering Styles --- */
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}}>   
<div  style={{ cursor: "pointer" }}>
   <img
        src={
            // Check if MUTED: show static icon
            isMuted 
                ? imgsound 
                : 
            // Check if EITHER user is speaking: show frequency animation
            (isMySpeaking || isSpeaking) 
                ? require('./freq.webp') 
                : 
            // Otherwise: show static icon
            imgsound
        }
        width={"50px"}
        height={"50px"}
        style={{ borderRadius: "10px", objectFit: "cover" }}
        alt="freq"
    />
                    </div>
                    <h1 style={{ margin: "0px", color: "#000000", fontSize:'48px'}}>
                      {formatTime(callTime)}
                    </h1>
                    <div onClick={toggleMute} style={{ cursor: "pointer" }}>
                      <img
                        src={isMuted ? imgmute : imgunmute}
                        width={"30px"}
                        height={"30px"}
                        style={{
                          borderRadius: "50px",
                          objectFit: "cover",
                         
                          backgroundColor: "#facce4ff",
                          padding: "15px",
                        }}
                        alt="mic"
                      />
                    </div>
                  </div>

                 <div className="fixedButtonWrapper">
  <button
    onClick={() => endCall(true, true)}
    disabled={status === "Disconnected"}
    style={stylebutton2}
  >
    End Call
  </button>
</div>
                </div>
                </>
              )}
              {status === "Requesting Call..." && (
                <p>Calling {callDetails.opponentEmail}...</p>
              )}
              {status ===
                "No speakers are currently available. Please try again later." && (
                <p>
                  No speakers are currently available. Please try again later.
                </p>
              )}
             {callRequest && status !== "Canceled" && (
                <div >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      maxWidth: "360px",
                      justifyContent:"space-around"
                    }}
                  >
                    <div>
                      <h1 style={{ margin: "0px", color: "rgb(225, 78, 151)" }}>
                        {callDetails.opponentName || callDetails.opponentEmail.split("@")[0]} is calling...
                      </h1>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={
                          callDetails.opponentImageUrl ||
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
                  <div style={{ marginTop: "5%", textAlign: "left", backgroundColor: "#f9e7f3", padding: "20px", borderRadius: "30px" }}>
                    <h4 style={{marginTop:'0px',fontSize:'20px',marginBottom:'5px'}}>About</h4>
                    {callDetails.opponentBio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."}
                <h4 style={{marginTop:'10px',fontSize:'20px',marginBottom:'5px'}}>Interests</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
  {(callDetails.interests || "Reading, Traveling, Music, Sports")
    .split(',')
    .map((interest, index) => (
      <span key={index} style={{
        backgroundColor: '#f0f2f5',
        color: '#e14e97',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
      }}>
        {interest.trim()}
      </span>
    ))}
</div>
                  </div>
                   <div className="fixedButtonWrapper2">
 
                  <button onClick={handleAcceptCall} style={stylebutton3}>
                    Accept
                  </button>
                  </div>
                   <div className="fixedButtonWrapper">
 
                  <button onClick={handleRejectCall} style={buttonStyle}>
                    Reject
                  </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
    </div>
  );
};

export default CallComponent;