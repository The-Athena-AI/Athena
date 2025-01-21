import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherRubric from './TeacherRubric';
import { 
  FaSearch, 
  FaChevronLeft, 
  FaChevronRight, 
  FaExpandAlt, 
  FaLightbulb, 
  FaCheckCircle,
  FaPlus,
  FaMinus,
  FaMicrophone,
  FaChevronDown,
  FaCommentAlt,
  FaHighlighter
} from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { motion } from 'framer-motion';

const commentPopupVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: -10 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: 10,
    transition: {
      duration: 0.2
    }
  }
};

const AssignmentGrades = () => {
  const navigate = useNavigate();
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
    'Introduction/Opening': {
      grade: null, // Initially null until AI grades it
      status: null,
      aiJustification: null,
      suggestedFeedback: null,
      teacherJustification: '',
      feedback: '',
      rubricReference: 'Introduction > Opening Statement',
      aiGraded: false // Flag to track if AI has graded this criterion
    },
    'Text Evidence': {
      grade: null,
      status: null,
      aiJustification: null,
      suggestedFeedback: null,
      teacherJustification: '',
      feedback: '',
      rubricReference: 'Evidence > Textual Support',
      aiGraded: false
    },
    'Explanation': {
      grade: null,
      status: null,
      aiJustification: null,
      suggestedFeedback: null,
      teacherJustification: '',
      feedback: '',
      rubricReference: 'Analysis > Explanation',
      aiGraded: false
    },
    'Conclusion': {
      grade: null,
      status: null,
      aiJustification: null,
      suggestedFeedback: null,
      teacherJustification: '',
      feedback: '',
      rubricReference: 'Conclusion > Summary',
      aiGraded: false
    },
    'Organization': {
      grade: null,
      status: null,
      aiJustification: null,
      suggestedFeedback: null,
      teacherJustification: '',
      feedback: '',
      rubricReference: 'Structure > Organization',
      aiGraded: false
    }
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [activeTextArea, setActiveTextArea] = useState(null);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [sidebarWidth, setSidebarWidth] = useState(480); // 48rem = 480px
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [comments, setComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [placedComments, setPlacedComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);

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
      text: "masterful use of dramatic irony",
      color: "bg-yellow-400/20",
      criterion: "Introduction/Opening",
      feedback: "Strong opening that effectively introduces the literary device."
    },
    {
      text: "psychological manipulation",
      color: "bg-green-400/20",
      criterion: "Text Evidence",
      feedback: "Excellent use of specific examples to support analysis."
    },
    {
      text: "carefully constructed dialogues",
      color: "bg-blue-400/20",
      criterion: "Explanation",
      feedback: "Clear explanation of how dialogue reveals character complexity."
    },
    {
      text: "gradually building suspense",
      color: "bg-purple-400/20",
      criterion: "Organization",
      feedback: "Well-structured progression of ideas enhances dramatic tension."
    },
    {
      text: "profound impact on the audience",
      color: "bg-red-400/20",
      criterion: "Conclusion",
      feedback: "Strong concluding statement that ties back to the thesis."
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
    
    // First apply the random highlights
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight.text})`, 'gi');
      highlightedContent = highlightedContent.replace(
        regex,
        `<span class="relative group cursor-pointer ${highlight.color} px-1 rounded" data-criterion="${highlight.criterion}">\$1</span>`
      );
    });
    
    // Then apply any user comments
    comments.forEach(comment => {
      const regex = new RegExp(comment.selectedText, 'gi');
      highlightedContent = highlightedContent.replace(
        regex,
        `<span class="relative group">
          <span class="bg-yellow-400/10 transition-all duration-200 group-hover:bg-yellow-400/20 px-1 rounded">${comment.selectedText}</span>
          <div class="absolute -top-1 -right-1 transform translate-x-full opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div class="flex items-center space-x-1">
              <div class="relative">
                <button class="p-1.5 rounded-full bg-gray-900 shadow-sm hover:shadow-md text-yellow-400 hover:text-yellow-500 transition-all duration-200">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                  </svg>
                </button>
                <div class="absolute left-0 top-full mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-2 text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <p class="text-yellow-400 font-medium mb-1">${comment.text}</p>
                  <p class="text-yellow-400/70 text-xs">${new Date(comment.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </span>`
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

  const handleGradeChange = useCallback((criterion, grade) => {
    setCriteriaGrades(prev => ({
      ...prev,
      [criterion]: {
        ...prev[criterion],
        grade: grade,
        status: getGradeStatus(grade)
      }
    }));
    
    // Calculate overall GPA
    const allGrades = Object.values(criteriaGrades).map(item => item.grade);
    const avgGrade = allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length;
    setGpa(avgGrade);
    setCurrentMark(getLetterGrade(avgGrade));
  }, [criteriaGrades]);

  const handleUpdateNotes = useCallback((criterion, notes) => {
    setCriteriaGrades(prev => ({
      ...prev,
      [criterion]: {
        ...prev[criterion],
        teacherJustification: notes
      }
    }));
  }, []);

  const handleUpdateFeedback = useCallback((criterion, feedback) => {
    setCriteriaGrades(prev => ({
      ...prev,
      [criterion]: {
        ...prev[criterion],
        feedback: feedback
      }
    }));
  }, []);

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
        handleUpdateNotes(criterion, transcript);
      } else if (field === 'feedback') {
        handleUpdateFeedback(criterion, transcript);
      }
    }
    setActiveTextArea(null);
  };

  // Mock function to simulate AI grading - replace this with actual AI grading logic
  const simulateAIGrading = useCallback((content) => {
    // This is just a mock example - replace with actual AI grading logic
    setCriteriaGrades(prev => ({
      ...prev,
      'Introduction/Opening': {
        ...prev['Introduction/Opening'],
        grade: 3,
        status: 'Strong',
        aiGraded: true,
        aiJustification: 'The introduction presents a clear thesis statement with well-defined main ideas. The opening effectively engages the reader and sets up the main arguments.',
        suggestedFeedback: 'Consider strengthening the connection between the thesis and the broader implications of your argument.'
      },
      'Text Evidence': {
        ...prev['Text Evidence'],
        grade: 4,
        status: 'Excellent',
        aiGraded: true,
        aiJustification: 'Exceptional use of textual evidence throughout the essay. Citations are relevant, well-integrated, and effectively support the main arguments.',
        suggestedFeedback: 'Your use of evidence is strong. Consider incorporating more varied types of evidence to further strengthen your analysis.'
      },
      'Explanation': {
        ...prev['Explanation'],
        grade: 3,
        status: 'Strong',
        aiGraded: true,
        aiJustification: 'Clear and effective explanation of evidence with strong connections to the thesis. Analysis demonstrates good understanding of the material.',
        suggestedFeedback: 'Try to deepen your analysis by exploring alternative interpretations of the evidence.'
      },
      'Conclusion': {
        ...prev['Conclusion'],
        grade: 2,
        status: 'Developing',
        aiGraded: true,
        aiJustification: 'Basic conclusion that restates main points but could be more synthesized. The ending would benefit from deeper reflection.',
        suggestedFeedback: 'Work on developing a more impactful conclusion that extends beyond simple summary.'
      },
      'Organization': {
        ...prev['Organization'],
        grade: 4,
        status: 'Excellent',
        aiGraded: true,
        aiJustification: 'Sophisticated organization with seamless transitions between paragraphs. Ideas flow logically and build upon each other effectively.',
        suggestedFeedback: 'Your organization is excellent. Consider using more varied transition techniques to further enhance flow.'
      }
    }));
  }, []);

  const handleTextSelection = () => {
    if (!isHighlightMode) return;
    
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(text);
      setCommentPosition({
        x: rect.right + window.scrollX,
        y: rect.top + window.scrollY
      });
      setActiveComment({
        text: '',
        position: { x: rect.right, y: rect.top },
        selectedText: text,
        range: range.cloneRange()
      });
    }
  };

  const saveComment = (commentText) => {
    if (activeComment) {
      const newComment = {
        id: Date.now(),
        text: commentText,
        selectedText: activeComment.selectedText,
        position: activeComment.position,
        timestamp: new Date().toISOString()
      };

      // Create highlight span with comment icon
      const range = activeComment.range;
      const wrapper = document.createElement('span');
      wrapper.className = 'relative inline-block group';

      const highlight = document.createElement('span');
      highlight.className = 'bg-yellow-100';
      highlight.textContent = activeComment.selectedText;
      
      const iconWrapper = document.createElement('span');
      iconWrapper.className = 'absolute -right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity';
      
      const icon = document.createElement('button');
      icon.className = 'p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600';
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-2 0c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" clip-rule="evenodd"/>
        <path fill-rule="evenodd" d="M10 6a1 1 0 011 1v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2V7a1 1 0 011-1z" clip-rule="evenodd"/>
      </svg>`;
      
      // Add tooltip for the comment
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-50';
      tooltip.innerHTML = `
        <div class="text-sm text-gray-800">${commentText}</div>
        <div class="text-xs text-gray-500 mt-1">${new Date().toLocaleString()}</div>
      `;

      iconWrapper.appendChild(icon);
      iconWrapper.appendChild(tooltip);
      wrapper.appendChild(highlight);
      wrapper.appendChild(iconWrapper);

      // Replace the selected text with our wrapper
      range.deleteContents();
      range.insertNode(wrapper);

      setComments(prev => [...prev, newComment]);
      setActiveComment(null);
      setSelectedText('');
    }
  };

  // Add a function to get all comments for a specific text selection
  const getCommentsForSelection = (text) => {
    return comments.filter(comment => comment.selectedText === text);
  };

  // Track cursor position when in comment mode
  const handleMouseMove = useCallback((e) => {
    if (isCommentMode) {
      setCursorPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  }, [isCommentMode]);

  // Handle placing a comment
  const handlePlaceComment = useCallback((e) => {
    if (isCommentMode && e.target.closest('.prose')) {
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range) {
        const rect = range.getBoundingClientRect();
        const contentContainer = e.target.closest('.prose');
        const containerRect = contentContainer.getBoundingClientRect();
        
        // Get the selected text around the click
        range.expand('word');
        const selectedText = range.toString().trim();
        
        const newComment = {
          id: Date.now(),
          x: e.clientX - containerRect.left,
          y: rect.top - containerRect.top,
          text: '',
          selectedText,
          timestamp: new Date().toISOString()
        };
        setPlacedComments(prev => [...prev, newComment]);
        setSelectedComment(newComment);
        setIsCommentMode(false);
      }
    }
  }, [isCommentMode]);

  // Save comment text
  const handleSaveComment = (commentId, text) => {
    setPlacedComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, text } 
        : comment
    ));
    setSelectedComment(null);
  };

  // Modify the getPopupPosition function to handle undefined rect
  const getPopupPosition = (rect, popupWidth = 240) => {
    if (!rect || typeof rect.right === 'undefined') {
      return {
        left: 0,
        top: 0,
        transformOrigin: 'left top'
      };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Default position (to the right)
    let position = {
      left: rect.right + 10,
      top: rect.top,
      transformOrigin: 'left top'
    };

    // Check if popup would overflow right edge
    if (rect.right + 10 + popupWidth > viewportWidth) {
      position.left = rect.left - popupWidth - 10;
      position.transformOrigin = 'right top';
    }

    // Check if popup would overflow bottom edge
    if (rect.top + 300 > viewportHeight) { // 300 is approximate max height
      position.top = Math.max(viewportHeight - 300, 10);
    }

    return position;
  };

  // Modify the renderContent function to remove hover preview
  const renderContent = () => {
    return (
      <div className="prose max-w-none relative">
        <div className="relative">
          {submission.content}
          {/* Placed comments */}
          {placedComments.map(comment => (
            <div
              key={comment.id}
              data-comment-id={comment.id}
              className="absolute inline-flex items-center"
              style={{ 
                left: comment.x + 'px',
                top: comment.y + 'px'
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setSelectedComment(selectedComment?.id === comment.id ? null : {
                    ...comment,
                    rect,
                    x: comment.x,
                    y: comment.y
                  });
                }}
                className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-sm"
              >
                <FaCommentAlt size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Modify the CommentPopup component to use the correct positioning
  const CommentPopup = ({ comment }) => {
    const [isEditing, setIsEditing] = useState(!comment.text);
    const [editText, setEditText] = useState(comment.text);
    
    // Calculate position relative to the comment icon
    const style = {
      position: 'absolute',
      top: comment.y + 'px',
      left: (comment.x + 30) + 'px',
      width: '240px',
      transformOrigin: 'left top',
      zIndex: 50
    };

    // Adjust position if it would overflow the viewport
    if (comment.rect && comment.rect.right + 250 > window.innerWidth) {
      style.left = (comment.x - 250) + 'px';
      style.transformOrigin = 'right top';
    }

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={commentPopupVariants}
        className="absolute bg-white rounded-lg shadow-lg border border-gray-100"
        style={style}
      >
        <div className="p-3">
          {isEditing ? (
            <>
              <textarea
                className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                placeholder="Add your comment..."
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                autoFocus
              />
              <div className="flex justify-end items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    if (comment.text) {
                      setIsEditing(false);
                      setEditText(comment.text);
                    } else {
                      setSelectedComment(null);
                    }
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSaveComment(comment.id, editText);
                    setIsEditing(false);
                  }}
                  className="px-2.5 py-1 text-xs font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow group"
                >
                  <span>Save</span>
                  <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {new Date(comment.timestamp).toLocaleString()}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-700"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-gray-800">{comment.text}</p>
              {comment.selectedText && (
                <div className="text-xs bg-indigo-50 text-indigo-700 p-1.5 rounded">
                  "{comment.selectedText}"
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
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
        // Simulate AI grading when submission is loaded
        simulateAIGrading(mockSubmission.content);
      } catch (error) {
        console.error('Error fetching submission:', error);
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId, simulateAIGrading]);

  useEffect(() => {
    if (isCommentMode) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isCommentMode, handleMouseMove]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Speech recognition is not supported in your browser.</span>;
  }
  

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('student-response')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'student-response' 
                    ? 'text-yellow-400 border-b-2 border-yellow-400' 
                    : 'text-yellow-400/70'
                }`}
              >
                Student Response
              </button>
              <button
                onClick={() => setActiveTab('rubric')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'rubric' 
                    ? 'text-yellow-400 border-b-2 border-yellow-400' 
                    : 'text-yellow-400/70'
                }`}
              >
                Rubric
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm text-yellow-400/70">Current Grade</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-400">{currentMark}</span>
                  <span className="text-sm text-yellow-400/70">({gpa.toFixed(2)} GPA)</span>
                </div>
              </div>
              <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 flex items-center gap-2 transition-colors">
                <FaCheckCircle />
                <button onClick={() => {navigate('/teacher-dashboard/assignments/2')}}>
                Mark Assessment
                </button>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className={`flex ${activeTab === 'rubric' ? 'justify-center' : 'gap-4'}`}>
          {/* Left Panel */}
          <div className={`${activeTab === 'rubric' ? 'w-full max-w-6xl' : 'flex-1'}`}>
            <div className="bg-gray-900 rounded-lg border border-gray-800">
              <div 
                className="h-[calc(100vh-8rem)] overflow-y-auto p-6"
                onClick={handlePlaceComment}
              >
                {activeTab === 'student-response' ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded hover:bg-black/50 text-yellow-400">
                          <FaChevronLeft />
                        </button>
                        <button className="p-2 rounded hover:bg-black/50 text-yellow-400">
                          <FaChevronRight />
                        </button>
                      </div>
                      <button className="p-2 rounded hover:bg-black/50 text-yellow-400">
                        <FaExpandAlt />
                      </button>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: getHighlightedContent(submission.content) }} 
                           className="text-yellow-400/90" 
                           onClick={handleHighlightClick} 
                      />
                    </div>
                  </>
                ) : (
                  <TeacherRubric 
                    selectedCriterion={selectedCriterion}
                    onGradeChange={handleGradeChange}
                    criteriaGrades={criteriaGrades}
                    onUpdateNotes={handleUpdateNotes}
                    onUpdateFeedback={handleUpdateFeedback}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Only show for student response tab */}
          {activeTab === 'student-response' && (
            <ResizableBox
              width={sidebarWidth}
              height={Infinity}
              minConstraints={[300, Infinity]}
              maxConstraints={[800, Infinity]}
              onResize={(e, { size }) => setSidebarWidth(size.width)}
              handle={
                <div className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize bg-gray-800 hover:bg-yellow-400 transition-colors" />
              }
              axis="x"
              resizeHandles={['w']}
            >
              <div className="relative bg-gray-900 rounded-lg p-8 h-[calc(100vh-8rem)] overflow-y-auto border border-gray-800">
                <div className="static top-0 bg-gray-900 z-10 p-4 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-yellow-400">AI Grading</h3>
                    <button
                      onClick={() => setIsCommentMode(!isCommentMode)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        isCommentMode 
                          ? 'bg-yellow-400/10 text-yellow-400 ring-2 ring-yellow-400 ring-opacity-50' 
                          : 'bg-gray-900 text-yellow-400 hover:bg-yellow-400/10'
                      }`}
                    >
                      <FaCommentAlt size={14} />
                    </button>
                  </div>
                </div>
                {Object.entries(criteriaGrades).map(([criterion, data]) => (
                  <div key={criterion} className="bg-black rounded-lg p-6 mb-6 border border-gray-800">
                    <div className="mb-4">
                      <h3 className="text-base font-medium text-yellow-400">{criterion}</h3>
                      <p className="text-sm text-yellow-400/70 mb-2">{data.status}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Justification Section */}
                      <button
                        onClick={() => toggleSection(criterion, 'justification')}
                        className="w-full flex items-center justify-between p-2 bg-gray-900 rounded-lg hover:bg-gray-800"
                      >
                        <span className="text-sm font-medium text-yellow-400">Justification</span>
                        <FaChevronDown 
                          size={12} 
                          className={`transform transition-transform text-yellow-400 ${
                            expandedSections[`${criterion}-justification`] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedSections[`${criterion}-justification`] && (
                        <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                          <p className="text-sm text-yellow-400/70">
                            {data.aiJustification || 'AI analysis pending...'}
                          </p>
                        </div>
                      )}

                      {/* Feedback Section */}
                      <button
                        onClick={() => toggleSection(criterion, 'feedback')}
                        className="w-full flex items-center justify-between p-2 bg-gray-900 rounded-lg hover:bg-gray-800"
                      >
                        <span className="text-sm font-medium text-yellow-400">Feedback</span>
                        <FaChevronDown 
                          size={12} 
                          className={`transform transition-transform text-yellow-400 ${
                            expandedSections[`${criterion}-feedback`] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedSections[`${criterion}-feedback`] && (
                        <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                          <p className="text-sm text-yellow-400/70">
                            {data.suggestedFeedback || 'Feedback pending...'}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between p-2 bg-gray-900 rounded-lg">
                        <span className="text-sm font-medium text-yellow-400 mr-2">Grade</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              handleGradeChange(criterion, Math.max(data.grade - 1, 0));
                              setSelectedCriterion(criterion);
                            }}
                            className="p-1 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500"
                            disabled={data.grade === 0}
                          >
                            <FaMinus size={12} />
                          </button>
                          <div className="px-10 py-1 bg-yellow-400/20 text-yellow-400 rounded-lg">
                            {data.grade}
                          </div>
                          <button
                            onClick={() => {
                              handleGradeChange(criterion, Math.min(data.grade + 1, 4));
                              setSelectedCriterion(criterion);
                            }}
                            className="p-1 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500"
                            disabled={data.grade === 4}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ResizableBox>
          )}
        </div>
      </div>

      {/* Floating comment icon that follows cursor in comment mode */}
      {isCommentMode && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: cursorPosition.x + 'px',
            top: cursorPosition.y + 'px'
          }}
        >
          <div className="w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-lg">
            <FaCommentAlt size={12} />
          </div>
        </div>
      )}

      {/* Replace the comment popup with the new CommentPopup component */}
      {selectedComment && <CommentPopup comment={selectedComment} />}
    </div>
  );
};

export default AssignmentGrades; 