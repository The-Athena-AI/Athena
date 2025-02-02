import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPaperPlane, 
  FaRegLightbulb,
  FaSlideshare,
  FaRegComments,
  FaGraduationCap
} from 'react-icons/fa';
import FlashCard from './athenaComponents/FlashCard';
import athenaAvatar from '../images/PerfectAthenaPhotoUpdated2.png';
import athenaLogo from '../images/athena-high-resolution-logo-transparent.png';

const StudentLecture = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMode, setResponseMode] = useState('chat');
  const chatContainerRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        type: 'athena',
        mode: 'chat',
        content: "Hello! I'm Athena, your AI learning companion. How can I help you study today?",
        timestamp: new Date().toISOString(),
      }
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/athena/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
        },
        body: JSON.stringify({ 
          message: inputMessage,
          mode: responseMode 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        type: 'athena',
        mode: responseMode,
        content: data.response,
        flashcard: data.flashcard,
        slide: data.slide,
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'athena',
        mode: 'chat',
        content: "I apologize, but I'm having trouble connecting to my knowledge base. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResponse = (message) => {
    if (message.type === 'user') {
      return (
        <div className="max-w-[70%] rounded-lg p-3 bg-blue-600 text-white">
          {message.content}
        </div>
      );
    }

    switch (message.mode) {
      case 'flashcard':
        return (
          <div className="max-w-[80%] w-full">
            <FlashCard
              card={{
                question: message.flashcard?.question || message.content,
                answer: message.flashcard?.answer || "No answer provided"
              }}
              index={0}
              total={1}
            />
          </div>
        );

      case 'slideshow':
        return (
          <div className="max-w-[80%] w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">{message.slide?.title || 'Slide'}</h3>
              <div className="aspect-video bg-gray-100 rounded-lg mb-4">
                {message.slide?.image && (
                  <img 
                    src={message.slide.image} 
                    alt={message.slide.title} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="prose max-w-none">
                <p>{message.slide?.content || message.content}</p>
              </div>
              {message.slide?.notes && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{message.slide.notes}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-[70%] rounded-lg p-3 bg-white shadow-md">
            {message.content}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Athena branding */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={athenaAvatar}
                alt="Athena"
                className="w-12 h-12 rounded-full border-2 border-white/50"
              />
              <div>
                <h1 className="text-xl font-bold">Athena's Wisdom</h1>
                <p className="text-sm text-blue-100">Your AI Learning Companion</p>
              </div>
            </div>
            <img
              src={athenaLogo}
              alt="Athena Logo"
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}
              >
                {message.type === 'athena' && (
                  <img
                    src={athenaAvatar}
                    alt="Athena"
                    className="w-8 h-8 rounded-full border border-blue-200"
                  />
                )}
                {renderResponse(message)}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2">
                <img
                  src={athenaAvatar}
                  alt="Athena"
                  className="w-8 h-8 rounded-full border border-blue-200"
                />
                <div className="bg-white shadow-md rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area with Study Mode Selection */}
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto space-y-3">
              {/* Study Mode Selection */}
              <div className="flex gap-2 pb-3 border-b">
                <button
                  type="button"
                  onClick={() => setResponseMode('chat')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    responseMode === 'chat'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaRegComments size={16} />
                  <span className="text-sm font-medium">Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResponseMode('flashcard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    responseMode === 'flashcard'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaRegLightbulb size={16} />
                  <span className="text-sm font-medium">Flashcards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResponseMode('slideshow')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    responseMode === 'slideshow'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaSlideshare size={16} />
                  <span className="text-sm font-medium">Slideshow</span>
                </button>
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ask about ${responseMode === 'chat' ? 'anything' : 
                    responseMode === 'flashcard' ? 'a topic for flashcards' : 
                    'a topic for slides'}...`}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                  disabled={isLoading}
                >
                  <FaPaperPlane size={16} />
                  <span className="font-medium">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLecture;