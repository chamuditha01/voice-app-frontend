import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';

const styles = {
    appContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#111827',
        padding: '1rem',
        fontFamily: 'Inter, sans-serif'
    },
    mainCard: {
        width: '100%',
        maxWidth: '24rem',
        padding: '2rem',
        backgroundColor: '#1f2937',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #374151',
        color: '#e5e7eb'
    },
    header: {
        textAlign: 'center',
        marginBottom: '1.5rem'
    },
    heading: {
        fontSize: '2.25rem',
        fontWeight: '800',
        color: '#ffffff'
    },
    subHeading: {
        marginTop: '0.5rem',
        fontSize: '0.875rem',
        color: '#9ca3af'
    },
    userId: {
        fontFamily: 'monospace',
        fontWeight: '600',
        color: '#ffffff'
    },
    statusContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1rem'
    },
    statusIndicator: {
        width: '0.75rem',
        height: '0.75rem',
        borderRadius: '9999px',
        marginRight: '0.5rem'
    },
    statusText: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#d1d5db'
    },
    incomingCallCard: {
        textAlign: 'center',
        padding: '1.5rem',
        backgroundColor: '#374151',
        borderRadius: '0.75rem',
        border: '1px solid #3b82f6',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    },
    incomingCallText: {
        fontSize: '1.25rem',
        fontWeight: '500',
        color: '#93c5fd'
    },
    incomingCallInfo: {
        fontSize: '0.875rem',
        color: '#9ca3af',
        marginTop: '0.25rem',
        marginBottom: '1rem'
    },
    callButtonsContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem'
    },
    acceptButton: {
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        borderRadius: '9999px',
        fontWeight: '600',
        color: '#ffffff',
        backgroundImage: 'linear-gradient(to right, #22c55e, #16a34a)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transform: 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer'
    },
    rejectButton: {
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        borderRadius: '9999px',
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#4b5563',
        border: '1px solid #6b7280',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transform: 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer'
    },
    inCallCard: {
        textAlign: 'center',
        padding: '1.5rem',
        backgroundColor: '#374151',
        borderRadius: '0.75rem',
        border: '1px solid #22c55e'
    },
    inCallText: {
        fontSize: '1.125rem',
        fontWeight: '500',
        color: '#86efac'
    },
    endCallButton: {
        marginTop: '1.5rem',
        width: '100%',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        borderRadius: '9999px',
        fontWeight: '700',
        color: '#ffffff',
        backgroundImage: 'linear-gradient(to right, #ef4444, #b91c1c)',
        boxShadow: '0 4px 6px -1-px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transform: 'scale(1)',
        cursor: 'pointer'
    },
    onlineUsersHeading: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#d1d5db',
        marginBottom: '0.75rem'
    },
    userListContainer: {
        padding: '1rem',
        backgroundColor: '#374151',
        borderRadius: '0.75rem',
        maxHeight: '15rem',
        overflowY: 'auto',
        border: '1px solid #4b5563'
    },
    userListItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem',
        backgroundColor: '#4b5563',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #6b7280'
    },
    userName: {
        color: '#e5e7eb',
        fontWeight: '500'
    },
    callUserButton: {
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '0.375rem',
        paddingBottom: '0.375rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#ffffff',
        backgroundImage: 'linear-gradient(to right, #4f46e5, #3b82f6)',
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transform: 'scale(1)',
        cursor: 'pointer'
    },
    noUsersMessage: {
        textAlign: 'center',
        color: '#9ca3af',
        paddingTop: '1rem',
        paddingBottom: '1rem'
    },
    endCallButtonMain: {
        marginTop: '1.5rem',
        width: '100%',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        borderRadius: '9999px',
        fontWeight: '700',
        color: '#ffffff',
        transitionProperty: 'all',
        transitionDuration: '300ms',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transform: 'scale(1)',
        cursor: 'pointer'
    },
    ratingForm: {
        textAlign: 'center',
        padding: '1.5rem',
        backgroundColor: '#374151',
        borderRadius: '0.75rem',
        border: '1px solid #9ca3af',
        marginTop: '1.5rem'
    },
    ratingHeading: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#d1d5db',
        marginBottom: '0.75rem'
    },
    ratingStars: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
    },
    starButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        color: '#9ca3af',
        cursor: 'pointer',
        transition: 'color 0.2s'
    },
    starButtonFilled: {
        color: '#eab308'
    },
    feedbackTextarea: {
        width: '100%',
        height: '5rem',
        backgroundColor: '#4b5563',
        color: '#e5e7eb',
        border: '1px solid #6b7280',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        resize: 'none',
        fontSize: '0.875rem'
    },
    submitButton: {
        marginTop: '1rem',
        width: '100%',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        borderRadius: '9999px',
        fontWeight: '700',
        color: '#ffffff',
        backgroundImage: 'linear-gradient(to right, #4f46e5, #3b82f6)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transitionProperty: 'all',
        transitionDuration: '300ms',
        cursor: 'pointer'
    }
};

