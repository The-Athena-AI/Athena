import React, { useState } from 'react';
import { FaChalkboard } from 'react-icons/fa';
import ManageClass from './ManageClass';
import bookImage from '../images/BookImage.jpg';

const TeacherClasses = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  
  const hardcodedClass = {
    id: '1',
    name: 'Writing',
    description: 'A comprehensive writing course focusing on developing strong writing skills, critical thinking, and effective communication through various writing styles and techniques.',
    students: {
      '1': { name: 'John Smith', joinedAt: new Date().toISOString() },
      '2': { name: 'Sarah Johnson', joinedAt: new Date().toISOString() },
      '3': { name: 'Mike Williams', joinedAt: new Date().toISOString() }
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">My Classes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-800 overflow-hidden">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={bookImage} 
              alt="Writing Class"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          </div>
          
          {/* Content Container */}
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-yellow-400">{hardcodedClass.name}</h2>
                <p className="text-sm text-yellow-400/70 mb-4">
                  Students: {Object.keys(hardcodedClass.students).length}
                </p>
              </div>
            </div>
            
            <div className="bg-black/50 p-3 rounded-lg mb-4">
              <p className="text-sm text-yellow-400/70">Description:</p>
              <p className="text-sm text-yellow-400">{hardcodedClass.description}</p>
            </div>

            <button 
              className="w-full mt-2 text-yellow-400 hover:text-yellow-500 text-sm font-medium bg-black/50 py-2 rounded-lg transition-colors"
              onClick={() => setSelectedClass(hardcodedClass)}
            >
              Manage Class →
            </button>
          </div>
        </div>
      </div>

      {/* Manage Class Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto border border-gray-800">
            <ManageClass 
              classData={selectedClass} 
              onClose={() => setSelectedClass(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClasses; 