from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
import PIL.Image
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GeminiAPI"))

generation_config = {
    "temperature":0.9,
    "top_p":1,
    "top_k":1,
    "max_output_tokens":30
}
myfile = genai.upload_file(path="/Users/prajnyiqueghimire/Pandora-s-Box/poseidon/uploads/HW_8_Assignment_submission_number_4.pdf") # "files/*"

TheFile = genai.get_file(name=myfile.name)
print(myfile)
# Initialize the model
model = genai.GenerativeModel('gemini-1.5-flash')

# Generate content with a token limit
response = model.generate_content(
    ["grade this",
    myfile] 
)

print(response.text)