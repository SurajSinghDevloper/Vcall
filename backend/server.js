const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

// Configure CORS for Express
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));

// Configure Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Connect to MongoDB (use your actual MongoDB URI)
const mongoURI = "mongodb+srv://suraj31kumar1999:suraj%40143@cluster0.gnqtqdz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.use(express.json());
app.use('/api/auth', authRoutes);



io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('join-room', (roomId, userId) => {

        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);  // Emit to other users in the room

        socket.on('message', (message) => {
            io.to(roomId).emit('createMessage', message);  // Broadcast the message to the room
        });

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId);  // Notify others when a user disconnects
        });
    });
});

server.listen(8080, () => console.log('Server running on http://localhost:8080'));