const CallComponent = ({ email, role }) => {
    const [status, setStatus] = useState('Disconnected');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [callRequest, setCallRequest] = useState(null);
    const [currentCallTarget, setCurrentCallTarget] = useState(null);
    const [callDuration, setCallDuration] = useState(0);
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const callStartTime = useRef(null);
    
    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const wsRef = useRef(null);
    const myIdRef = useRef(null);
    const intervalRef = useRef(null);

    const statusColor = (status) => {
        switch (status) {
            case 'In a call':
                return '#22c55e';
            case 'Connecting...':
            case 'Requesting Call...':
                return '#eab308';
            case 'Incoming Call...':
                return '#3b82f6';
            case 'Ready':
                return '#a855f7';
            case 'Call ended':
                return '#ef4444';
            default:
                return '#ef4444';
        }
    };

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    useEffect(() => {
        wsRef.current = new WebSocket('ws://localhost:8080');

        wsRef.current.onopen = () => {
            console.log('Connected to signaling server');
            wsRef.current.send(JSON.stringify({ type: 'init_user', email: email, role: role }));
            setStatus('Ready');
        };

        wsRef.current.onmessage = async (message) => {
            const data = JSON.parse(message.data);
            
            if (data.type === 'your_id') {
                myIdRef.current = data.id;
            } else if (data.type === 'user_list') {
                setAvailableUsers(data.users);
            } else if (data.type === 'call_request') {
                setCallRequest(data.senderId);
                setStatus('Incoming Call...');
            } else if (data.type === 'call_accepted') {
                setCurrentCallTarget(data.senderId);
                await initiatePeerConnection(data.senderId);
                const offer = await peerConnectionRef.current.createOffer();
                await peerConnectionRef.current.setLocalDescription(offer);
                if (wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({ 
                        sdp: peerConnectionRef.current.localDescription,
                        targetId: data.senderId,
                    }));
                }
            } else if (data.type === 'call_ended') {
                endCall(true); // Pass true to indicate remote end
                setStatus('Call ended');
            } else if (data.sdp) {
                if (!peerConnectionRef.current) {
                    setCurrentCallTarget(data.senderId);
                    await initiatePeerConnection(data.senderId);
                }
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
            } else if (data.candidate) {
                try {
                    if (peerConnectionRef.current) {
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
        if (status === 'In a call') {
            callStartTime.current = new Date(); // Record start time
            setCallDuration(0);
            intervalRef.current = setInterval(() => {
                setCallDuration(prevDuration => prevDuration + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [status]);

    const initiatePeerConnection = async (targetId) => {
        if (peerConnectionRef.current) peerConnectionRef.current.close();
        
        peerConnectionRef.current = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;

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
        } catch (error) {
            console.error('Error getting media stream:', error);
            setStatus('Error');
        }
    };

    const requestCall = (targetId) => {
        if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'call_request', targetId }));
            setCurrentCallTarget(targetId);
            setStatus('Requesting Call...');
        }
    };

    const handleAcceptCall = async () => {
        if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'call_accepted', targetId: callRequest }));
            setCallRequest(null);
            setStatus('Connecting...');
        }
    };

    const handleRejectCall = () => {
        setCallRequest(null);
        setStatus('Disconnected');
    };

    const endCall = async (remote = false) => {
        if (!remote && wsRef.current && wsRef.current.readyState === WebSocket.OPEN && currentCallTarget !== null) {
            wsRef.current.send(JSON.stringify({ type: 'call_ended', targetId: currentCallTarget }));
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        
        
        // Show the rating form for the learner role
        if (role === 'learner' && status === 'In a call') {
            setShowRatingForm(true);
        }

        setStatus('Disconnected');
    };

    const submitReview = async () => {
        const endTime = new Date();
        const durationInMinutes = Math.floor((endTime - callStartTime.current) / 1000 / 60);

       

        // Determine who is the learner and who is the speaker for the call record
        const learnerEmail = role === 'learner' ? email : currentCallTarget;
        const speakerEmail = role === 'speaker' ? email : currentCallTarget;
        
        // Step 2: Insert into 'calls' table
        const { data: callData, error: callError } = await supabase
            .from('calls')
            .insert({
                learner_email: learnerEmail,
                speaker_email: speakerEmail,
                duration_in_minutes: durationInMinutes,
                start_time: callStartTime.current.toISOString(),
                end_time: endTime.toISOString()
            })
            .select();

        if (callError) {
            console.error('Error inserting call record:', callError);
            return;
        }

        const callId = callData[0].id;



        // Step 3: Insert into 'reviews' table
        const { error: reviewError } = await supabase
            .from('reviews')
            .insert({
                call_id: callId,
                reviewer_email: learnerEmail,
                reviewed_email: currentCallTarget,
                rating: rating,
                feedback: feedback
            });

        if (reviewError) {
            console.error('Error inserting review:', reviewError);
            return;
        }

        // Reset state
        setCurrentCallTarget(null);
        setShowRatingForm(false);
        setRating(0);
        setFeedback('');
        setStatus('Disconnected');
    };

    return (
        <div style={styles.appContainer}>
            <style>
                {`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
                .pulse-animation {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .hover\\:scale-105:hover {
                    transform: scale(1.05);
                }
                .transition-all {
                    transition-property: all;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    transition-duration: 300ms;
                }
                `}
            </style>
            <div style={styles.mainCard}>
                <div style={styles.header}>
                    <h1 style={styles.heading}>Voice Chat</h1>
                    <p style={styles.subHeading}>Your ID: <span style={styles.userId}>{myIdRef.current}</span></p>
                    <p style={styles.subHeading}>Role: <span style={styles.userId}>{role}</span></p>
                    <div style={styles.statusContainer}>
                        <span style={{ ...styles.statusIndicator, backgroundColor: statusColor(status) }} className={status.includes('pulse') ? 'pulse-animation' : ''}></span>
                        <p style={styles.statusText}>{status}</p>
                    </div>
                </div>

                {callRequest ? (
                    <div style={styles.incomingCallCard}>
                        <p style={styles.incomingCallText}>Incoming call from <span style={{ fontWeight: '700' }}>User {callRequest}</span>.</p>
                        <p style={styles.incomingCallInfo}>Do you want to accept?</p>
                        <div style={styles.callButtonsContainer}>
                            <button
                                onClick={handleAcceptCall}
                                style={styles.acceptButton}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{}}><path d="M22 11.08V12a10 10 0 1 1-5.93-8.6"></path><path d="m12 22-3-3m3 3 3-3m-3 3v-20"></path><path d="m9 12 2 2 4-4"></path></svg>
                                    Accept
                                </div>
                            </button>
                            <button
                                onClick={handleRejectCall}
                                style={styles.rejectButton}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{}}><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
                                    Reject
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {status === 'In a call' ? (
                            <div style={styles.inCallCard}>
                                <p style={styles.inCallText}>In a call with <span style={{ fontWeight: '700' }}>User {currentCallTarget}</span>.</p>
                                <p style={{ color: '#86efac', fontWeight: 'bold', fontSize: '1.5rem', marginTop: '0.5rem' }}>
                                    {formatDuration(callDuration)}
                                </p>
                                <button
                                    onClick={() => endCall(false)}
                                    style={styles.endCallButton}
                                >
                                    End Call
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 style={styles.onlineUsersHeading}>Online Users</h3>
                                <div style={styles.userListContainer}>
                                    {availableUsers.length > 0 ? (
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {availableUsers.map(user => (
                                                <li key={user} style={styles.userListItem}>
                                                    <span style={styles.userName}>{user}</span>
                                                    {role === 'learner' && (
                                                        <button
                                                            onClick={() => requestCall(user)}
                                                            style={styles.callUserButton}
                                                        >
                                                            Call
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div style={styles.noUsersMessage}>
                                            <p>No other users are online.</p>
                                            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Share your ID to start a call!</p>
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                    <button
                                        onClick={() => endCall(false)}
                                        disabled={status === 'Disconnected' || status === 'Ready'}
                                        style={{
                                            ...styles.endCallButtonMain,
                                            backgroundColor: (status === 'Disconnected' || status === 'Ready') ? '#6b7280' : 'initial',
                                            backgroundImage: (status === 'Disconnected' || status === 'Ready') ? 'initial' : 'linear-gradient(to right, #ef4444, #b91c1c)',
                                            cursor: (status === 'Disconnected' || status === 'Ready') ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        End Call
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
                {showRatingForm && (
                    <div style={styles.ratingForm}>
                        <h3 style={styles.ratingHeading}>Rate Your Call</h3>
                        <div style={styles.ratingStars}>
                            {[...Array(5)].map((_, i) => (
                                <button
                                    key={i}
                                    style={{ ...styles.starButton, ...(i < rating ? styles.starButtonFilled : {}) }}
                                    onClick={() => setRating(i + 1)}
                                >
                                    &#9733;
                                </button>
                            ))}
                        </div>
                        <textarea
                            style={styles.feedbackTextarea}
                            placeholder="Add your feedback..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                        <button
                            onClick={submitReview}
                            style={styles.submitButton}
                        >
                            Submit Review
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CallComponent;
