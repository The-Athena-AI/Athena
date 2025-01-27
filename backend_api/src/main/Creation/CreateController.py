from flask import Flask, request, jsonify
import CreateFileDAO as DAO

app = Flask(__name__)

@app.route('/upload_assignment', methods=['POST'])
def upload_assignment():
    file = request.json.get('assignment')
    assignment = DAO.get_file_info(file)
    DAO.upload_assignment(assignment)
    return jsonify(assignment)