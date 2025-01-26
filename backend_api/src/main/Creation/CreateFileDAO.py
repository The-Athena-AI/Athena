import supabase

import json
import base64
import io
import os

from dotenv import load_dotenv
load_dotenv()

import docai_processing as docai
from Athena.backend_api.src.main.Grading import Files


# list of keys
supabase_url = os.getenv("SUPABASE_URL")
supabase_api_key = os.getenv("SUPABASE_API_KEY")

# list of clients
supabase_client = supabase.create_client(supabase_url, supabase_api_key)

def upload_assignment(assignment):
    # upload assignment info to supabase
    supabase_client.table("Assignments").insert({"id": assignment.get_id(), "rubric_id": None, "name": assignment.get_name(), "teacher_id": None, "file": assignment.get_file()}).execute()

def upload_rubric(rubric):
    # upload rubric info to supabase
    supabase_client.table("Rubrics").insert({"id": rubric.get_id(), "assignment_id": None, "name": rubric.get_name(), "teacher_id": None, "file": rubric.get_file()}).execute()

def get_info_assignment(jsonFile):
    #loads the data from the json file
    data = json.loads(jsonFile)
    #decodes the base64 string to a pdf file
    pdf = decode_base64_to_pdf(data["file"])
    #processes the pdf file
    file = docai.process_document(pdf)
    #creates the assignment object
    assignment = Files.Assignment(data["id"], data["rubric_id"], data["name"], data["teacher_id"], file)
    return assignment

def get_info_rubric(jsonFile):
    #loads the data from the json file
    data = json.loads(jsonFile)
    #decodes the base64 string to a pdf file
    pdf = decode_base64_to_pdf(data["file"])
    #processes the pdf file
    file = docai.process_document(pdf)
    #creates the rubric object
    rubric = Files.Rubric(data["id"], data["assignment_id"], data["name"], data["teacher_id"], file)
    return rubric

def decode_base64_to_pdf(base64_string):
    try:
        # Decode the Base64 string into binary data
        pdf_data = base64.b64decode(base64_string)

        # Create an in-memory binary stream
        pdf_file = io.BytesIO(pdf_data)

        # Optional: Set the name of the file if needed
        pdf_file.name = "decoded_document.pdf"

        return pdf_file
    except Exception as e:
        raise ValueError(f"An error occurred while decoding the PDF: {e}")