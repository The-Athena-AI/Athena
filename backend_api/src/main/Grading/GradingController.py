from flask import request, jsonify
from Athena.backend_api.src.main.Grading import GradingFileDAO as DAO
from Athena.backend_api.src.main.Creation import docai_processing as docai

def grade():
    assignment_id = request.json['assignment_id']
    completed_assignment = request.json['completed_assignment']
    student_id = request.json['student_id']
    
    completed_file = docai.process_file(completed_assignment)
    assignment = DAO.get_assignment(assignment_id)

    grade = DAO.grade_assignment(completed_file, assignment.get_rubric(), student_id)
    return jsonify(grade)