import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import Athena.backend_api.src.main.Grading.Files as Files
import CreateFileDAO as DAO

def test_upload_assignment():
    assignment = Files.Assignment("2", "rubric_id", "Assignment 2", "teacher_id", "File 1")
    DAO.upload_assignment(assignment)

def test_upload_rubric():
    rubric = Files.Rubric("2", "Rubric 2", "teacher_id", "File 1")
    DAO.upload_rubric(rubric)

def main():
    test_upload_assignment()
    #test_upload_rubric()

if __name__ == "__main__":
    main()