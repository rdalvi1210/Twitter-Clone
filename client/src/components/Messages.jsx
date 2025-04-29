import React from 'react';
import { useSelector } from 'react-redux';
import { useGetAllMessage } from '../hooks/useGetAllMessage';
import useGetRTM from '../hooks/useGetRtm';

const Messages = () => {
    const { messages } = useSelector((store) => store.chat);
    const { user } = useSelector((store) => store.auth);
    useGetAllMessage();
    useGetRTM();

    return (
        <div className="flex-1 overflow-y-auto p-4">
            {/* Render messages */}
            {messages &&
                messages.map((msg, index) => {
                    // const isSelf = msg.sender === 'self'; // Assuming 'self' indicates the logged-in user
                    return (
                        <div
                            key={index}
                            className={`mb-4 flex ${
                                msg?.senderId === user?._id ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`p-3 rounded-md mb-1 w-fit ${
                                    msg?.senderId === user?._id
                                        ? 'bg-blue-200 text-right'
                                        : 'bg-gray-200 text-left'
                                }`}
                            >
                                {msg.message}
                            </div>
                            <span className="text-xs text-gray-500 self-end ml-2">
                                10:00 AM
                            </span>
                        </div>
                    );
                })}
        </div>
    );
};

export default Messages;
