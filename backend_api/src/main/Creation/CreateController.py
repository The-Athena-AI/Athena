from flask import request, jsonify
from backend_api.src.main.Creation import CreateFileDAO as DAO

def upload_assignment():
    file = request.data
    assignment = DAO.get_file_info(file)
    DAO.upload_assignment(assignment)
    return jsonify(assignment)