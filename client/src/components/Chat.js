import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const Chat = ({ messages, onSendMessage }) => {
    const [messageInput, setMessageInput] = useState('');

    const handleSend = () => {
        if (messageInput.trim()) {
            onSendMessage(messageInput);
            setMessageInput('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <List className="flex-1 overflow-auto">
                {messages.map((message, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`${message.sender}: ${message.text}`}
                        />
                    </ListItem>
                ))}
            </List>
            <div className="flex mt-4">
                <TextField
                    fullWidth
                    variant="outlined"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button variant="contained" color="primary" onClick={handleSend}>
                    Send
                </Button>
            </div>
        </div>
    );
};

export default Chat;

