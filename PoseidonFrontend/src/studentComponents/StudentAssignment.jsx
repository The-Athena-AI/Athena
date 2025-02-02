// import React, { useState, useEffect } from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { 
//   FaArrowLeft, 
//   FaUpload, 
//   FaClock, 
//   FaCheckCircle,
//   FaTimesCircle,
//   FaRobot,
//   FaFileAlt
// } from 'react-icons/fa';
// import { supabase } from '../supabase';

// const StudentAssignments = ({ userId }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [assignments, setAssignments] = useState([]);
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchAssignments();
//   }, [userId]);

//   const fetchAssignments = async () => {
//     try {
//       setLoading(true);

//       if (!userId) {
//         throw new Error('User ID is not available');
//       }

//       // 1) Get student's enrolled classes
//       const { data: enrollments, error: enrollmentError } = await supabase
//         .from('classenrollments')
//         .select('classid')
//         .eq('studentid', userId);

//       if (enrollmentError) throw enrollmentError;

//       const classIds = enrollments.map(e => e.classid).filter(Boolean);

//       if (classIds.length === 0) {
//         setAssignments([]);
//         return;
//       }

//       // 2) Get assignments for enrolled classes
//       const { data: assignmentsData, error: assignmentsError } = await supabase
//         .from('CreateAssignments') // Make sure this table name matches exactly
//         .select(`
//           *,
//           class:classes(
//             id,
//             name,
//             teacher:UserInfo(
//               name
//             )
//           ),
//           submissions:SubmittedAssignment(
//             id,
//             status,
//             submitted_at,
//             file,
//             teacher_grade,
//             teacher_feedback,
//             ai_grade,
//             ai_feedback
//           )
//         `)
//         .in('class_id', classIds)
//         .order('due_date', { ascending: false });

//       if (assignmentsError) throw assignmentsError;

//       setAssignments(assignmentsData || []);
//     } catch (err) {
//       console.error('Error fetching assignments:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredAssignments = assignments
//     .filter(assignment => {
//       const hasSubmission = assignment.submissions && assignment.submissions.length > 0;
//       switch (filterStatus) {
//         case 'pending':
//           return !hasSubmission;
//         case 'submitted':
//           return hasSubmission;
//         default:
//           return true;
//       }
//     })
//     .filter(assignment =>
//       assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );


//   if (loading) {
//     return (
//       <div className="min-h-screen themed-bg flex items-center justify-center">
//         <div className="themed-text">Loading assignments...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen themed-bg p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold themed-text mb-6">Assignments</h1>

//         {error && (
//           <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         <div className="mb-6 flex gap-4 items-center">
//           <input
//             type="text"
//             placeholder="Search assignments..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="flex-1 themed-bg-paper border themed-border rounded-lg px-4 py-2 themed-text focus:outline-none focus:border-yellow-400"
//           />
//           <select 
//             value={filterStatus} 
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="bg-gray-900 themed-bg-paper border themed-border rounded-lg px-4 py-2 themed-text focus:outline-none focus:border-yellow-400"
//           >
//             <option value="all">All Assignments</option>
//             <option value="pending">Pending</option>
//             <option value="submitted">Submitted</option>
//           </select>
//         </div>

