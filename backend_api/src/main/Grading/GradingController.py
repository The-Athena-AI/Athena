from flask import Flask, request, jsonify
import GradingFileDAO as DAO
from Athena.backend_api.src.main.Creation import docai_processing as docai

app = Flask(__name__)

@app.route('/grade', methods=['POST'])
def grade():
    assignment_id = request.json['assignment_id']
    completed_assignment = request.json['completed_assignment']
    student_id = request.json['student_id']
    
    completed_file = docai.process_file(completed_assignment);
    assignment = DAO.get_assignment(assignment_id)

    grade = DAO.grade_assignment(completed_file, assignment.get_rubric(), student_id)
    return jsonify(grade)

"""
gets the id of the empty assignment and the json of the completed assignment

uses the id of the empty assignment to get the rubric

retrieves the rubric from the database

uses the json of both the completed assignemnt and the rubric to grade the assignment

gets any necessary information from the empty assignment needed to insert the completed assignment into the database

inserts the completed assignment into the database
"""