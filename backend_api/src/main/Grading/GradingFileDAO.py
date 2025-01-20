import Athena.backend_api.src.main.Files as Files

import os
import openai
import supabase
import pymongo

# list of keys
openai.api_key = "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"
supabase_url = "https://wtgulmijdydgulpqhrfb.supabase.co"
supabase_api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Z3VsbWlqZHlkZ3VscHFocmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NTUxNDMsImV4cCI6MjA1MTUzMTE0M30.DXzDEFfh6mg07vwhnjrBSPUOJVesLzqRxC6QIfk3mf8"
mongoDBuri = "mongodb://localhost:27017/"

# list of clients
supabase_client = supabase.create_client(supabase_url, supabase_api_key)
mongoDB_client = pymongo.MongoClient(mongoDBuri)

# mongoDB collections
db = mongoDB_client["AthenasLibrary"]
collectionA = db["Assignments"]
collectionR = db["Rubrics"]

def get_assignment(assignment_id):
    # get assignment info from supabase
    assignment_info = supabase_client.table("Assignments").select("*").eq("id", assignment_id).execute()
    # get assignment file from mongoDB
    assignment_file = collectionA.find_one({"id": assignment_id})

    # create assignment object
    assignment = Files.Assignment(assignment_id, assignment_info[1][0]["rubric_id"], assignment_info[1][0]["name"], assignment_info[1][0]["teachers"], assignment_file)
    return assignment

def get_rubric(rubric_id):
    # get rubric info from supabase
    rubric_info = supabase_client.table("Rubrics").select("*").eq("id", rubric_id).execute()
    # get rubric file from mongoDB
    rubric_file = collectionR.find_one({"id": rubric_id})

    # create rubric object
    rubric = Files.Rubric(rubric_id, rubric_info[1][0]["name"], rubric_info[1][0]["teachers"], rubric_file)
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