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
    assignment_id = request.json['assignment_id']
    completed_assignment_url = request.json['completed_assignment_url']
    student_id = request.json['student_id']

    completed_assignment = supabase_client.storage.from_("assignments").download("1737950739841_tobe175zf1k.pdf");
    
    with open("documents/asdf.pdf", "wb+") as file:
        file.write(completed_assignment)
    
    completed_file = docai.process_document(file)
    assignment = DAO.get_assignment(assignment_id)

    grade = DAO.grade_assignment(completed_file, assignment.get_rubric(), student_id)
    return jsonify(grade)