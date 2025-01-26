import GradingFileDAO as DAO
import Files as Files
import PyPDF2

def main():
    assignment_id = "3"
    rubric_id = "3"
    assignment = DAO.get_assignment(assignment_id)
    rubric = DAO.get_rubric(rubric_id)
    grade = DAO.grade_assignment(assignment, rubric)
    print(grade)

if __name__ == "__main__":
    main()