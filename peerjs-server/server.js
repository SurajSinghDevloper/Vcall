const { PeerServer } = require('peer');
const peerServer = PeerServer(
    {
        port: 8988,
        path: '/peerjs',
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        allow_discovery: true,

    }
);
peerServer.on('listening', () => {
    console.log('PeerJS server running on http://localhost:8988');
});

// Error handling in case the server cannot start
peerServer.on('error', (err) => {
    console.error('Error occurred:', err);
    process.exit(1);  // Exit the process if there is an error
});
