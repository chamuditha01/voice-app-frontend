import React, { useState, useEffect, useRef } from 'react';

const CallComponent = () => {
    const [status, setStatus] = useState('Disconnected');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [callRequest, setCallRequest] = useState(null); // Stores the caller's ID
    const [currentCallTarget, setCurrentCallTarget] = useState(null); // Stores the ID of the person we are currently connected to
    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const wsRef = useRef(null);
    const myIdRef = useRef(null);

    useEffect(() => {
        wsRef.current = new WebSocket('wss://voice-app-production.up.railway.app');

        wsRef.current.onopen = () => {
            console.log('Connected to signaling server');
            setStatus('Ready');
        };

        wsRef.current.onmessage = async (message) => {
            const data = JSON.parse(message.data);
            
            if (data.type === 'your_id') {
                myIdRef.current = data.id;
            } else if (data.type === 'user_list') {
                // Update the list of available users, excluding ourselves
                setAvailableUsers(data.users.filter(id => id !== myIdRef.current));
            } else if (data.type === 'call_request') {
                // Received a call request from another user
                setCallRequest(data.senderId);
                setStatus('Incoming Call...');
            } else if (data.type === 'call_accepted') {
                // Our call request has been accepted. Start the WebRTC handshake.
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
                // Received an SDP offer or answer from the other client
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
                // Received an ICE candidate from the other client
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
    }, []);

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
        // You can optionally send a rejection message to the caller here
    };

    const endCall = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        setCurrentCallTarget(null);
        setStatus('Disconnected');
    };

    return (
        <div>
            <h2>WebRTC Voice Call</h2>
            <p>Your ID: <strong>{myIdRef.current}</strong></p>
            <p>Status: <strong>{status}</strong></p>
            
            {!callRequest && (status !== 'In a call' && status !== 'Connecting...') ? (
                <>
                    <h3>Available Users:</h3>
                    {availableUsers.length > 0 ? (
                        <ul>
                            {availableUsers.map(user => (
                                <li key={user}>
                                    User {user} 
                                    <button onClick={() => requestCall(user)}>Call</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No other users are online.</p>
                    )}
                </>
            ) : (
                <>
                    {status === 'In a call' && <p>Currently in a call with User {currentCallTarget}.</p>}
                    {callRequest && (
                        <div>
                            <p>Incoming call from User {callRequest}. Do you want to accept?</p>
                            <button onClick={handleAcceptCall}>Accept</button>
                            <button onClick={handleRejectCall}>Reject</button>
                        </div>
                    )}
                    <button onClick={endCall} disabled={status === 'Disconnected'}>
                        End Call
                    </button>
                </>
            )}
        </div>
    );
};

export default CallComponent;