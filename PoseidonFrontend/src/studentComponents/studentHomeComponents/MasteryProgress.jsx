import React from 'react';
import { FaTrophy } from 'react-icons/fa';

const MasteryProgress = () => {
  const subjects = [
    { name: 'Life Contingency', progress: 75 },
    { name: 'Social Insurance', progress: 91 },
    { name: 'Advanced Maths', progress: 25 },
    { name: 'Pension', progress: 97 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Mastery Progress</h2>
        <FaTrophy className="text-yellow-500" />
      </div>

      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{subject.name}</span>
              <span className="font-medium">{subject.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  subject.progress >= 90 ? 'bg-green-500' :
                  subject.progress >= 70 ? 'bg-blue-500' :
                  subject.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${subject.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasteryProgress;