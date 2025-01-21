from flask import Flask, request, jsonify
import CreateFileDAO as DAO
import Athena.backend_api.src.main.Grading.Files as Files

app = Flask(__name__)

@app.route('/upload_assignment', methods=['POST'])
def upload_assignment():
    file = request.json.get('assignment')
    assignment = DAO.get_info_assignment(file)
    DAO.upload_assignment(assignment)
    return jsonify(assignment)

@app.route('/upload_rubric', methods=['POST'])
def upload_rubric():
    file = request.json.get('rubric')
    rubric = DAO.get_info_rubric(file)
    DAO.upload_rubric(rubric)
    return jsonify(rubric)