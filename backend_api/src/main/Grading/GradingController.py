from flask import request, jsonify
from Athena.backend_api.src.main.Grading import GradingFileDAO as DAO
from Athena.backend_api.src.main.Creation import docai_processing as docai
import os
import supabase

supabase_url = os.getenv("SUPABASE_URL")
supabase_api_key = os.getenv("SUPABASE_API_KEY")

# list of clients
supabase_client = supabase.create_client(supabase_url, supabase_api_key)

def grade():
    completed_assignment_path = request.json['completed_assignment_path']
    assignment_id = request.json['assignment_id']
    student_id = request.json['student_id']
    submission_id = request.json['submission_id']

    completed_assignment = supabase_client.storage.from_("assignments").download(completed_assignment_path);
    
    with open("documents/completed_assignment.pdf", "wb+") as file:
        file.write(completed_assignment)
    
    completed_file = docai.process_document(file)
    assignment = DAO.get_assignment(assignment_id)

    grade = DAO.grade_assignment(completed_file, assignment, student_id, submission_id)
    return jsonify(grade)

# completed_assignment_path: folder/file_name