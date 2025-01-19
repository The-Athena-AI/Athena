import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Dialog as DialogPrimitive } from '@headlessui/react';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline';

const TeacherRubric = ({ selectedCriterion, onGradeChange, criteriaGrades }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const criteria = {
    'Introduction/Opening': {
      icon: AcademicCapIcon,
      color: 'from-blue-500 to-indigo-600',
      grades: {
        0: 'No clear introduction or thesis statement. Main ideas are absent or unclear.',
        1: 'Weak introduction with unclear thesis. Main ideas are minimally presented.',
        2: 'Basic introduction with simple thesis. Main ideas are present but underdeveloped.',
        3: 'Strong introduction with clear thesis. Main ideas are well-presented.',
        4: 'Exceptional introduction with compelling thesis. Main ideas are expertly presented and engaging.'
      }
    },
    'Text Evidence': {
      icon: ChartBarIcon,
      color: 'from-emerald-500 to-teal-600',
      grades: {
        0: 'No textual evidence used to support claims.',
        1: 'Minimal or irrelevant textual evidence used.',
        2: 'Basic textual evidence used with some relevance to claims.',
        3: 'Strong textual evidence that supports claims effectively.',
        4: 'Exceptional use of textual evidence that enhances and strengthens all claims.'
      }
    },
    'Explanation': {
      icon: LightBulbIcon,
      color: 'from-amber-500 to-orange-600',
      grades: {
        0: 'No explanation of evidence or connection to thesis.',
        1: 'Minimal explanation with weak connections to thesis.',
        2: 'Basic explanation with some connections to thesis.',
        3: 'Clear explanation with strong connections to thesis.',
        4: 'Thorough and insightful explanation with compelling connections to thesis.'
      }
    },
    'Conclusion': {
      icon: CheckCircleIcon,
      color: 'from-purple-500 to-violet-600',
      grades: {
        0: 'No conclusion or summary of main points.',
        1: 'Weak conclusion with minimal summary.',
        2: 'Basic conclusion that restates main points.',
        3: 'Strong conclusion that synthesizes main points.',
        4: 'Exceptional conclusion that extends beyond summary to broader implications.'
      }
    },
    'Organization': {
      icon: ExclamationCircleIcon,
      color: 'from-rose-500 to-pink-600',
      grades: {
        0: 'No clear organization or structure.',
        1: 'Minimal organization with unclear transitions.',
        2: 'Basic organization with simple transitions.',
        3: 'Clear organization with effective transitions.',
        4: 'Sophisticated organization with seamless transitions.'
      }
    }
  };

  const handleCellClick = (criterion, grade) => {
    setSelectedCell({ criterion, grade });
    setIsDetailOpen(true);
    if (onGradeChange) {
      onGradeChange(grade);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 0: return 'bg-red-100 text-red-800';
      case 1: return 'bg-orange-100 text-orange-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-green-100 text-green-800';
      case 4: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };
  console.log(`Consoling AcademicCapIcon. should not be undefined: ${AcademicCapIcon}`); // Should not be undefined


  return (
    <div className="flex gap-4">
      {/* Left Panel - Rubric Table */}
      <div className="flex-1">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={tableVariants}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Grading Rubric</h2>
            <p className="mt-2 text-sm text-gray-600">
              Click on any cell to view detailed criteria and descriptions
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-gray-200 bg-gray-50 p-4 text-left text-sm font-semibold text-gray-900">
                    Criteria
                  </th>
                  {[0, 1, 2, 3, 4].map(grade => (
                    <th key={grade} className="border-b border-gray-200 bg-gray-50 p-4 text-center text-sm font-semibold text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(grade)}`}>
                        Grade {grade}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              <div>Icon Placeholder</div>
                {Object.entries(criteria).map(([criterion, { icon: Icon, color, grades }]) => (
                  <motion.tr
                    key={criterion}
                    variants={rowVariants}
                    className="hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">{criterion}</span>
                      </div>
                    </td>
                    {[0, 1, 2, 3, 4].map(grade => (
                      <td
                        key={grade}
                        className={`p-4 cursor-pointer transition-all duration-200 ${
                          selectedCell?.criterion === criterion && selectedCell?.grade === grade
                            ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset'
                            : ''
                        }`}
                        onClick={() => handleCellClick(criterion, grade)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="h-20 text-sm text-gray-600 overflow-hidden"
                        >
                          {grades[grade]}
                        </motion.div>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - AI Insights */}
      {selectedCell && (
        <div className="w-96 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
          
          {/* Grade Level Overview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Grade Level Analysis</h4>
            <div className={`p-3 rounded-lg ${getGradeColor(selectedCell.grade)}`}>
              <span className="text-sm">
                Grade {selectedCell.grade} - {criteria[selectedCell.criterion].grades[selectedCell.grade]}
              </span>
            </div>
          </div>

          {/* Key Characteristics */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Characteristics</h4>
            <ul className="space-y-2">
              {[
                'Clear demonstration of understanding',
                'Effective use of supporting materials',
                'Logical organization and flow',
                'Appropriate depth of analysis'
              ].map((item, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Suggestions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">AI Suggestions</h4>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-gray-800">
                Consider focusing on how the student demonstrates mastery of {selectedCell.criterion.toLowerCase()} 
                through specific examples and analysis. Look for clear connections between evidence and claims.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Existing Dialog Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedCell && (
          <Dialog
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 overflow-y-auto"
            open={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Dialog.Overlay
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black"
              />

              <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl rounded-2xl"
              >
                <div className={`p-4 rounded-lg bg-gradient-to-r ${criteria[selectedCell.criterion].color}`}>
                  <div className="flex items-center">
                    {(() => {
                      const IconComponent = criteria[selectedCell.criterion].icon;
                      return <IconComponent className="h-8 w-8 text-white" />;
                    })()}
                    <DialogPrimitive.Title className="ml-3 text-lg font-medium text-white">
                      {selectedCell.criterion}
                    </DialogPrimitive.Title>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center mb-4">
                    <span className="text-sm text-gray-500">Grade Level:</span>
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(selectedCell.grade)}`}>
                      {selectedCell.grade}
                    </span>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Detailed Description</h4>
                    <p className="text-gray-600">
                      {criteria[selectedCell.criterion].grades[selectedCell.grade]}
                    </p>

                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Characteristics</h4>
                      <motion.ul
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.1
                            }
                          }
                        }}
                        className="space-y-2"
                      >
                        {[
                          'Clear demonstration of understanding',
                          'Effective use of supporting materials',
                          'Logical organization and flow',
                          'Appropriate depth of analysis'
                        ].map((item, index) => (
                          <motion.li
                            key={index}
                            variants={{
                              hidden: { opacity: 0, x: -20 },
                              visible: { opacity: 1, x: 0 }
                            }}
                            className="flex items-center text-gray-600"
                          >
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                            {item}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherRubric;