import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const CallComponent = ({ email, role }) => {
    const [status, setStatus] = useState('Disconnected');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [callRequest, setCallRequest] = useState(null);
    const [currentCallTarget, setCurrentCallTarget] = useState(null);
    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const wsRef = useRef(null);
    const myIdRef = useRef(null);

    const [myId, setMyId] = useState(null);
    const [rawUsers, setRawUsers] = useState([]);
    const [callTime, setCallTime] = useState(0); // New state for the timer
    const timerRef = useRef(null); // Ref to hold the timer interval

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
                setStatus('Incoming Call...');
            } else if (data.type === 'call_ended') {
                endCall(false);
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

    // UseEffect for user list filtering
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

    // UseEffect to start and stop the timer
    useEffect(() => {
        if (status === 'In a call') {
            timerRef.current = setInterval(() => {
                setCallTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            setCallTime(0);
        }
    }, [status]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };

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

    const requestRandomCall = () => {
        if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'call_request' }));
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

    const endCall = (notifyServer = true) => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        if (notifyServer && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
             wsRef.current.send(JSON.stringify({ type: 'call_ended', targetId: currentCallTarget }));
        }
       
        setCurrentCallTarget(null);
        setStatus('Disconnected');
    };

    return (
        <div className="call-container">
            <h2>WebRTC Voice Call</h2>
            <p>Your ID: <strong>{myId}</strong></p>
            <p>Email: <strong>{email}</strong></p>
            <p>Role: <strong>{role}</strong></p>
            <p>Status: <strong>{status}</strong></p>
            
            {/* Display the call timer if the status is 'In a call' */}
            {status === 'In a call' && (
                <p>Call Time: <strong>{formatTime(callTime)}</strong></p>
            )}

            {!callRequest && (status !== 'In a call' && status !== 'Connecting...' && status !== 'Requesting Call...') ? (
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
                    {status === 'In a call' && <p>Currently in a call with User {currentCallTarget}.</p>}
                    {status === 'Requesting Call...' && <p>Calling a random speaker...</p>}
                    {callRequest && (
                        <div>
                            <p>Incoming call from User {callRequest}. Do you want to accept?</p>
                            <button onClick={handleAcceptCall} className="accept-button">Accept</button>
                            <button onClick={handleRejectCall} className="reject-button">Reject</button>
                        </div>
                    )}
                    <button onClick={() => endCall(true)} disabled={status === 'Disconnected'} className="end-call-button">
                        End Call
                    </button>
                </>
            )}
        </div>
    );
};

export default CallComponent;