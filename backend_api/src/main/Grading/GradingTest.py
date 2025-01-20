import GradingFileDAO as DAO
import Files as Files

def main():
    assignment_id = "1"
    rubric_id = "1"
    assignment = Files.Assignment(assignment_id, rubric_id, "MCAS Grade 10 Student Math", "John Doe", "Athena/backend_api/data/MCAS_grade_10_student_math-pages-assignment.pdf")
    rubric = Files.Rubric(rubric_id, "MCAS Grade 10 Student Math", "John Doe", "Athena/backend_api/data/MCAS_grade_10_student_math-pages-rubric.pdf")
    grade = DAO.grade_assignment(assignment, rubric)
    print(grade)

if __name__ == "__main__":
    main()