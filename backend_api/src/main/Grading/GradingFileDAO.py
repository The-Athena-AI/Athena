import Files as Files

import os
import openai
import supabase
import pymongo

# list of keys
openai.api_key = os.getenv("OPENAI_API_KEY")
# supabase_url = os.getenv("SUPABASE_URL")
# supabase_api_key = os.getenv("SUPABASE_API_KEY")
# mongoDBuri = os.getenv("MONGO_DB_URI")

# list of clients
# supabase_client = supabase.create_client(supabase_url, supabase_api_key)
# mongoDB_client = pymongo.MongoClient(mongoDBuri)

# mongoDB collections
# db = mongoDB_client["AthenasLibrary"]
# collectionA = db["Assignments"]
# collectionR = db["Rubrics"]

# def get_assignment(assignment_id):
#     # get assignment info from supabase
#     assignment_info = supabase_client.table("Assignments").select("*").eq("id", assignment_id).execute()
#     # get assignment file from mongoDB
#     assignment_file = collectionA.find_one({"id": assignment_id})

#     # create assignment object
#     assignment = Files.Assignment(assignment_id, assignment_info[1][0]["rubric_id"], assignment_info[1][0]["name"], assignment_info[1][0]["teachers"], assignment_file)
#     return assignment

# def get_rubric(rubric_id):
#     # get rubric info from supabase
#     rubric_info = supabase_client.table("Rubrics").select("*").eq("id", rubric_id).execute()
#     # get rubric file from mongoDB
#     rubric_file = collectionR.find_one({"id": rubric_id})

#     # create rubric object
#     rubric = Files.Rubric(rubric_id, rubric_info[1][0]["name"], rubric_info[1][0]["teachers"], rubric_file)
#     return rubric

def grade_assignment(assignment, rubric):
    # use openAI to grade the assignment
    completion = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "developer",
              "content": "You are a helpful assistant grading an assignment based on a rubric or answer key. You will respond with a JSON object with the following keys: 'grade' and 'feedback'."},
            {"role": "user",
             "content": f"Here is the assignment: {assignment.get_file()}\nHere is the rubric or answer key: {rubric.get_file()}"},
        ]
    )
    return completion.choices[0].message.content