//         <div className="grid grid-cols-1 gap-6">
//           {filteredAssignments.map((assignment) => (
//             <motion.div
//               key={assignment.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="themed-bg-paper rounded-lg p-6 cursor-pointer hover:themed-bg-paper transition-colors"
//               onClick={() => navigate(`${assignment.id}`)}
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold themed-text">{assignment.title}</h2>
//                   <p className="themed-text-secondary mt-2">{assignment.description}</p>
//                   <div className="flex items-center gap-4 mt-4 text-sm themed-text-secondary">
//                     <span>{assignment.class.name}</span>
//                     <span>•</span>
//                     <span>Teacher: {assignment.class.teacher.name}</span>
//                     <span>•</span>
//                     <span className="flex items-center gap-2">
//                       <FaClock />
//                       Due: {new Date(assignment.due_date).toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex flex-col items-end">
//                   <div className="text-lg font-bold themed-text">{assignment.points} points</div>
//                   {assignment.submissions?.[0] ? (
//                     <div className="flex items-center gap-2 text-green-400 mt-2">
//                       <FaCheckCircle />
//                       <span>Submitted</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2 text-red-400 mt-2">
//                       <FaTimesCircle />
//                       <span>Not Submitted</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {filteredAssignments.length === 0 && (
//           <div className="text-center py-12">
//               <div className="themed-text mb-4">
//               <FaFileAlt className="inline-block text-4xl" />
//             </div>
//             <h2 className="text-xl font-semibold themed-text">No Assignments Found</h2>
//             <p className="themed-text-secondary mt-2">
//               {filterStatus === 'all' 
//                 ? "You don't have any assignments yet."
//                 : `No ${filterStatus} assignments found.`}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const StudentAssignmentDetails = ({ userId }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [assignment, setAssignment] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchAssignmentDetails();
//   }, [userId]);

//   const fetchAssignmentDetails = async () => {
//     try {
//       setLoading(true);

//       // Get the assignment ID from the URL
//       const path = window.location.pathname.split('/');
//       const assignmentId = path[path.length - 1];
//       if (!assignmentId) {
//         throw new Error('No assignment ID in URL');
//       }

//       // Query one assignment with joined data
//       const { data, error: detailsError } = await supabase
//         .from('CreateAssignments') // again, must match your exact table name
//         .select(`
//           *,
//           class:classes(
//             id,
//             name,
//             teacher:UserInfo!classes_teacherid_fkey(
//               name
//             )
//           ),
//           submissions:SubmittedAssignment(
//             id,
//             status,
//             submitted_at,
//             file,
//             teacher_grade,
//             teacher_feedback,
//             ai_grade,
//             ai_feedback
//           )
//         `)
//         .eq('id', assignmentId)
//         .single();

//       if (detailsError) throw detailsError;

//       setAssignment(data);
//     } catch (err) {
//       console.error('Error fetching assignment details:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = async (e) => {
//     try {
//       const file = e.target.files[0];
//       if (!file) return;

//       setUploading(true);

//       // Upload with proper file path structure
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from('assignments')
//         .upload(fileName, file, {
//           cacheControl: '3600',
//           upsert: true
//         });

//       if (uploadError) {
//         console.error('Upload error:', uploadError);
//         throw uploadError;
//       }

//       // Get public URL for the uploaded file
//       const { data: { publicUrl } } = supabase.storage
//         .from('assignments')
//         .getPublicUrl(fileName);

//       // Create a row in the "SubmittedAssignment" table
//       const { error: submissionError } = await supabase
//         .from('SubmittedAssignment')
//         .insert([
//           {
//             assignment_id: assignment.id,
//             student_id: userId,
//             status: 'submitted',
//             file: publicUrl,
//             submitted_at: new Date().toISOString()
//           }
//         ])
//         .select()
//         .single();

//       if (submissionError) throw submissionError;

//       // Refresh details to show new submission
//       await fetchAssignmentDetails();
//     } catch (err) {
//       console.error('Error uploading submission:', err);
//       setError(err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-yellow-400">Loading assignment details...</div>
//       </div>
//     );
//   }

//   if (!assignment) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-red-400">Assignment not found</div>
//       </div>
//     );
//   }

//   const submission = assignment.submissions?.[0];

//   return (
//     <div className="min-h-screen bg-black p-6">
//       <div className="max-w-7xl mx-auto">
//         <button
//           onClick={() => navigate('..')}
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

