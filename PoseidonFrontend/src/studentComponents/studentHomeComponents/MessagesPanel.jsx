import React from 'react';
import { FaEnvelope, FaCircle } from 'react-icons/fa';

const MessagesPanel = () => {
  const messages = [
    {
      id: 1,
      sender: 'Mayowa Ade',
      message: 'First Chapter of Project.doc',
      time: '2h ago',
      unread: true
    },
    {
      id: 2,
      sender: 'Olawuyi Tobi',
      message: 'Can you check the formulas in these images?',
      time: '3h ago',
      unread: false
    },
    {
      id: 3,
      sender: 'Joshua Ashiru',
      message: 'You are yet to submit your assignment.',
      time: '5h ago',
      unread: true
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <span className="text-sm text-blue-600">View All</span>
      </div>
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <div className="relative">
              <FaEnvelope className="text-gray-400" />
              {message.unread && (
                <FaCircle className="absolute -top-1 -right-1 text-blue-500 text-xs" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{message.sender}</p>
              <p className="text-sm text-gray-500 truncate">{message.message}</p>
            </div>
            <span className="text-xs text-gray-400">{message.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesPanel;