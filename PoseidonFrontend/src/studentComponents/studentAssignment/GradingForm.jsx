import React, { useState } from 'react';
import { FaStar, FaExclamationCircle } from 'react-icons/fa';

const GradingForm = ({ assignment, onSubmit }) => {
  const [answers, setAnswers] = useState('');
  const [selfAssessment, setSelfAssessment] = useState(0);
  const [confidence, setConfidence] = useState(3);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!answers.trim()) {
      validationErrors.answers = 'Please provide your answers';
    }
    if (selfAssessment === 0) {
      validationErrors.selfAssessment = 'Please rate your understanding';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      answers,
      selfAssessment,
      confidence,
      submittedAt: new Date().toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answers
        </label>
        <textarea
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          rows={6}
          className={`w-full rounded-lg border ${
            errors.answers ? 'border-red-500' : 'border-gray-300'
          } shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          placeholder="Type your answers here..."
        />
        {errors.answers && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FaExclamationCircle className="mr-1" />
            {errors.answers}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate Your Understanding (1-5)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setSelfAssessment(rating)}
              className={`p-2 rounded-full ${
                selfAssessment >= rating
                  ? 'text-yellow-400 hover:text-yellow-500'
                  : 'text-gray-300 hover:text-gray-400'
              }`}
            >
              <FaStar size={24} />
            </button>
          ))}
        </div>
        {errors.selfAssessment && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FaExclamationCircle className="mr-1" />
            {errors.selfAssessment}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confidence Level
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Not Confident</span>
          <span>Very Confident</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Submit Assignment
      </button>
    </form>
  );
};

export default GradingForm;