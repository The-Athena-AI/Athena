import json
from Athena.backend_api.src.main.Grading import Files

import os
import supabase
import google.generativeai as genai
import re

from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model=genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  system_instruction="""
  You are a helpful assistant grading an assignment based on a rubric or answer key.
  You will respond with a JSON object with the following keys: 'grade' and 'feedback'.
  The grade should be a number between 0 and 100. The feedback should be an array of tuples with the following keys: 'questions/lines', 'rubric lines', 'feedback'.
  The questions/lines should be what the feedback is applies to.
  The rubric lines should be the area of the rubric that the questions/lines are getting wrong.
  The feedback should be a string that is a summary of what the student did wrong and how they can improve.
  Please return the grade and feedback in **pure JSON format**, without markdown formatting.
  Example format:
  '{"grade": 85, "feedback": [{"questions/lines": "Line 1-10", "rubric lines": "Line 1-10", "feedback": "Good work!"}]}'
  """
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

def grade_assignment(completed_assignment, rubric, student_id):
    response = model.generate_content(f"Here is the assignment: {completed_assignment}\nHere is the rubric or answer key: {rubric}")

    if not response.text.strip():  # Check if response is empty
        raise ValueError("Empty response from AI model. Check your model output.")
    
    cleaned_text = re.sub(r"```json\s*", "", response.text)  # Remove opening
    cleaned_text = re.sub(r"```$", "", cleaned_text)  # Remove closing

    try:
        data = json.loads(cleaned_text)  # Convert JSON response
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response: {cleaned_text}") from e

    grade = data["grade"]
    feedback = data["feedback"]
    
    submission = {
        "assignment_id": "1352a4b8-1323-4b63-ad29-656c5e367a28",
        "student_id": student_id,
        "ai_grade": grade,
        "ai_feedback": feedback,
    }
    submission_id = supabase_client.table("SubmittedAssignment").insert(submission).execute()

    string = response.text
    string += f"\nsubmission_id: {submission_id}"

    return response.text

"""
{
    "grade": 85,
    "feedback": [
        {"questions/lines": "1-5", "rubric lines": "1-5", "feedback": "You did not follow the instructions correctly."},
        {"questions/lines": "6-10", "rubric lines": "1-5", "feedback": "You did not follow the instructions correctly."}
    ]
    "submission_id": "123"
}
"""