import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FlashCard = ({ card, index, total }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative">
      <motion.div
        className="w-[500px] h-[300px] cursor-pointer perspective-1000"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg p-6 flex flex-col
            ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex-1 flex items-center justify-center">
            <h3 className="text-2xl font-semibold text-gray-800 text-center">
              {card?.question}
            </h3>
          </div>
          <div className="text-center text-sm text-gray-500">
            Click to flip • Card {index + 1} of {total}
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute inset-0 backface-hidden bg-blue-600 text-white rounded-xl shadow-lg p-6 flex flex-col
            ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-center">
              {card?.answer}
            </p>
          </div>
          <div className="text-center text-sm text-blue-200">
            Click to flip • Card {index + 1} of {total}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlashCard; 