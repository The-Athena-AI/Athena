export const fetchAssignments = async () => {
    return [
      { id: 1, title: "Assignment 1", description: "Solve problems 1-10." },
      { id: 2, title: "Assignment 2", description: "Write a short essay." },
    ];
  };
  
  export const submitGrade = async (assignmentId, gradeData) => {
    console.log(`Grade submitted for assignment ${assignmentId}:`, gradeData);
    return { success: true };
  };
  