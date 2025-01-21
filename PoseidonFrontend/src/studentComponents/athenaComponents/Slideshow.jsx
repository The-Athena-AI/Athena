import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Example slides data - replace with actual data from your backend
  const slides = [
    {
      title: 'Introduction to Calculus',
      content: 'Calculus is the mathematical study of continuous change...',
      image: 'path_to_image',
      notes: 'Additional notes about the topic...'
    },
    // Add more slides
  ];

  const handleNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Slideshow Controls */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavigation('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm font-medium">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <button
            onClick={() => handleNavigation('next')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaChevronRight />
          </button>
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FaExpand />
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 p-8"
          >
            <div className="max-w-4xl mx-auto h-full bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6">{slides[currentSlide]?.title}</h2>
              
              {slides[currentSlide]?.image && (
                <div className="mb-6">
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="prose max-w-none">
                <p>{slides[currentSlide]?.content}</p>
              </div>

              {slides[currentSlide]?.notes && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">Notes</h4>
                  <p className="text-sm text-blue-600">{slides[currentSlide].notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Slideshow; 