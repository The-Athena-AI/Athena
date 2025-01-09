import React from 'react';
import { FaBook, FaClock, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

const AssignmentList = ({ assignments, onSelectAssignment, filterStatus, searchTerm }) => {
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true :
                         filterStatus === 'completed' ? assignment.completed :
                         !assignment.completed;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    
    if (assignment.completed) return 'text-green-500';
    if (dueDate < now) return 'text-red-500';
    return 'text-yellow-500';
  };

  const getStatusIcon = (assignment) => {
    if (assignment.completed) return <FaCheckCircle className="text-green-500" />;
    return <FaHourglassHalf className="text-yellow-500" />;
  };

  return (
    <div className="space-y-4">
      {filteredAssignments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No assignments found
        </div>
      ) : (
        filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
            onClick={() => onSelectAssignment(assignment)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FaBook className="text-blue-500" />
                  <h3 className="font-semibold text-lg">{assignment.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Class: {assignment.className}
                </p>
                <p className="text-sm text-gray-500">
                  {assignment.description?.substring(0, 100)}
                  {assignment.description?.length > 100 ? '...' : ''}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <FaClock className={getStatusColor(assignment)} />
                  <span className="text-sm text-gray-600">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2">
                  {getStatusIcon(assignment)}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AssignmentList;