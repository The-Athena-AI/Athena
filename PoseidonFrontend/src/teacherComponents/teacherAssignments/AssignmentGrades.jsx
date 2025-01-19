import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TeacherRubric from './TeacherRubric';
import { 
  FaSearch, 
  FaChevronLeft, 
  FaChevronRight, 
  FaExpandAlt, 
  FaLightbulb, 
  FaComments, 
  FaCheckCircle,
  FaPlus,
  FaMinus,
  FaMicrophone,
  FaChevronDown
} from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';



const AssignmentGrades = () => {
  const { id, submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('student-response');
  const [showJustifications, setShowJustifications] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentMark, setCurrentMark] = useState('A');
  const [progressStatus, setProgressStatus] = useState('Progressing well');
  const [selectedCriterion, setSelectedCriterion] = useState(null);
  const [rubricFeedback, setRubricFeedback] = useState(null);
  const [showSpeechBox, setShowSpeechBox] = useState(false);
  const [justification, setJustification] = useState('');
  const [gpa, setGpa] = useState(0);
  const [criteriaGrades, setCriteriaGrades] = useState({
    'Understanding': {
      grade: 3,
      status: 'Satisfactory',
      aiJustification: 'The student demonstrates a comprehensive understanding of the topic through well-structured arguments and relevant examples...',
      suggestedFeedback: 'Consider incorporating more specific textual evidence to support your analysis...',
      teacherJustification: '',
      feedback: '',
      rubricReference: 'Original Criteria > Discerning approach',
    },
    'Text structures': {
      grade: 2,
      status: 'Developing',
      aiJustification: 'The response shows developing competency in analyzing text structures, with some effective use of literary devices...',
      suggestedFeedback: 'Try to expand on how the author\'s use of language contributes to the overall meaning...',
      teacherJustification: '',
      feedback: '',
      rubricReference: 'Secondary Criteria > Effective evaluation',
    }
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [activeTextArea, setActiveTextArea] = useState(null);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-','D', 'F'];

  const adjustGrade = (direction) => {
    const currentIndex = grades.indexOf(currentMark);
    if (direction === 'increase' && currentIndex > 0) {
      setCurrentMark(grades[currentIndex - 1]);
      setShowSpeechBox(true);
      resetTranscript();
    } else if (direction === 'decrease' && currentIndex < grades.length - 1) {
      setCurrentMark(grades[currentIndex + 1]);
      setShowSpeechBox(true);
      resetTranscript();
    }
  };

  const highlights = [
    {
      text: "Shakespeare's masterful use of dramatic irony",
      color: "bg-green-200",
      criterion: "Discerning approach",
      feedback: "Shows deep understanding of dramatic irony as a literary device and its impact on audience engagement."
    },
    {
      text: "heightens the tragic impact",
      color: "bg-blue-200",
      criterion: "Evaluates structures",
      feedback: "Effectively analyzes how dramatic techniques contribute to the overall tragic effect of the play."
    },
    {
      text: "psychological complexity of the characters",
      color: "bg-yellow-200",
      criterion: "Different authors",
      feedback: "Demonstrates understanding of Shakespeare's unique approach to character development compared to other playwrights."
    }
  ];

  const handleHighlightClick = (e) => {
    const criterion = e.target.getAttribute('data-criterion');
    if (criterion) {
      setSelectedCriterion(criterion);
      const highlight = highlights.find(h => h.criterion === criterion);
      setRubricFeedback(highlight?.feedback);
      setShowJustifications(true);
    }
  };

  const getHighlightedContent = (content) => {
    let highlightedContent = content;
    highlights.forEach(({ text, color, criterion }) => {
      const regex = new RegExp(text, 'gi');
      highlightedContent = highlightedContent.replace(
        regex,
        `<span class="${color} cursor-pointer px-1 rounded hover:ring-2 hover:ring-blue-500" data-criterion="${criterion}">${text}</span>`
      );
    });
    return highlightedContent;
  };
  const handleSpeechInput = () => {
    setJustification(transcript);
  };

  const getLetterGrade = (gpa) => {
    if (gpa >= 4.0) return 'A';
    if (gpa >= 3.7) return 'A-';
    if (gpa >= 3.3) return 'B+';
    if (gpa >= 3.0) return 'B';
    if (gpa >= 2.7) return 'B-';
    if (gpa >= 2.5) return 'C+';
    if (gpa >= 2.0) return 'C';
    if (gpa >= 1.5) return 'C-';
    if (gpa >= 1.0) return 'D';
    return 'F';
  };

  const handleGradeChange = (newGpa) => {
    setGpa(newGpa);
    setCurrentMark(getLetterGrade(newGpa));
  };

  const adjustCriterionGrade = (criterion, direction) => {
    setCriteriaGrades(prev => {
      const newGrades = { ...prev };
      const currentGrade = newGrades[criterion].grade;
      const newGrade = direction === 'increase' 
        ? Math.min(currentGrade + 1, 4) 
        : Math.max(currentGrade - 1, 0);
      
      newGrades[criterion] = {
        ...newGrades[criterion],
        grade: newGrade,
        status: getGradeStatus(newGrade)
      };
      
      // Calculate overall GPA
      const allGrades = Object.values(newGrades).map(item => item.grade);
      const avgGrade = allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length;
      setGpa(avgGrade);
      setCurrentMark(getLetterGrade(avgGrade));
      
      return newGrades;
    });
  };

  const getGradeStatus = (grade) => {
    if (grade >= 3.5) return 'Excellent';
    if (grade >= 2.5) return 'Satisfactory';
    if (grade >= 1.5) return 'Developing';
    if (grade >= 0.5) return 'Limited';
    return 'Insufficient';
  };

  const toggleSection = (criterion, section) => {
    setExpandedSections(prev => {
      const key = `${criterion}-${section}`;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };

  const updateTeacherJustification = (criterion, justification) => {
    setCriteriaGrades(prev => ({
      ...prev,
      [criterion]: {
        ...prev[criterion],
        teacherJustification: justification
      }
    }));
  };

  const updateFeedback = (criterion, feedback) => {
    setCriteriaGrades(prev => ({
      ...prev,
      [criterion]: {
        ...prev[criterion],
        feedback: feedback
      }
    }));
  };

  const startListening = (criterion, field) => {
    setActiveTextArea({ criterion, field });
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    if (activeTextArea) {
      const { criterion, field } = activeTextArea;
      if (field === 'teacherJustification') {
        updateTeacherJustification(criterion, transcript);
      } else if (field === 'feedback') {
        updateFeedback(criterion, transcript);
      }
    }
    setActiveTextArea(null);
  };

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const mockSubmission = {
          id: submissionId,
          title: "Analysis of Dramatic Techniques in Shakespeare's Tragedies",
          content: `Shakespeare's masterful use of dramatic irony in his tragedies serves as a powerful tool for engaging audiences and heightens the tragic impact of his plays. This analysis explores how the playwright employs various dramatic techniques to create complex narratives that resonate with audiences across centuries.

In "Othello," Shakespeare crafts a masterpiece of psychological manipulation, where the audience's awareness of Iago's deception intensifies the emotional impact of each scene. The psychological complexity of the characters is revealed through carefully constructed dialogues and soliloquies, allowing viewers to witness the tragic consequences of misplaced trust and jealousy.

The play's structure demonstrates Shakespeare's sophisticated understanding of dramatic tension. By gradually building suspense through a series of carefully orchestrated revelations, he creates a compelling narrative that holds the audience's attention while exploring themes of love, betrayal, and racial prejudice in Venetian society.

Furthermore, Shakespeare's use of parallel plotlines and contrasting characters adds depth to the narrative. The relationship between Othello and Desdemona is juxtaposed with that of Iago and Emilia, highlighting themes of trust, loyalty, and deception from different perspectives. This multilayered approach enriches the audience's understanding of the play's central themes.

The tragic conclusion of the play demonstrates Shakespeare's ability to bring multiple narrative threads together in a powerful climax. The final scene, where Othello realizes the truth of Iago's manipulation too late, represents the culmination of the dramatic irony that has built throughout the play, creating a profound impact on the audience.`,
          status: 'in-progress'
        };
        setSubmission(mockSubmission);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submission:', error);
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Speech recognition is not supported in your browser.</span>;
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('student-response')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'student-response' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500'
                }`}
              >
                Student Response
              </button>
              <button
                onClick={() => setActiveTab('rubric')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'rubric' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500'
                }`}
              >
                Rubric
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500">Current Grade</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-indigo-600">{currentMark}</span>
                  <span className="text-sm text-gray-500">({gpa.toFixed(2)} GPA)</span>
                </div>
              </div>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <FaCheckCircle />
                Mark Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'student-response' ? (
          // Student Response View
          <div className="flex gap-4">
            {/* Left Panel - Student Response */}
            <div className="mb-6 flex justify-normal space-x-2">
              <div className="bg-white rounded-lg">
                <div className="h-[calc(100vh-8rem)] overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded hover:bg-gray-100">
                        <FaChevronLeft />
                      </button>
                      <button className="p-2 rounded hover:bg-gray-100">
                        <FaChevronRight />
                      </button>
                    </div>
                    <button className="p-2 rounded hover:bg-gray-100">
                      <FaExpandAlt />
                    </button>
                  </div>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: getHighlightedContent(submission.content)
                    }}
                    onClick={handleHighlightClick}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Grading Interface */}
            <div className="container w-[48rem]">
              <div className="bg-white rounded-lg p-8 h-[calc(100vh-8rem)] overflow-y-auto">
                {Object.entries(criteriaGrades).map(([criterion, data]) => (
                  <div key={criterion} className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="mb-4">
                      <h3 className="text-base font-medium text-gray-800">{criterion}</h3>
                      <p className="text-sm text-gray-600 mb-2">{data.status}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Justification Section */}
                      <button
                        onClick={() => toggleSection(criterion, 'justification')}
                        className="w-full flex items-center justify-between p-2 bg-white rounded-lg hover:bg-gray-100"
                      >
                        <span className="text-sm font-medium">Justification</span>
                        <FaChevronDown 
                          size={12} 
                          className={`transform transition-transform ${
                            expandedSections[`${criterion}-justification`] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedSections[`${criterion}-justification`] && (
                        <div className="bg-white p-4 rounded-lg space-y-3">
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">AI Analysis:</p>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-800">{data.aiJustification || "The student demonstrates a strong understanding of the topic through..."}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">Rubric Alignment:</p>
                            <div className="bg-indigo-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-indigo-800">{data.rubricReference}</p>
                              <p className="text-sm text-gray-700 mt-1">
                                This response aligns with the following criteria:
                                <ul className="list-disc ml-4 mt-1">
                                  <li>Clear demonstration of concept understanding</li>
                                  <li>Effective use of supporting evidence</li>
                                  <li>Logical organization of ideas</li>
                                </ul>
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">Teacher Notes:</p>
                            <div className="relative">
                              <textarea
                                value={activeTextArea?.criterion === criterion && 
                                       activeTextArea?.field === 'teacherJustification' 
                                       ? transcript 
                                       : data.teacherJustification}
                                onChange={(e) => updateTeacherJustification(criterion, e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-md p-2 min-h-[80px] pr-10"
                                placeholder="Add your notes here..."
                              />
                              <button
                                onClick={() => {
                                  if (activeTextArea?.criterion === criterion && 
                                      activeTextArea?.field === 'teacherJustification') {
                                    stopListening();
                                  } else {
                                    startListening(criterion, 'teacherJustification');
                                  }
                                }}
                                className={`absolute right-2 top-2 p-2 rounded-full 
                                  ${listening && activeTextArea?.criterion === criterion && 
                                    activeTextArea?.field === 'teacherJustification'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-gray-100 text-gray-600'} 
                                  hover:bg-gray-200`}
                              >
                                <FaMicrophone size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Feedback Section */}
                      <button
                        onClick={() => toggleSection(criterion, 'feedback')}
                        className="w-full flex items-center justify-between p-2 bg-white rounded-lg hover:bg-gray-100"
                      >
                        <span className="text-sm font-medium">Feedback</span>
                        <FaChevronDown 
                          size={12} 
                          className={`transform transition-transform ${
                            expandedSections[`${criterion}-feedback`] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedSections[`${criterion}-feedback`] && (
                        <div className="bg-white p-4 rounded-lg space-y-3">
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">Suggested Feedback:</p>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-800">
                                {data.suggestedFeedback || "Consider providing specific examples to strengthen your argument..."}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">Custom Feedback:</p>
                            <div className="relative">
                              <textarea
                                value={activeTextArea?.criterion === criterion && 
                                       activeTextArea?.field === 'feedback' 
                                       ? transcript 
                                       : data.feedback}
                                onChange={(e) => updateFeedback(criterion, e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-md p-2 min-h-[100px] pr-10"
                                placeholder="Enter your feedback for the student..."
                              />
                              <button
                                onClick={() => {
                                  if (activeTextArea?.criterion === criterion && 
                                      activeTextArea?.field === 'feedback') {
                                    stopListening();
                                  } else {
                                    startListening(criterion, 'feedback');
                                  }
                                }}
                                className={`absolute right-2 top-2 p-2 rounded-full 
                                  ${listening && activeTextArea?.criterion === criterion && 
                                    activeTextArea?.field === 'feedback'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-gray-100 text-gray-600'} 
                                  hover:bg-gray-200`}
                              >
                                <FaMicrophone size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                              <FaLightbulb size={12} />
                              Suggest Improvement
                            </button>
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                              <FaComments size={12} />
                              Add Comment
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Grade Controls */}
                    <div className="mt-4 flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="text-sm font-medium mr-2">Grade</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            adjustCriterionGrade(criterion, 'decrease');
                            setSelectedCriterion(criterion);
                          }}
                          className="p-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                          disabled={data.grade === 0}
                        >
                          <FaMinus size={12} />
                        </button>
                        <div className="px-10 py-1 bg-orange-100 text-orange-800 rounded-lg">
                          {data.grade}
                        </div>
                        <button
                          onClick={() => {
                            adjustCriterionGrade(criterion, 'increase');
                            setSelectedCriterion(criterion);
                          }}
                          className="p-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                          disabled={data.grade === 4}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Rubric View
          <TeacherRubric 
            selectedCriterion={selectedCriterion}
            onGradeChange={handleGradeChange}
            criteriaGrades={criteriaGrades}
          />
        )}
      </div>
    </div>
  );
};

export default AssignmentGrades; 