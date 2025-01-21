import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  XMarkIcon,
  PencilIcon,
  ChatBubbleLeftIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaCommentAlt } from 'react-icons/fa';

const TeacherRubric = ({ 
  selectedCriterion, 
  onGradeChange, 
  criteriaGrades,
  aiJustification,
  suggestedFeedback,
  onUpdateNotes,
  onUpdateFeedback
}) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [teacherNotes, setTeacherNotes] = useState({});
  const [editingNotes, setEditingNotes] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('justification');
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const criteria = {
    'Introduction/Opening': {
      Icon: AcademicCapIcon,
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
      Icon: ChartBarIcon,
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
      Icon: LightBulbIcon,
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
      Icon: CheckCircleIcon,
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
      Icon: ExclamationCircleIcon,
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

  // Update selected cell when criteriaGrades changes
  useEffect(() => {
    if (selectedCriterion && criteriaGrades[selectedCriterion]) {
      setSelectedCell({
        criterion: selectedCriterion,
        grade: criteriaGrades[selectedCriterion].grade
      });
    }
  }, [selectedCriterion, criteriaGrades]);

  const handleCellClick = (criterion, grade) => {
    setSelectedCell(selectedCell?.criterion === criterion && selectedCell?.grade === grade 
      ? null 
      : { criterion, grade });
    if (onGradeChange) {
      onGradeChange(criterion, grade);
    }
  };

  const handleNotesChange = (criterion, grade, notes) => {
    setTeacherNotes(prev => {
      const newNotes = {
        ...prev,
        [`${criterion}-${grade}`]: notes
      };
      if (onUpdateNotes) {
        onUpdateNotes(criterion, notes);
      }
      return newNotes;
    });
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 0: return 'bg-yellow-400/10 text-yellow-400';
      case 1: return 'bg-yellow-400/20 text-yellow-400';
      case 2: return 'bg-yellow-400/30 text-yellow-400';
      case 3: return 'bg-yellow-400/40 text-yellow-400';
      case 4: return 'bg-yellow-400/50 text-yellow-400';
      default: return 'bg-gray-900 text-yellow-400/70';
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

  const expandedContentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const handleSpeechInput = (criterion, grade) => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      // Update notes with transcript
      setTeacherNotes(prev => ({
        ...prev,
        [`${criterion}-${grade}`]: (prev[`${criterion}-${grade}`] || '') + ' ' + transcript
      }));
      resetTranscript();
    } else {
      setIsListening(true);
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className="bg-gray-900 rounded-lg shadow-lg p-6 w-full border border-gray-800"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-yellow-400">Grading Rubric</h2>
        <p className="mt-2 text-sm text-yellow-400/70">
          Click on any cell to view detailed criteria and descriptions
        </p>
      </div>

      <div className="bg-black rounded-xl shadow-lg overflow-hidden border border-gray-800">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-800 bg-gray-900/50 p-4 text-left text-sm font-semibold text-yellow-400">
                Criteria
              </th>
              {[0, 1, 2, 3, 4].map(grade => (
                <th key={grade} className="border-b border-gray-800 bg-gray-900/50 p-4 text-center text-sm font-semibold text-yellow-400">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(grade)}`}>
                    Grade {grade}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {Object.entries(criteria).map(([criterion, { Icon, color, grades }]) => (
              <React.Fragment key={criterion}>
                <motion.tr
                  variants={rowVariants}
                  className={`hover:bg-gray-900/50 ${
                    selectedCell?.criterion === criterion ? 'bg-gray-900/50' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-yellow-400/70 mr-3" />
                      <span className="font-medium text-yellow-400">{criterion}</span>
                    </div>
                  </td>
                  {[0, 1, 2, 3, 4].map(grade => (
                    <td
                      key={grade}
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                        criteriaGrades[criterion]?.grade === grade
                          ? 'bg-yellow-400/10 ring-2 ring-yellow-400 ring-inset'
                          : selectedCell?.criterion === criterion && selectedCell?.grade === grade
                          ? 'bg-yellow-400/5 ring-2 ring-yellow-400/50 ring-inset'
                          : ''
                      }`}
                      onClick={() => handleCellClick(criterion, grade)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-20 text-sm text-yellow-400/70 overflow-hidden"
                      >
                        {grades[grade]}
                      </motion.div>
                    </td>
                  ))}
                </motion.tr>
                
                {/* Expanded Content */}
                <AnimatePresence>
                  {selectedCell?.criterion === criterion && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      <td colSpan="6" className="p-0">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="relative z-20"
                        >
                          {/* Initial small container with buttons */}
                          <div className="bg-gray-900 border-t border-b border-gray-800">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
                                    <Icon className="h-5 w-5 text-white" />
                                  </div>
                                  <h3 className="ml-3 text-lg font-semibold text-yellow-400">
                                    {criterion} - Grade {selectedCell.grade}
                                  </h3>
                                </div>
                                <button
                                  onClick={() => setSelectedCell(null)}
                                  className="text-yellow-400/70 hover:text-yellow-400"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                              
                              <div className="flex gap-3">
                                <button
                                  onClick={() => setActiveTab('justification')}
                                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'justification'
                                      ? 'bg-yellow-400/10 text-yellow-400 ring-2 ring-yellow-400 ring-opacity-50'
                                      : 'bg-gray-900 text-yellow-400 hover:bg-gray-800'
                                  }`}
                                >
                                  Justification
                                </button>
                                <button
                                  onClick={() => setActiveTab('feedback')}
                                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'feedback'
                                      ? 'bg-yellow-400/10 text-yellow-400 ring-2 ring-yellow-400 ring-opacity-50'
                                      : 'bg-gray-900 text-yellow-400 hover:bg-gray-800'
                                  }`}
                                >
                                  Feedback
                                </button>
                                <button
                                  onClick={() => setActiveTab('edit')}
                                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'edit'
                                      ? 'bg-yellow-400/10 text-yellow-400 ring-2 ring-yellow-400 ring-opacity-50'
                                      : 'bg-gray-900 text-yellow-400 hover:bg-gray-800'
                                  }`}
                                >
                                  Edit Rubric
                                </button>
                              </div>
                            </div>

                            {/* Expanded content based on active tab */}
                            <AnimatePresence mode="sync">
                              {activeTab === 'justification' && (
                                <motion.div
                                  key="justification"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6 border-t border-gray-800 space-y-6">
                                    <div>
                                      <h4 className="text-sm font-medium text-yellow-400 mb-2">
                                        Grade Description
                                      </h4>
                                      <div className={`p-4 rounded-lg ${getGradeColor(selectedCell.grade)}`}>
                                        <p className="text-sm">{grades[selectedCell.grade]}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-yellow-400 mb-2">
                                        AI Analysis
                                      </h4>
                                      <div className="bg-yellow-400/10 rounded-lg p-4">
                                        <p className="text-sm text-yellow-400">
                                          {criteriaGrades[criterion]?.aiJustification || 
                                           `Consider focusing on how the student demonstrates mastery of ${criterion.toLowerCase()} 
                                           through specific examples and analysis.`}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {activeTab === 'feedback' && (
                                <motion.div
                                  key="feedback"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6 border-t border-gray-800 space-y-6">
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-yellow-400">
                                          Teacher Notes
                                        </h4>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleSpeechInput(criterion, selectedCell.grade)}
                                            className={`p-2 rounded-full transition-colors ${
                                              isListening && listening
                                                ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20'
                                                : 'bg-gray-900 text-yellow-400 hover:bg-gray-800'
                                            }`}
                                          >
                                            <MicrophoneIcon className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => setEditingNotes(!editingNotes)}
                                            className="text-yellow-400 hover:text-yellow-500 text-sm flex items-center"
                                          >
                                            <PencilIcon className="h-4 w-4 mr-1" />
                                            {editingNotes ? 'Save' : 'Edit'}
                                          </button>
                                        </div>
                                      </div>
                                      {editingNotes ? (
                                        <div className="relative">
                                          <textarea
                                            value={teacherNotes[`${criterion}-${selectedCell.grade}`] || criteriaGrades[criterion]?.teacherJustification || ''}
                                            onChange={(e) => handleNotesChange(criterion, selectedCell.grade, e.target.value)}
                                            className="w-full h-32 p-3 border border-gray-800 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 bg-black text-yellow-400"
                                            placeholder="Add your notes here..."
                                          />
                                        </div>
                                      ) : (
                                        <div className="bg-black p-3 border border-gray-800 rounded-lg min-h-[8rem] text-yellow-400">
                                          {teacherNotes[`${criterion}-${selectedCell.grade}`] || 
                                           criteriaGrades[criterion]?.teacherJustification || 
                                           <span className="text-yellow-400/50 italic">No notes added yet</span>
                                          }
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-yellow-400 mb-2">
                                        Suggested Feedback
                                      </h4>
                                      <div className="bg-yellow-400/10 rounded-lg p-4">
                                        <p className="text-sm text-yellow-400">
                                          {criteriaGrades[criterion]?.suggestedFeedback || 
                                           'Consider providing more specific examples to strengthen your argument.'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {activeTab === 'edit' && (
                                <motion.div
                                  key="edit"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6 border-t border-gray-800">
                                    <div className="text-center text-yellow-400 py-8">
                                      <PencilIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                      <p>Rubric editing functionality coming soon...</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Blur overlay for content below */}
                          <div 
                            className="absolute inset-x-0 top-full h-[500vh] pointer-events-none bg-gray-900/50 backdrop-blur-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCell(null);
                            }}
                          />
                        </motion.div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TeacherRubric;
