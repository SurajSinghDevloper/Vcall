const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 8988, path: '/peerjs' });

console.log('PeerJS server running on http://localhost:8988');
