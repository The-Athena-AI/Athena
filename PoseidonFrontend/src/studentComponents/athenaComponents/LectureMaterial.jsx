import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaVideo, FaFileAlt, FaDownload } from 'react-icons/fa';

const LectureMaterial = () => {
  const [selectedType, setSelectedType] = useState('all');

  // Example materials data - replace with actual data from your backend
  const materials = [
    {
      type: 'pdf',
      title: 'Calculus Fundamentals',
      description: 'Comprehensive guide to basic calculus concepts',
      downloadUrl: '#',
      icon: <FaBook className="text-red-500" size={24} />,
    },
    {
      type: 'video',
      title: 'Understanding Derivatives',
      description: 'Video lecture explaining derivatives and their applications',
      downloadUrl: '#',
      icon: <FaVideo className="text-blue-500" size={24} />,
    },
    {
      type: 'notes',
      title: 'Practice Problems',
      description: 'Collection of practice problems with solutions',
      downloadUrl: '#',
      icon: <FaFileAlt className="text-green-500" size={24} />,
    },
    // Add more materials
  ];

  const filteredMaterials = selectedType === 'all' 
    ? materials 
    : materials.filter(m => m.type === selectedType);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Filter Controls */}
      <div className="p-4 bg-white border-b">
        <div className="flex gap-2">
          {['all', 'pdf', 'video', 'notes'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                ${selectedType === type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  {material.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {material.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {material.description}
                  </p>
                  <button
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => window.open(material.downloadUrl, '_blank')}
                  >
                    <FaDownload size={14} />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LectureMaterial; 