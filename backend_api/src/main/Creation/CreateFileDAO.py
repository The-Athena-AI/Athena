"""
File to use for uploading files and info to the database
"""
import supabase
import pymongo

# list of keys
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

def upload_assignment(assignment):
    # upload assignment info to supabase
    supabase_client.table("Assignments").insert({"id": assignment.get_id(), "rubric id": None, "name": assignment.get_name(), "teachers": None}).execute()
    # upload assignment file to mongoDB
    collectionA.insert_one({"id": assignment.get_id(), "file": assignment.get_file()})

def upload_rubric(rubric):
    # upload rubric info to supabase
    supabase_client.table("Rubrics").insert({"id": rubric.get_id(), "assignment id": None, "name": rubric.get_name(), "teachers": None}).execute()
    # upload rubric file to mongoDB
    collectionR.insert_one({"id": rubric.get_id(), "file": rubric.get_file()})