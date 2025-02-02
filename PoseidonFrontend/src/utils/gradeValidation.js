// Grade data validation utilities
const validateGradeData = (gradeData) => {
  const errors = [];

  // Required fields
  const requiredFields = ['submissionId', 'grade', 'feedback', 'studentId', 'teacherId', 'classId'];
  requiredFields.forEach(field => {
    if (!gradeData[field] && gradeData[field] !== 0) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Grade value validation
  if (typeof gradeData.grade !== 'undefined') {
    const grade = parseFloat(gradeData.grade);
    if (isNaN(grade)) {
      errors.push('Grade must be a number');
    } else if (grade < 0) {
      errors.push('Grade cannot be negative');
    }
  }

  // Feedback length validation
  if (gradeData.feedback && typeof gradeData.feedback === 'string') {
    if (gradeData.feedback.length > 5000) {
      errors.push('Feedback cannot exceed 5000 characters');
    }
  }

  // Criteria grades validation
  if (gradeData.criteriaGrades) {
    Object.entries(gradeData.criteriaGrades).forEach(([criterion, data]) => {
      if (!data.grade && data.grade !== 0) {
        errors.push(`Missing grade for criterion: ${criterion}`);
      }
      if (typeof data.grade !== 'undefined' && (data.grade < 0 || data.grade > 4)) {
        errors.push(`Invalid grade value for criterion: ${criterion}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format grade data for API
const formatGradeDataForAPI = (gradeData) => {
  return {
    submission: {
      id: gradeData.submissionId,
      student_id: gradeData.studentId,
      assignment_id: gradeData.assignmentId
    },
    grade: {
      value: parseFloat(gradeData.grade),
      feedback: gradeData.feedback,
      criteria: gradeData.criteriaGrades,
      metadata: {
        graded_by: gradeData.teacherId,
        graded_at: new Date().toISOString(),
        grading_system: 'standard'
      }
    }
  };
};

export { validateGradeData, formatGradeDataForAPI }; 