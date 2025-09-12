import React, { useState, useEffect, useRef } from 'react';

const CallComponent = () => {
    const [status, setStatus] = useState('Disconnected');
    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const wsRef = useRef(null);
    const myIdRef = useRef(null);

    useEffect(() => {
        wsRef.current = new WebSocket('wss://voice-app-production.up.railway.app');

        wsRef.current.onopen = () => {
            console.log('Connected to signaling server');
        };

        wsRef.current.onmessage = async (message) => {
            const data = JSON.parse(message.data);
            
            if (data.type === 'id') {
                myIdRef.current = data.id;
            } else if (data.type === 'start_call') {
                await startCall();
            } else if (data.sdp) {
                if (!peerConnectionRef.current) {
                    await createPeerConnection();
                }
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
                if (data.sdp.type === 'offer') {
                    const answer = await peerConnectionRef.current.createAnswer();
                    await peerConnectionRef.current.setLocalDescription(answer);
                    if (wsRef.current.readyState === WebSocket.OPEN) {
                        wsRef.current.send(JSON.stringify({ sdp: peerConnectionRef.current.localDescription }));
                    }
                }
            } else if (data.candidate) {
                try {
                    if (wsRef.current.readyState === WebSocket.OPEN) {
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

    const createPeerConnection = async () => {
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
                        wsRef.current.send(JSON.stringify({ candidate: event.candidate }));
                    }
                }
            };
        } catch (error) {
            console.error('Error getting media stream:', error);
            setStatus('Error');
        }
    };

    const startCall = async () => {
        setStatus('Connecting...');
        await createPeerConnection();
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ sdp: peerConnectionRef.current.localDescription }));
        }
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
        setStatus('Disconnected');
    };

    return (
        <div>
            <h2>WebRTC Voice Call</h2>
            <p>Status: <strong>{status}</strong></p>
            <button onClick={startCall} disabled={status !== 'Disconnected'}>
                Start Call (Manual)
            </button>
            <button onClick={endCall} disabled={status === 'Disconnected'}>
                End Call
            </button>
            <p>Note: The second client to open a tab will start the call automatically. The "Manual" button is for testing if the other client is already disconnected.</p>
        </div>
    );
};

export default CallComponent;