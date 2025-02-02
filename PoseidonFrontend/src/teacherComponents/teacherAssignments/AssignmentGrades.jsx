// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useRef } from 'react';
// import { 
//   FaArrowLeft,
//   FaFileAlt,
// } from 'react-icons/fa';
// import { supabase } from '../../supabase';
// import { validateGradeData, formatGradeDataForAPI } from '../../utils/gradeValidation';
// import { gradeSubmissionService, prepareGradeData } from '../../services/gradeService';

// const gradeSubmissionService = async (gradeData) => {
//   try {
//     const { error: updateError } = await supabase
//       .from('SubmittedAssignment')
//       .update({
//         teacher_grade: gradeData.grade,
//         teacher_feedback: gradeData.feedback,
//         graded_at: new Date().toISOString(),
//         status: 'graded',
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', gradeData.submissionId);

//     if (updateError) throw updateError;

//     return {
//       success: true,
//       message: 'Grade submitted successfully!',
//       data: {
//         submissionId: gradeData.submissionId,
//         grade: gradeData.grade,
//         status: 'graded'
//       }
//     };
//   } catch (error) {
//     throw new Error(error.message || 'Failed to submit grade');
//   }
// };

// const AssignmentGrades = ({ userId }) => {
//   const navigate = useNavigate();
//   const { assignmentId, submissionId } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [assignment, setAssignment] = useState(null);
//   const [submission, setSubmission] = useState(null);
//   const [grade, setGrade] = useState('');
//   const [feedback, setFeedback] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [saveStatus, setSaveStatus] = useState('saved');
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const autoSaveTimeoutRef = useRef(null);

//   const autoSave = useCallback(async () => {
//     if (!hasUnsavedChanges) return;

//     try {
//       setSaveStatus('saving');
      
//       const gradeData = {
//         submissionId: submission.id,
//         grade: parseFloat(grade),
//         feedback,
//         teacherId: userId,
//         studentId: submission.student.id,
//         classId: assignment.class.id
//       };

//       await gradeSubmissionService(gradeData);
      
//       setSaveStatus('saved');
//       setHasUnsavedChanges(false);
//     } catch (err) {
//       console.error('Auto-save failed:', err);
//       setSaveStatus('error');
//     }
//   }, [hasUnsavedChanges, submission, grade, feedback, userId, assignment]);

//   const handleGradeChange = (e) => {
//     const newGrade = e.target.value;
//     setGrade(newGrade);
//     setHasUnsavedChanges(true);
//     setSaveStatus('unsaved');
    
//     if (autoSaveTimeoutRef.current) {
//       clearTimeout(autoSaveTimeoutRef.current);
//     }
    
//     autoSaveTimeoutRef.current = setTimeout(() => {
//       autoSave();
//     }, 3000);
//   };

//   const handleFeedbackChange = (e) => {
//     const newFeedback = e.target.value;
//     setFeedback(newFeedback);
//     setHasUnsavedChanges(true);
//     setSaveStatus('unsaved');
    
//     if (autoSaveTimeoutRef.current) {
//       clearTimeout(autoSaveTimeoutRef.current);
//     }
    
//     autoSaveTimeoutRef.current = setTimeout(() => {
//       autoSave();
//     }, 3000);
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const { data: assignmentData, error: assignmentError } = await supabase
//         .from('CreateAssignments')
//         .select(`
//           *,
//           class:classes(
//             id,
//             name,
//             teacher:UserInfo!classes_teacherid_fkey(
//               name
//             )
//           )
//         `)
//         .eq('id', assignmentId)
//         .single();

//       if (assignmentError) throw assignmentError;
//       setAssignment(assignmentData);

//       const { data: submissionData, error: submissionError } = await supabase
//         .from('SubmittedAssignment')
//         .select(`
//           *,
//           student:UserInfo(
//             id,
//             name,
//             email
//           )
//         `)
//         .eq('id', submissionId)
//         .single();

//       if (submissionError) throw submissionError;
//       setSubmission(submissionData);
//       setGrade(submissionData.teacher_grade || '');
//       setFeedback(submissionData.teacher_feedback || '');

//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitGrade = async () => {
//     try {
//       if (!grade) {
//         setError('Please enter a grade');
//         return;
//       }
//       if (parseFloat(grade) > assignment.points) {
//         setError(`Grade cannot exceed maximum points (${assignment.points})`);
//         return;
//       }
//       if (parseFloat(grade) < 0) {
//         setError('Grade cannot be negative');
//         return;
//       }

//       setIsSubmitting(true);
//       setError(null);
//       setSuccessMessage('');

//       const gradeData = prepareGradeData(submission, grade, feedback, criteriaGrades);
//       const { isValid, errors } = validateGradeData(gradeData);
      
//       if (!isValid) {
//         setError(errors.join('\n'));
//         return;
//       }
      
//       const formattedData = formatGradeDataForAPI(gradeData);
//       const result = await gradeSubmissionService(formattedData);
      
