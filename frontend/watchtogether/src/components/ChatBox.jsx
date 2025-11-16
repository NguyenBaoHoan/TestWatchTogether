import React, { useState, useEffect, useRef } from 'react';

const ChatBox = ({ messages, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow border border-gray-200">
            <div className="p-3 border-b bg-gray-50 font-bold text-gray-700">
                Chat Room
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 h-64">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`text-sm ${msg.type === 'JOIN' ? 'text-yellow-600 italic text-center' : ''}`}>
                        {msg.type === 'CHAT' && (
                            <p>
                                <span className="font-bold text-blue-600">{msg.sender}: </span>
                                <span className="text-gray-800">{msg.content}</span>
                            </p>
                        )}
                        {msg.type === 'JOIN' && <p>{msg.sender} joined the room</p>}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-2 border-t flex">
                <input
                    type="text"
                    className="flex-1 border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Say something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBox;