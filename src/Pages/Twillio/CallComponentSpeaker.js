import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { useSwipeable } from "react-swipeable";
import Header from "../../Components/Header";
import imgunmute from "./mic.png";
import imgmute from "./microphone.png";
import imgsound from "./sound.png";

const CallComponent = ({ email, role }) => {
  const [status, setStatus] = useState("Disconnected");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [callRequest, setCallRequest] = useState(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const wsRef = useRef(null);
  const myIdRef = useRef(null);

  const [myId, setMyId] = useState(null);
  const [rawUsers, setRawUsers] = useState([]);
  const [callTime, setCallTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [dbCallId, setDbCallId] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const timerRef = useRef(null);

  const [callDetails, setCallDetails] = useState({
    opponentEmail: null,
    targetId: null,
    callId: null,
  });
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const resetStates = () => {
    setCallRequest(null);
    setDbCallId(null);
    setCallDetails({ opponentEmail: null, targetId: null, callId: null });
  };

  const startCall = async (
    targetId,
    callId,
    opponentEmail,
    isCaller = false
  ) => {
    setStatus("Connecting...");
    setCallDetails({ opponentEmail, targetId, callId });

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
    wsRef.current = new WebSocket("ws://localhost:8080");

    wsRef.current.onopen = () => {
      console.log("Connected to signaling server");
      setStatus("Ready");
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "user_info",
            email,
            role,
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
          targetId: data.senderId,
        });
        setStatus("Incoming Call...");
      } else if (data.type === "call_ended_prompt") {
        endCall(false, true);
      } else if (data.type === "call_started") {
        setStatus("In a call");
      } else if (data.type === "call_accepted") {
        const { callId, senderId, opponentEmail } = data;
        setCallDetails({ callId, opponentEmail, targetId: senderId });
        startCall(senderId, callId, opponentEmail, true);
      } else if (data.type === "call_id_assigned") {
        setDbCallId(data.dbCallId);
      } else if (data.sdp) {
        if (!peerConnectionRef.current) {
          startCall(data.senderId, data.callId, data.opponentEmail);
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
  }, [email, role]);

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

  const handleCallSpecificUser = (targetId, opponentEmail) => {
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "call_request",
          targetId: targetId,
          opponentEmail: opponentEmail,
        })
      );
      setStatus("Requesting Call...");
    }
  };

  const handleAcceptCall = async () => {
    if (wsRef.current.readyState === WebSocket.OPEN) {
      setStatus("Connecting...");
      const { targetId, callId, opponentEmail } = callDetails;
      await startCall(targetId, callId, opponentEmail);

      if (
        peerConnectionRef.current &&
        peerConnectionRef.current.signalingState !== "closed"
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: "call_accepted",
            targetId: targetId,
            opponentEmail: opponentEmail,
          })
        );
      }
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
      const { opponentEmail } = callDetails;

      const callData = {
        learner_email: role === "learner" ? email : opponentEmail,
        speaker_email: role === "speaker" ? email : opponentEmail,
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

  const stylebutton2 = {
    width: "100%",
    padding: "15px 20px",
    backgroundColor: "#facce4ff",
    color: "#e94e9f",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.2s ease-in-out",
    marginTop: "20%",
  };

  const stylebutton3 = {
    width: "100%",
    padding: "15px 20px",
    backgroundColor: "#facce4ff",
    color: "#e94e9f",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.2s ease-in-out",
    marginTop: "10%",
    marginBottom:'10px'
  };

  const styles = {
    outerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      minHeight: "70vh",
      minWidth: "360px",
      boxSizing: "border-box",
      maxWidth: "360px",
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

      margin: "20px auto",
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
      marginBottom: "5px",
      textAlign: "left",
    },
    country: {
      fontSize: "18px",
      color: "#777",
      marginBottom: "auto",
    },
    endCallButton: {
      backgroundColor: "#dc3545",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
    },
  };

  const buttonStyle = {
    width: "100%",
    padding: "15px 20px",
    backgroundColor: "#e94e9f",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.2s ease-in-out",
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

  return (
    <div style={styles.outerContainer}>
      <Header />

      {!callRequest &&
      status !== "In a call" &&
      status !== "Connecting..." &&
      status !== "Requesting Call..." &&
      status !==
        "No speakers are currently available. Please try again later." &&
      !showRatingForm &&
      availableUsers.length > 0 ? (
        <div {...handlers} style={{ width: "100%", touchAction: "pan-y" }}>
          <div>
            <h1 style={{ margin: "0px", color: "#e94e9f", textAlign: "left" }}>
              {currentUser.description ||
                "A cool guy with a beard, talks beers"}
            </h1>

            <div style={styles.imageContainer}>
              <img
                width={"280px"}
                height={"320px"}
                style={{ objectFit: "cover", borderRadius: "20px" }}
                src={
                  currentUser.imageUrl ||
                  "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                }
                alt={currentUser.email}
                className="profile-image"
              />
            </div>
            <h1 style={styles.nameAndAge}>{currentUser.email.split("@")[0]}</h1>

            {role === "learner" && (
              <button
                style={buttonStyle}
                onClick={() =>
                  handleCallSpecificUser(currentUser.id, currentUser.email)
                }
              >
                Call with {currentUser.email.split("@")[0]}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {showRatingForm ? (
            <form onSubmit={handleRatingSubmit} className="rating-form">
              <h3>Rate Your Call</h3>
              <p>
                How would you rate your experience with{" "}
                {callDetails.opponentEmail}?
              </p>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= rating ? "star active" : "star"}
                    onClick={() => setRating(star)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your feedback..."
              ></textarea>
              <button
                type="submit"
                className="submit-review-button"
                disabled={rating === 0}
              >
                Submit Review
              </button>
              <button
                style={{ ...buttonStyle, marginTop: "10px" }}
                onClick={() => window.location.reload()}
              >
                Skip
              </button>
            </form>
          ) : (
            <>
              {status === "In a call" && (
                <>
                  <div style={styles.outerContainer}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        maxWidth: "360px",
                      }}
                    >
                      <div>
                        <h1 style={{ margin: "0px", color: "#000000ff" }}>
                          You're talking to{" "}
                          {callDetails.opponentEmail.split("0")[0]}
                        </h1>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <img
                          src="https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
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
                    <div style={{ marginTop: "25%", textAlign: "center" }}>
                      <img
                        src={imgsound}
                        width={"50px"}
                        height={"50px"}
                        style={{ borderRadius: "10px", objectFit: "cover" }}
                        alt="freq"
                      />
                      <h1>
                        {" "}
                        <strong>{formatTime(callTime)}</strong>
                      </h1>
                      <div onClick={toggleMute}>
                        <img
                          src={isMuted ? imgmute : imgunmute}
                          width={"30px"}
                          height={"30px"}
                          style={{
                            borderRadius: "50px",
                            objectFit: "cover",
                            marginBottom: "8%",
                            backgroundColor: "#facce4ff",
                            padding: "15px",
                          }}
                          alt="mic"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => endCall(true, true)}
                      disabled={status === "Disconnected"}
                      style={stylebutton2}
                    >
                      End Call
                    </button>
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
              {callRequest && (
                <div style={styles.outerContainer}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      maxWidth: "360px",
                    }}
                  >
                    <div>
                      <h1 style={{ margin: "0px", color: "#000000ff" }}>
                        {callDetails.opponentEmail.split("0")[0]} is calling...
                      </h1>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src="https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
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
                  <div style={{ marginTop: "5%", textAlign: "left", backgroundColor: "#facce4ff", padding: "20px", borderRadius: "30px",margin:'10px' }}>
                    <h4 style={{marginTop:'0px',fontSize:'20px',marginBottom:'5px'}}>About</h4>
                    {callDetails.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."}
                <h4 style={{marginTop:'10px',fontSize:'20px',marginBottom:'5px'}}>Interests</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
  {(callDetails.interests || "Reading, Traveling, Music, Sports")
    .split(',')
    .map((interest, index) => (
      <span key={index} style={{
        backgroundColor: '#f0f2f5',
        color: '#e94e9f',
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
                  <button onClick={handleAcceptCall} style={stylebutton3}>
                    Accept
                  </button>
                  
                  <button onClick={handleRejectCall} style={buttonStyle}>
                    Reject
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CallComponent;
