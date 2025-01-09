import React from 'react';
import { FaCalendarAlt, FaGraduationCap, FaClock } from 'react-icons/fa';
import FileUpload from './FileUpload';

const AssignmentDetails = ({ assignment, onGrade }) => {
  const isOverdue = new Date(assignment.dueDate) < new Date();
  const canSubmit = !assignment.completed && !isOverdue;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{assignment.title}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaGraduationCap />
            <span>{assignment.className}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>Posted: {new Date(assignment.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className={isOverdue ? 'text-red-500' : 'text-yellow-500'} />
            <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="prose max-w-none mb-8">
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <p className="text-gray-700">{assignment.description}</p>
      </div>

      {canSubmit ? (
        <div className="space-y-6">
          <FileUpload assignmentId={assignment.id} />
          <button
            onClick={onGrade}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Assignment
          </button>
        </div>
      ) : (
        <div className={`p-4 rounded-lg ${
          assignment.completed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {assignment.completed ? 
            'Assignment submitted successfully!' : 
            'Assignment is overdue and can no longer be submitted.'
          }
        </div>
      )}
    </div>
  );
};

export default AssignmentDetails;