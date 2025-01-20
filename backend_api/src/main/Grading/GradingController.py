from flask import Flask, request, jsonify
import GradingFileDAO as DAO

app = Flask(__name__)

@app.route('/grade', methods=['POST'])
def grade(assignment_id, rubric_id):
    assignment = DAO.get_assignment(assignment_id)
    rubric = DAO.get_rubric(rubric_id)
    grade = DAO.grade_assignment(assignment, rubric)
    return jsonify(grade)