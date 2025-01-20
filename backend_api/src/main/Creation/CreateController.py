from flask import Flask, request, jsonify
import CreateFileDAO as DAO
import Athena.backend_api.src.main.Files as Files

app = Flask(__name__)

@app.route('/upload_assignment', methods=['POST'])
def upload_assignment():
    assignment = request.json.get('assignment')
    DAO.upload_assignment(assignment)
    return jsonify(assignment)

@app.route('/upload_rubric', methods=['POST'])
def upload_rubric():
    rubric = request.json.get('rubric')
    DAO.upload_rubric(rubric)
    return jsonify(rubric)