import json
import Files as Files

import os
import supabase
import google.generativeai as genai

from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model=genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  system_instruction="You are a helpful assistant grading an assignment based on a rubric or answer key. You will respond with a JSON object with the following keys: 'grade' and 'feedback'. The grade should be a number between 0 and 100. The feedback should be an array of tuples with the following keys: 'questions/lines' and 'feedback'. The questions/lines should be what the feedback is applies to. The feedback should be a string that is a summary of what the student did wrong and how they can improve."
)

# list of keys
supabase_url = os.getenv("SUPABASE_URL")
supabase_api_key = os.getenv("SUPABASE_API_KEY")

# list of clients
supabase_client = supabase.create_client(supabase_url, supabase_api_key)

def get_assignment(assignment_id):
    # get assignment info from supabase
    assignment_info = supabase_client.table("CreateAssignments").select("id, class_id, rubric, file").eq("id", assignment_id).execute()
    data = assignment_info.data

    # create assignment object
    assignment = Files.Assignment(assignment_id, data[0]["class_id"], data[0]["rubric"], data[0]["file"])
    return assignment

def grade_assignment(completed_assignment, assignment, student_id):
    response = model.generate_content(f"Here is the assignment: {completed_assignment.get_file()}\nHere is the rubric or answer key: {assignment.get_rubric()}")

    with open(response.text, "r") as file:
        data = json.load(file)

    grade = data["grade"]
    feedback = data["feedback"]

    supabase_client.table("SubmittedAssignment").insert({"id": None, "assigment_id": assignment.get_id(), "student_id": student_id, "ai_grade": grade, "ai_feedback": feedback, }).execute()
    return response.text
