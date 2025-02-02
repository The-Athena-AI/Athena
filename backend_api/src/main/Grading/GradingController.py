from flask import request, jsonify
from Athena.backend_api.src.main.Grading import GradingFileDAO as DAO
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

    #completed_assignment_path = "1738474390911_8kg7hks4xu4.pdf"
    print(completed_assignment_path)
    
    assignment = DAO.get_assignment(assignment_id)

    grade = DAO.grade_assignment(completed_assignment_path, assignment, student_id, submission_id)
    return jsonify(grade)

# completed_assignment_path: folder/file_name