import { Button, Input } from '@mui/material';
import React, { useState } from 'react';

const Chat = ({ messages, onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.sender === 'Me' ? 'text-right' : 'text-left'}`}>
                        <span className="inline-block bg-blue-500 text-white rounded-lg py-2 px-4 max-w-xs break-words">
                            <strong>{msg.sender}: </strong>{msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                />
                <Button type="submit">Send</Button>
            </form>
        </div>
    );
};

export default Chat;

