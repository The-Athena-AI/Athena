import json
from Athena.backend_api.src.main.Grading import Files

import os
import supabase
import google.generativeai as genai
import re

from dotenv import load_dotenv
load_dotenv()

example_output = """
{
    "grade": 85,
    "overview": "You did not follow the instructions correctly.",
    "feedback_strengths": [
        {"questions/lines": "1-5", "rubric lines": "1-5", "feedback": "your hook was good."},
        {"questions/lines": "11-20", "rubric lines": "11-20", "feedback": "your thesis statement was good and set up the essay well."}
    ],
    "feedback_weaknesses": [
        {"questions/lines": "6-10", "rubric lines": "6-10", "feedback": "your summary was incorrect."},
        {"questions/lines": "21-30", "rubric lines": "21-30", "feedback": "your topic sentence for the seccond paragraph was not good."}
    ],
}
"""

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model=genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  system_instruction="""
  You are a helpful assistant grading an assignment based on a rubric or answer key.
  You will respond with a JSON object with the following keys: 'grade', 'overview', 'feedback_strengths', 'feedback_weaknesses'.
  The grade should be a number between 0 and 100.
  The overview should be a string that gives an overview of why you gave the grade.
  The feedback_strengths should be an array of tuples with the following keys: 'questions/lines', 'rubric lines', 'feedback'.
  The questions/lines should be what the feedback is applies to.
  The rubric lines should be the area of the rubric that the questions/lines are getting wrong.
  The feedback in this array should be a string that is a summary of what the student did well.
  The feedback_weaknesses should be an array of tuples with the following keys: 'questions/lines', 'rubric lines', 'feedback'.
  The questions/lines should be what the feedback is applies to.
  The rubric lines should be the area of the rubric that the questions/lines are getting wrong.
  The feedback in this array should be a string that is a summary of what the student did wrong.
  Please return the grade, overview, and feedback in **pure JSON format**, without markdown formatting.
  Example format: {example_output}
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

def grade_assignment(completed_assignment, assignment, student_id, submission_id):
    response = model.generate_content(f"Here is the assignment: {completed_assignment}\nHere is the rubric or answer key: {assignment.get_rubric()}")

    if not response.text.strip():  # Check if response is empty
        raise ValueError("Empty response from AI model. Check your model output.")
    
    cleaned_text = re.sub(r"```json\s*", "", response.text)  # Remove opening
    cleaned_text = re.sub(r"```$", "", cleaned_text)  # Remove closing

    try:
        data = json.loads(cleaned_text)  # Convert JSON response
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response: {cleaned_text}") from e

    grade = data["grade"]
    overview = data["overview"]
    feedback_strengths = data["feedback_strengths"]
    feedback_weaknesses = data["feedback_weaknesses"]
    
    if submission_id:
        submission = {
            "id": submission_id,
            "assignment_id": assignment.get_id(),
            "student_id": student_id,
            "ai_grade": grade,
            "ai_overview": overview,
            "ai_feedback_strengths": feedback_strengths,
            "ai_feedback_weaknesses": feedback_weaknesses,
        }
    else:
        submission = {
            "assignment_id": assignment.get_id(),
            "student_id": student_id,
            "ai_grade": grade,
            "ai_overview": overview,
            "ai_feedback_strengths": feedback_strengths,
            "ai_feedback_weaknesses": feedback_weaknesses,
        }
        
    returned_id = supabase_client.table("SubmittedAssignment").upsert(submission, returning="id").execute()

    string = response.text
    string += f"\nsubmission_id: {returned_id}"

    print(string)

    return string