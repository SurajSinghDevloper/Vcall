import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import Chat from './Chat';
import Card from '@mui/material/Card';
import { Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const Room = () => {
    const { roomId } = useParams();
    const myVideo = useRef(null);
    const socketRef = useRef();
    const peerRef = useRef();
    const streamRef = useRef();
    const screenShareStreamRef = useRef();

    const [messages, setMessages] = useState([]);
    const [peers, setPeers] = useState({});
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [fullscreenVideo, setFullscreenVideo] = useState(null);
    const [audioDevices, setAudioDevices] = useState([]);
    const [videoDevices, setVideoDevices] = useState([]);
    const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
    const [selectedVideoDevice, setSelectedVideoDevice] = useState('');

    const addVideoStream = useCallback((video, stream, isLocal = false) => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        const videoContainer = document.getElementById('video-grid');
        video.className = 'video-item';
        if (isLocal) {
            video.classList.add('local-video');
            video.muted = true;
        }
        videoContainer?.appendChild(video);
    }, []);

    const connectToNewUser = useCallback((userId, stream) => {
        const call = peerRef.current?.call(userId, stream);
        if (call) {
            const video = document.createElement('video');
            call.on('stream', (userVideoStream) => {
                addVideoStream(video, userVideoStream);
            });
            setPeers(prevPeers => ({ ...prevPeers, [userId]: call }));
        }
    }, [addVideoStream]);

    useEffect(() => {
        const initSocketAndPeer = async () => {
            try {
                socketRef.current = io('https://vcall-ouea.onrender.com');
                peerRef.current = new Peer(undefined, {
                    host: 'https://vcall-peer-server.onrender.com',
                    port: 443,
                    path: '/peerjs',
                    secure: true,
                });

                // Check if mediaDevices is available in the browser
                if (navigator.mediaDevices) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    streamRef.current = stream;
                    if (myVideo.current) {
                        addVideoStream(myVideo.current, stream, true);
                    }

                    peerRef.current.on('call', (call) => {
                        call.answer(stream);
                        const video = document.createElement('video');
                        call.on('stream', (userVideoStream) => {
                            addVideoStream(video, userVideoStream);
                        });
                    });

                    socketRef.current.emit('join-room', roomId, peerRef.current.id);

                    socketRef.current.on('user-connected', (userId) => {
                        connectToNewUser(userId, stream);
                    });

                    socketRef.current.on('createMessage', ({ sender, text }) => {
                        setMessages((prevMessages) => [...prevMessages, { sender, text }]);
                    });
                } else {
                    console.error('Media devices are not supported in this environment.');
                }
            } catch (error) {
                console.error("Error initializing socket or peer:", error);
            }
        };

        initSocketAndPeer();

        return () => {
            socketRef.current?.disconnect();
            peerRef.current?.destroy();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (screenShareStreamRef.current) {
                screenShareStreamRef.current.getTracks().forEach(track => track.stop());
            }
            Object.values(peers).forEach(call => call.close());
        };
    }, [roomId, connectToNewUser, addVideoStream, peers]);


    const handleSendMessage = useCallback((text) => {
        const message = { sender: 'Me', text };
        setMessages((prevMessages) => [...prevMessages, message]);
        socketRef.current?.emit('sendMessage', message);
    }, []);

    const startScreenSharing = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenShareStreamRef.current = screenStream;

            const videoTrack = screenStream.getVideoTracks()[0];
            const sender = peerRef.current?.connections[Object.keys(peerRef.current.connections)[0]]?.[0].peerConnection.getSenders().find(s => s.track?.kind === 'video');

            if (sender) {
                sender.replaceTrack(videoTrack);
            }

            if (myVideo.current) {
                myVideo.current.srcObject = screenStream;
            }

            setIsScreenSharing(true);

            screenStream.getVideoTracks()[0].onended = stopScreenSharing;
        } catch (err) {
            console.error("Failed to start screen sharing:", err);
        }
    };

    const stopScreenSharing = () => {
        if (screenShareStreamRef.current) {
            screenShareStreamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsScreenSharing(false);

        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            const sender = peerRef.current?.connections[Object.keys(peerRef.current.connections)[0]]?.[0].peerConnection.getSenders().find(s => s.track?.kind === 'video');

            if (sender) {
                sender.replaceTrack(videoTrack);
            }

            if (myVideo.current) {
                myVideo.current.srcObject = streamRef.current;
            }
        }
    };

    const toggleMute = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    const toggleCamera = () => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOff(!videoTrack.enabled);
        }
    };

    const handleVideoClick = (video) => {
        setFullscreenVideo(video);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Card className="m-4 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Room: {roomId}</h1>
                <Button variant="contained" color="secondary" onClick={() => window.location.href = '/'}>Leave Room</Button>
            </Card>

            <div className="flex flex-1 m-4 space-x-4">
                <Card className="flex-1 p-4 overflow-hidden">
                    <div id="video-grid" className="grid grid-cols-4 gap-4 h-full overflow-auto flex-end relative">
                        <video
                            ref={myVideo}
                            className="w-1/4 h-1/4 object-cover rounded-lg local-video absolute bottom-0 right-0 z-10"
                            muted
                            playsInline
                        />
                        {Object.values(peers).map((peer, index) => (
                            <video
                                key={index}
                                className="w-1/4 h-1/4 object-cover rounded-lg video-item"
                                onClick={() => handleVideoClick(peer)}
                                playsInline
                            />
                        ))}
                    </div>
                </Card>
                <Card className="w-1/3 p-4 overflow-hidden">
                    <Chat messages={messages} onSendMessage={handleSendMessage} />
                </Card>
            </div>

            <Card className="m-4 p-4  flex justify-center items-center space-x-4">
                <Card >
                    <FormControl>
                        <InputLabel>Audio Device</InputLabel>
                        <Select
                            value={selectedAudioDevice}
                            onChange={(e) => setSelectedAudioDevice(e.target.value)}
                        >
                            {audioDevices.map((device) => (
                                <MenuItem key={device.deviceId} value={device.deviceId}>
                                    {device.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputLabel>Video Device</InputLabel>
                        <Select
                            value={selectedVideoDevice}
                            onChange={(e) => setSelectedVideoDevice(e.target.value)}
                        >
                            {videoDevices.map((device) => (
                                <MenuItem key={device.deviceId} value={device.deviceId}>
                                    {device.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Card>

                <Button onClick={isScreenSharing ? stopScreenSharing : startScreenSharing} variant="contained" color={isScreenSharing ? "secondary" : "primary"}>
                    {isScreenSharing ? 'Stop Screen Sharing' : 'Start Screen Sharing'}
                </Button>
                <Button onClick={toggleMute} variant="contained" color={isMuted ? "secondary" : "primary"}>
                    {isMuted ? 'Unmute' : 'Mute'}
                </Button>
                <Button onClick={toggleCamera} variant="contained" color={isCameraOff ? "secondary" : "primary"}>
                    {isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                </Button>
            </Card>


        </div>
    );
};

export default Room;
