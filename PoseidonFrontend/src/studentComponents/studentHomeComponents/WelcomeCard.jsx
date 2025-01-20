import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const WelcomeCard = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome back, Ayo 👋</h1>
          <p className="text-blue-100">
            You've completed <span className="font-semibold">70%</span> of your weekly goal
          </p>
        </div>
        <div className="bg-blue-400/30 p-3 rounded-full">
          <FaChartLine size={24} />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-blue-400/30 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500" 
            style={{ width: '70%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;