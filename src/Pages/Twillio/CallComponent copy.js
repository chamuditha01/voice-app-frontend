import  { useState, useEffect, useRef } from 'react';
import './index.css';

const CallComponent_copy = ({ email, role }) => {
    const [status, setStatus] = useState('Disconnected');
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

    const [callDetails, setCallDetails] = useState({ opponentEmail: null, targetId: null, callId: null });

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const resetStates = () => {
        setCallRequest(null);
        setDbCallId(null);
        setCallDetails({ opponentEmail: null, targetId: null, callId: null });
    };

    const startCall = async (targetId, callId, opponentEmail, isCaller = false) => {
        setStatus('Connecting...');
        setCallDetails({ opponentEmail, targetId, callId });
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;

            peerConnectionRef.current = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    {
                        urls: 'turn:your-turn-server.com:3478', // Replace with your TURN server URL
                        username: '000000002073294181', // Replace with your TURN server username
                        credential: 'BpS5UodTlu6FUeFb61dATqQLMH0=' // Replace with your TURN server password
                    }
                ],
            });

            stream.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, stream);
            });

            peerConnectionRef.current.ontrack = (event) => {
                const [remoteStream] = event.streams;
                const remoteAudio = new Audio();
                remoteAudio.srcObject = remoteStream;
                remoteAudio.play();
                setStatus('In a call');
            };

            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    if (wsRef.current.readyState === WebSocket.OPEN) {
                        wsRef.current.send(JSON.stringify({
                            candidate: event.candidate,
                            targetId,
                        }));
                    }
                }
            };
            
            if (isCaller) {
                const offer = await peerConnectionRef.current.createOffer();
                await peerConnectionRef.current.setLocalDescription(offer);
                if (wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                        sdp: peerConnectionRef.current.localDescription,
                        targetId,
                    }));
                }
            }
        } catch (error) {
            console.error('Error getting media stream:', error);
            setStatus('Error');
        }
    };
    
    useEffect(() => {
        wsRef.current = new WebSocket('ws://localhost:8080');

        wsRef.current.onopen = () => {
            console.log('Connected to signaling server');
            setStatus('Ready');
            if (wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: 'user_info',
                    email,
                    role
                }));
            }
        };

        wsRef.current.onmessage = async (message) => {
            const data = JSON.parse(message.data);

            if (data.type === 'your_id') {
                myIdRef.current = data.id;
                setMyId(data.id);
            } else if (data.type === 'user_list') {
                setRawUsers(data.users);
            } else if (data.type === 'no_speaker_available') {
                setStatus('No speakers are currently available. Please try again later.');
            } else if (data.type === 'call_request') {
                setCallRequest(data.senderId);
                setCallDetails({ callId: data.callId, opponentEmail: data.opponentEmail, targetId: data.senderId });
                setStatus('Incoming Call...');
            } else if (data.type === 'call_ended_prompt') {
                endCall(false, true);
            } else if (data.type === 'call_started') {
                setStatus('In a call');
            } else if (data.type === 'call_accepted') {
                const { callId, senderId, opponentEmail } = data;
                setCallDetails({ callId, opponentEmail, targetId: senderId });
                startCall(senderId, callId, opponentEmail, true);
            } else if (data.type === 'call_id_assigned') {
                setDbCallId(data.dbCallId);
            } else if (data.sdp) {
                // CRITICAL FIX: Only call startCall if it's the first SDP message
                if (!peerConnectionRef.current) {
                    startCall(data.senderId, data.callId, data.opponentEmail);
                }
                
                if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
                    if (data.sdp.type === 'offer') {
                        const answer = await peerConnectionRef.current.createAnswer();
                        await peerConnectionRef.current.setLocalDescription(answer);
                        if (wsRef.current.readyState === WebSocket.OPEN) {
                            wsRef.current.send(JSON.stringify({
                                sdp: peerConnectionRef.current.localDescription,
                                targetId: data.senderId
                            }));
                        }
                    }
                }
            } else if (data.candidate) {
                try {
                    if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
                        await peerConnectionRef.current.addIceCandidate(data.candidate);
                    }
                } catch (e) {
                    console.error('Error adding received ICE candidate', e);
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
            if (role === 'learner') {
                filtered = rawUsers.filter(user => user.role === 'speaker' && user.id !== myId && !user.inCall);
            } else if (role === 'speaker') {
                filtered = rawUsers.filter(user => user.role === 'learner' && user.id !== myId && !user.inCall);
            }
            setAvailableUsers(filtered);
        }
    }, [myId, rawUsers, role]);

    useEffect(() => {
        if (status === 'In a call') {
            setStartTime(new Date().toISOString());
            timerRef.current = setInterval(() => {
                setCallTime(prevTime => prevTime + 1);
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
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };

    const requestRandomCall = () => {
        if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'call_request' }));
            setStatus('Requesting Call...');
        }
    };

    const handleAcceptCall = async () => {
        if (wsRef.current.readyState === WebSocket.OPEN) {
            setStatus('Connecting...');
            const { targetId, callId, opponentEmail } = callDetails;
            await startCall(targetId, callId, opponentEmail);

            if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
                wsRef.current.send(JSON.stringify({
                    type: 'call_accepted',
                    targetId: targetId,
                    opponentEmail: opponentEmail
                }));
            }
            setCallRequest(null);
        }
    };

    const handleRejectCall = () => {
        if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
             peerConnectionRef.current.close();
             peerConnectionRef.current = null;
        }

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
             wsRef.current.send(JSON.stringify({ 
                 type: 'call_rejected', 
                 targetId: callDetails.targetId 
             }));
        }
        resetStates();
        setStatus('Disconnected');
        setShowRatingForm(false);
    };

    const endCall = (notifyServer = true, showForm = false) => {
        if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        if (status === 'In a call' && notifyServer) {
            const endTime = new Date().toISOString();
            const { opponentEmail } = callDetails;
            
            const callData = {
                learner_email: role === 'learner' ? email : opponentEmail,
                speaker_email: role === 'speaker' ? email : opponentEmail,
                duration: callTime,
                startTime,
                endTime,
            };
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'call_ended', ...callData }));
            }
        }
       
        setStatus('Disconnected');
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
            wsRef.current.send(JSON.stringify({ type: 'submit_review', ...reviewData }));
        }

        setShowRatingForm(false);
        setRating(0);
        setFeedback('');
        setDbCallId(null);
        resetStates();
    };

    return (
        <div className="call-container">
            <h2>WebRTC Voice Call</h2>
            <p>Your ID: <strong>{myId}</strong></p>
            <p>Email: <strong>{email}</strong></p>
            <p>Role: <strong>{role}</strong></p>
            <p>Status: <strong>{status}</strong></p>
            
            {status === 'In a call' && (
                <p>Call Time: <strong>{formatTime(callTime)}</strong></p>
            )}

            {!callRequest && (status !== 'In a call' && status !== 'Connecting...' && status !== 'Requesting Call...') && !showRatingForm ? (
                <>
                    <h3>Available {role === 'learner' ? 'Speakers' : 'Learners'}:</h3>
                    {role === 'learner' && (
                        <button onClick={requestRandomCall} className="call-button" disabled={availableUsers.length === 0}>
                            Call Random Speaker
                        </button>
                    )}
                    
                    {availableUsers.length > 0 ? (
                        <ul>
                            {availableUsers.map(user => (
                                <li key={user.id}>
                                    User {user.email} {user.inCall ? '(In Call)' : ''}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No other users are online or available.</p>
                    )}
                </>
            ) : (
                <>
                    {showRatingForm ? (
                        <form onSubmit={handleRatingSubmit} className="rating-form">
                            <h3>Rate Your Call</h3>
                            <p>How would you rate your experience with {callDetails.opponentEmail}?</p>
                            <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={star <= rating ? 'star active' : 'star'}
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
                            <button type="submit" className="submit-review-button" disabled={rating === 0}>
                                Submit Review
                            </button>
                        </form>
                    ) : (
                        <>
                            {status === 'In a call' && <p>Currently in a call with {callDetails.opponentEmail}.</p>}
                            {status === 'Requesting Call...' && <p>Calling a random speaker...</p>}
                            {callRequest && (
                                <div>
                                    <p>Incoming call from {callDetails.opponentEmail}. Do you want to accept?</p>
                                    <button onClick={handleAcceptCall} className="accept-button">Accept</button>
                                    <button onClick={handleRejectCall} className="reject-button">Reject</button>
                                </div>
                            )}
                            <button onClick={() => endCall(true, true)} disabled={status === 'Disconnected'} className="end-call-button">
                                End Call
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default CallComponent_copy;