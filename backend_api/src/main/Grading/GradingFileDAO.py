import Files as Files

import os
import openai
import supabase

from dotenv import load_dotenv
load_dotenv()

# list of keys
openai.api_key = os.getenv("OPENAI_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_api_key = os.getenv("SUPABASE_API_KEY")

# list of clients
supabase_client = supabase.create_client(supabase_url, supabase_api_key)

def get_assignment(assignment_id):
    # get assignment info from supabase
    assignment_info = supabase_client.table("Assignments").select("*").eq("id", assignment_id).execute()
    data = assignment_info.data

    # create assignment object
    assignment = Files.Assignment(assignment_id, data[0]["rubric_id"], data[0]["name"], data[0]["teacher_id"], data[0]["file"])
    return assignment

def get_rubric(rubric_id):
    # get rubric info from supabase
    rubric_info = supabase_client.table("Rubrics").select("*").eq("id", rubric_id).execute()
    data = rubric_info.data

    # create rubric object
    rubric = Files.Rubric(rubric_id, data[0]["assignment_id"], data[0]["name"], data[0]["teacher_id"], data[0]["file"])
    return rubric

def grade_assignment(assignment, rubric):
    # use openAI to grade the assignment
    completion = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "developer",
              "content": "You are a helpful assistant grading an assignment based on a rubric or answer key. You will respond with a JSON object with the following keys: 'grade' and 'feedback'."},
            {"role": "user",
             "content": f"Here is the assignment: {assignment.get_file()}\nHere is the rubric or answer key: {rubric.get_file()}"},
        ],
        max_tokens=1000
    )
    return completion.choices[0].message.content