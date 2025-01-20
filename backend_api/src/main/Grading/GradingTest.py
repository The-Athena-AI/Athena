import GradingFileDAO as DAO

def main():
    assignment_id = "1"
    rubric_id = "1"
    assignment = "Athena/backend_api/data/MCAS_grade_10_student_math-pages-assignment.pdf"
    rubric = "Athena/backend_api/data/MCAS_grade_10_student_math-pages-rubric.pdf"
    grade = DAO.grade_assignment(assignment, rubric)
    print(grade)

if __name__ == "__main__":
    main()