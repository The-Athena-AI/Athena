import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const GradeViewButton = ({ userId, assignmentId, submissionId, status, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teacher/${userId}/dashboard/assignments/grade/${assignmentId}/${submissionId}`);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'graded':
        return 'text-green-400 hover:text-green-500';
      case 'submitted':
        return 'text-yellow-400 hover:text-yellow-500';
      default:
        return 'text-gray-400 hover:text-gray-500';
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${className || ''} ${getStatusColor()} transition-colors duration-200`}
    >
      {status === 'graded' ? 'View Grade' : 'Grade'}
    </button>
  );
};

GradeViewButton.propTypes = {
  userId: PropTypes.string.isRequired,
  assignmentId: PropTypes.string.isRequired,
  submissionId: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['graded', 'submitted', 'pending']).isRequired,
  className: PropTypes.string
};

export default GradeViewButton; 