//       setSuccessMessage(result.message);
//       setTimeout(() => {
//         navigate(`/teacher/${userId}/dashboard/assignments`);
//       }, 1500);

//     } catch (err) {
//       console.error('Error updating grade:', err);
//       setError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const SaveStatus = () => {
//     const statusStyles = {
//       saved: 'text-green-400',
//       saving: 'text-yellow-400',
//       unsaved: 'text-yellow-400/70',
//       error: 'text-red-400'
//     };

//     const statusText = {
//       saved: 'All changes saved',
//       saving: 'Saving...',
//       unsaved: 'Unsaved changes',
//       error: 'Error saving changes'
//     };

//     return (
//       <div className={`text-sm ${statusStyles[saveStatus]}`}>
//         {statusText[saveStatus]}
//       </div>
//     );
//   };

//   useEffect(() => {
//     fetchData();
//     return () => {
//       if (autoSaveTimeoutRef.current) {
//         clearTimeout(autoSaveTimeoutRef.current);
//       }
//     };
//   }, [assignmentId, submissionId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-yellow-400">Loading submission details...</div>
//       </div>
//     );
//   }

//   if (!assignment || !submission) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-red-400">Assignment or submission not found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black p-6">
//       <div className="max-w-7xl mx-auto">
//         <button
//           onClick={() => navigate(`/teacher/${userId}/dashboard/assignments`)}
//           className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 mb-6"
//         >
//           <FaArrowLeft />
//           <span>Back to Assignments</span>
//         </button>

//         {error && (
//           <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         {successMessage && (
//           <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-lg mb-4">
//             {successMessage}
//           </div>
//         )}

//         <div className="bg-gray-900 rounded-lg p-6">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold text-yellow-400">{assignment.title}</h1>
//             <div className="flex items-center gap-4 mt-2 text-gray-400">
//               <span>{assignment.class.name}</span>
//               <span>•</span>
//               <span>Student: {submission.student.name}</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div>
//               <h2 className="text-xl font-semibold text-yellow-400 mb-4">Submission</h2>
//               <div className="bg-black/30 rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="text-gray-400">
//                     Submitted on {new Date(submission.submitted_at).toLocaleString()}
//                   </div>
//                   {submission.file_url && (
//                     <a
//                       href={submission.file_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-yellow-400 hover:text-yellow-500 flex items-center gap-2"
//                     >
//                       <FaFileAlt />
//                       <span>View Submission</span>
//                     </a>
//                   )}
//                 </div>
//                 {submission.content && (
//                   <div className="mt-4 text-gray-300 whitespace-pre-wrap">
//                     {submission.content}
//                   </div>
//                 )}
//               </div>

//               <div className="mt-6">
//                 <h2 className="text-xl font-semibold text-yellow-400 mb-4">Grade Submission</h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-yellow-400 mb-2">Grade (out of {assignment.points})</label>
//                     <input
//                       type="number"
//                       value={grade}
//                       onChange={handleGradeChange}
//                       max={assignment.points}
//                       min="0"
//                       step="0.1"
//                       className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-yellow-400"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-yellow-400 mb-2">Feedback</label>
//                     <textarea
//                       value={feedback}
//                       onChange={handleFeedbackChange}
//                       rows={4}
//                       className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-yellow-400"
//                       placeholder="Enter your feedback here..."
//                     />
//                   </div>

//                   <div className="space-y-4">
//                     <SaveStatus />
//                     <button
//                       onClick={handleSubmitGrade}
//                       disabled={isSubmitting}
//                       className={`w-full ${
//                         isSubmitting 
//                           ? 'bg-yellow-400/50 cursor-not-allowed' 
//                           : 'bg-yellow-400 hover:bg-yellow-500'
//                       } text-black px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           <span>Submitting...</span>
//                         </>
//                       ) : (
//                         'Submit Grade'
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold text-yellow-400 mb-4">Assignment Details</h2>
//               <div className="bg-black/30 rounded-lg p-4">
//                 <div className="space-y-4">
//                   <div>
//                     <div className="text-gray-400">Description</div>
//                     <p className="text-yellow-400 mt-1">{assignment.description}</p>
//                   </div>
//                   <div>
//                     <div className="text-gray-400">Points</div>
//                     <div className="text-yellow-400">{assignment.points} points</div>
//                   </div>
//                   <div>
//                     <div className="text-gray-400">Due Date</div>
//                     <div className="text-yellow-400">
//                       {new Date(assignment.due_date).toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {assignment.rubric && (
//                 <div className="mt-6">
//                   <h2 className="text-xl font-semibold text-yellow-400 mb-4">Rubric</h2>
//                   <div className="bg-black/30 rounded-lg p-4">
//                     <pre className="text-gray-400 whitespace-pre-wrap">
//                       {JSON.stringify(assignment.rubric, null, 2)}
//                     </pre>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignmentGrades; 