//         <div className="bg-gray-900 rounded-lg p-6">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold text-yellow-400">{assignment.title}</h1>
//             <div className="flex items-center gap-4 mt-2 text-gray-400">
//               <span>{assignment.class.name}</span>
//               <span>•</span>
//               <span>Teacher: {assignment.class.teacher.name}</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-6">
//               <div>
//                 <h2 className="text-xl font-semibold text-yellow-400 mb-2">Description</h2>
//                 <p className="text-gray-400">{assignment.description}</p>
//               </div>

//               {submission ? (
//                 <div>
//                   <h2 className="text-xl font-semibold text-yellow-400 mb-4">Your Submission</h2>
//                   <div className="bg-black/30 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-2 text-green-400">
//                         <FaCheckCircle />
//                         <span>
//                           Submitted on{' '}
//                           {new Date(submission.submitted_at).toLocaleString()}
//                         </span>
//                       </div>
//                       {submission.file && (
//                         <a
//                           href={submission.file}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-yellow-400 hover:text-yellow-500 flex items-center gap-2"
//                         >
//                           <FaFileAlt />
//                           <span>View Submission</span>
//                         </a>
//                       )}
//                     </div>

//                     {(submission.teacher_grade || submission.ai_grade) && (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                         {submission.ai_grade && (
//                           <div>
//                             <h3 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center gap-2">
//                               <FaRobot />
//                               AI Feedback
//                             </h3>
//                             <div className="bg-black/20 p-4 rounded-lg">
//                               <div className="text-green-400 mb-2">
//                                 Grade: {submission.ai_grade}
//                               </div>
//                               <p className="text-gray-400">
//                                 {submission.ai_feedback}
//                               </p>
//                             </div>
//                           </div>
//                         )}
//                         {submission.teacher_grade && (
//                           <div>
//                             <h3 className="text-lg font-semibold text-yellow-400 mb-2">
//                               Teacher Feedback
//                             </h3>
//                             <div className="bg-black/20 p-4 rounded-lg">
//                               <div className="text-green-400 mb-2">
//                                 Grade: {submission.teacher_grade}
//                               </div>
//                               <p className="text-gray-400">
//                                 {submission.teacher_feedback}
//                               </p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                   <h2 className="text-xl font-semibold text-yellow-400 mb-4">
//                     Submit Assignment
//                   </h2>
//                   <div className="bg-black/30 rounded-lg p-4">
//                     <input
//                       type="file"
//                       onChange={handleFileUpload}
//                       disabled={uploading}
//                       className="hidden"
//                       id="file-upload"
//                     />
//                     <label
//                       htmlFor="file-upload"
//                       className="flex items-center justify-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 cursor-pointer"
//                     >
//                       <FaUpload />
//                       <span>{uploading ? 'Uploading...' : 'Upload Submission'}</span>
//                     </label>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="bg-black/30 rounded-lg p-4 h-fit">
//               <h2 className="text-xl font-semibold text-yellow-400 mb-4">Assignment Details</h2>
//               <div className="space-y-4">
//                 <div>
//                   <div className="text-gray-400">Due Date</div>
//                   <div className="text-yellow-400 flex items-center gap-2">
//                     <FaClock />
//                     {new Date(assignment.due_date).toLocaleString()}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-gray-400">Points</div>
//                   <div className="text-yellow-400">{assignment.points} points</div>
//                 </div>
//                 <div>
//                   <div className="text-gray-400">Status</div>
//                   <div
//                     className={`flex items-center gap-2 ${
//                       submission ? 'text-green-400' : 'text-red-400'
//                     }`}
//                   >
//                     {submission ? <FaCheckCircle /> : <FaTimesCircle />}
//                     <span>{submission ? 'Submitted' : 'Not Submitted'}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div> 
//     </div>
//   );
// };

// const StudentAssignment = ({ userId }) => {
//   return (
//     <Routes>
//       <Route path="" element={<StudentAssignments userId={userId} />} />
//       <Route path=":id" element={<StudentAssignmentDetails userId={userId} />} />
//     </Routes>
//   );
// };

// export default StudentAssignment;
