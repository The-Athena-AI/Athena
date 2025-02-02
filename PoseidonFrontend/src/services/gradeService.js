import { supabase } from '../supabase';

// API endpoint configuration
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// Prepare grade data for submission
export const prepareGradeData = (submission, grade, feedback, criteriaGrades) => {
  return {
    submissionId: submission.id,
    assignmentId: submission.assignment_id,
    grade: grade,
    feedback: feedback,
    studentId: submission.student.id,
    teacherId: submission.teacher_id,
    classId: submission.class_id,
    criteriaGrades: criteriaGrades
  };
};

// Grade submission service with API fallback to Supabase
export const gradeSubmissionService = async (gradeData) => {
  try {
    // First try the API endpoint
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/grades/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gradeData)
        });

        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (apiError) {
        console.warn('API submission failed, falling back to Supabase:', apiError);
      }
    }

    // Fallback to Supabase
    const { error: updateError } = await supabase
      .from('SubmittedAssignment')
      .update({
        teacher_grade: gradeData.grade.value,
        teacher_feedback: gradeData.grade.feedback,
        graded_at: new Date().toISOString(),
        status: 'graded',
        updated_at: new Date().toISOString()
      })
      .eq('id', gradeData.submission.id);

    if (updateError) throw updateError;

    return {
      success: true,
      message: 'Grade submitted successfully!',
      data: {
        submissionId: gradeData.submission.id,
        grade: gradeData.grade.value,
        status: 'graded'
      }
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to submit grade');
  }
}; 