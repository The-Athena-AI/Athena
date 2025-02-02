import json
from Athena.backend_api.src.main.Grading import Files

import os
import supabase
import google.generativeai as genai
import re
from Athena.backend_api.src.main.Creation import docai_processing as docai
import requests

from dotenv import load_dotenv
load_dotenv()

example_output = """
{
    "grade": 85,
    "overview": "You did not follow the instructions correctly.",
    "feedback_strengths": [
        {"questions/lines": "This is the hook. This is the seccond sentence", "rubric lines": "Sophisticated use of nouns and verbs make the essay very informative", "feedback": "your hook was good."},
        {"questions/lines": "This is the thesis statement", "rubric lines": "Presents ideas in an original manner", "feedback": "your thesis statement was good and set up the essay well."}
    ],
    "feedback_weaknesses": [
        {"questions/lines": "This is the third sentence", "rubric lines": "Needs more nouns and verbs", "feedback": "your summary was incorrect."},
        {"questions/lines": "This is the seccond paragraph", "rubric lines": "Sentence structure is evident; sentences mostly flow", "feedback": "your topic sentence for the seccond paragraph was not good."}
    ],
}
"""

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model=genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  system_instruction="""
  You are a helpful assistant grading an assignment based on a rubric or answer key.
  The feedback you give should be as critical as possible.
  You will respond with a JSON object with the following keys: 'grade', 'overview', 'feedback_strengths', 'feedback_weaknesses'.
  The grade should be a number between 0 and 100.
  The overview should be a string that gives an overview of why you gave the grade.
  The feedback_strengths should be an array of tuples with the following keys: 'questions/lines', 'rubric lines', 'feedback'.
  The questions/lines should be the exact text from the assignment that the feedback is applies to.
  The rubric lines should be the exact text from the rubric that the feedback is applies to.
  The feedback in this array should be a string that is a summary of what the student did well.
  The feedback_weaknesses should be an array of tuples with the following keys: 'questions/lines', 'rubric lines', 'feedback'.
  The questions/lines should be the exact text from the assignment that the feedback is applies to.
  The rubric lines should be the exact text from the rubric that the feedback is applies to.
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
    assignment_info = supabase_client.table("CreateAssignments").select("id, class_id, rubric_url, file").eq("id", assignment_id).execute()
    data = assignment_info.data

    # create assignment object
    assignment = Files.Assignment(assignment_id, data[0]["class_id"], data[0]["rubric_url"], data[0]["file"])
    return assignment

def grade_assignment(completed_assignment_path, assignment, student_id, submission_id):
    completed_assignment = supabase_client.storage.from_("assignments").download(completed_assignment_path);
    completed_assignment_url = supabase_client.storage.from_("assignments").get_public_url(completed_assignment_path)
    
    with open("documents/completed_assignment.pdf", "wb+") as file:
        file.write(completed_assignment)
    completed_file = docai.process_document(file)

    rubric = requests.get(assignment.get_rubric())

    with open("documents/completed_assignment.pdf", "wb+") as file:
        file.write(rubric.content)
    rubric_file = docai.process_document(file)

    print(rubric_file)

    response = model.generate_content(f"Here is the assignment: {completed_file}\nHere is the rubric or answer key: {rubric_file}")

    if not response.text.strip():
        raise ValueError("Empty response from AI model. Check your model output.")

    cleaned_text = re.sub(r"```json\s*", "", response.text)
    cleaned_text = re.sub(r"```$", "", cleaned_text)

    try:
        data = json.loads(cleaned_text)
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
            "file": completed_assignment_url,
            "status": "Athena Graded",
            "file_text": completed_file
        }
    else:
        submission = {
            "assignment_id": assignment.get_id(),
            "student_id": student_id,
            "ai_grade": grade,
            "ai_overview": overview,
            "ai_feedback_strengths": feedback_strengths,
            "ai_feedback_weaknesses": feedback_weaknesses,
            "file": completed_assignment_url,
            "status": "Athena Graded",
            "file_text": completed_file
        }
        
    returned_id = supabase_client.table("SubmittedAssignment").upsert(submission, returning="representation").execute()

    # if response.data:
    #     returned_id = response.data[0].get("id")  # Get the ID from the first row
    # else:
    #     returned_id = None  # Handle empty response

    # string = response.text
    # string += f"\nsubmission_id: {returned_id}"

    return response.text