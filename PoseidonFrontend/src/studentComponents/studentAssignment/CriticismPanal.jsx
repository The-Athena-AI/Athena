import React from 'react';
import { FaExclamationTriangle, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

const CriticismsPanel = ({ criticisms = [] }) => {
  const getCriticismIcon = (type) => {
    switch (type) {
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'suggestion':
        return <FaLightbulb className="text-yellow-500" />;
      case 'praise':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return null;
    }
  };

  const getCriticismClass = (type) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'suggestion':
        return 'border-yellow-200 bg-yellow-50';
      case 'praise':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (!criticisms || criticisms.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Feedback</h3>
      <div className="space-y-4">
        {criticisms.map((criticism, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getCriticismClass(
              criticism.type
            )}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getCriticismIcon(criticism.type)}</div>
              <div>
                <p className="text-gray-800">{criticism.text}</p>
                {criticism.suggestion && (
                  <p className="text-sm text-gray-600 mt-2">
                    Suggestion: {criticism.suggestion}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriticismsPanel;