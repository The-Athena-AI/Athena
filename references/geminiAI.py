from flask import Flask, request, jsonify, send_from_directory
import os
from dotenv import load_dotenv
import google.generativeai as genai
import logging
from pyngrok import ngrok
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
from PyPDF2 import PdfReader

load_dotenv()

app = Flask(__name__)
public_url = ngrok.connect(8000).public_url
print("Public ngrok URL:", public_url)
CORS(app, origins=["http://localhost:3000", "${public_url}"])
app.config['UPLOAD_FOLDER'] = './uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

genai.configure(api_key=os.getenv("GeminiAPI"))


logging.basicConfig(level=logging.DEBUG)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/grade', methods=['POST'])
def grade():
    try:
        category = request.form.get("category")
        instruction = request.form.get("instruction")
        if not category or not instruction:
            return jsonify({"error": "Category and instruction are required."}), 400

        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file provided."}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        if filename.lower().endswith('.pdf'):
            reader = PdfReader(file_path)
            if len(reader.pages) <= 1:
                return jsonify({"error": "This file has only one page and should be processed by ChatGPT."}), 400

        file_obj = genai.upload_file(path=file_path)
        model = genai.GenerativeModel('gemini-1.5-pro')
        prompt = f"{instruction}\nCategory: {category}\n\nFile Content:"
        response = model.generate_content([prompt, file_obj])

        grading_result = response.text
        return jsonify({"grading_result": grading_result})

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

    
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files for download or debugging."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(port=8000)
