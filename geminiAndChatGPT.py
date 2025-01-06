from flask import Flask, request, jsonify, send_from_directory
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
import google.generativeai as genai
import openai
import traceback
from werkzeug.utils import secure_filename
from flask_cors import CORS
from pyngrok import ngrok

load_dotenv()

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
public_url = ngrok.connect(8000).public_url
print("Public ngrok URL:", public_url)
CORS(app, origins=["http://localhost:3000", "${public_url}"])

client = openai.OpenAI(api_key=os.getenv("ChatGPT"))
genai.configure(api_key=os.getenv("GeminiAPI"))

ALLOWED_EXTENSIONS = {'pdf', 'txt', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    """Extract text from all pages of a PDF."""
    try:
        reader = PdfReader(file_path)
        text = ""
        page_count = len(reader.pages)
        for i, page in enumerate(reader.pages, start=1):
            text += f"\n\n--- Page {i} ---\n\n"
            text += page.extract_text() or "[No Text Found]"
        return text, page_count
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None, 0

@app.route('/grade', methods=['POST'])
def grade():
    try:
        category = request.form.get("category")
        instruction = request.form.get("instruction")
        file = request.files.get("file")
        answer_file = request.files.get("answerFile")
        handwriting_sample = request.files.get("handwritingSampleFile")

        if not category or not instruction or not file:
            return jsonify({"error": "Category, instruction, and file are required."}), 400

        # Save the main uploaded file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Save the optional answer file if provided
        answer_file_path = None
        if answer_file and allowed_file(answer_file.filename):
            answer_filename = secure_filename(answer_file.filename)
            answer_file_path = os.path.join(app.config['UPLOAD_FOLDER'], answer_filename)
            answer_file.save(answer_file_path)

        # Save the optional handwriting sample if provided
        handwriting_sample_path = None
        if handwriting_sample and allowed_file(handwriting_sample.filename):
            handwriting_filename = secure_filename(handwriting_sample.filename)
            handwriting_sample_path = os.path.join(app.config['UPLOAD_FOLDER'], handwriting_filename)
            handwriting_sample.save(handwriting_sample_path)

        # Additional logic to process answer_file and handwriting_sample can be added here
        if filename.lower().endswith('.pdf'):
            extracted_text, page_count = extract_text_from_pdf(file_path)
            if page_count > 1:
                print("Gemini was used")
                return process_with_gemini(instruction, category, file_path)
            else:
                print("ChatGPT was used")
                return process_with_chatgpt(instruction, category, extracted_text)
        elif filename.lower().endswith(('.png', '.jpg', '.jpeg', '.txt')):
            return process_with_gemini(instruction, category, file_path)
        else:
            return jsonify({"error": "Unsupported file type provided."}), 400

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


def process_with_chatgpt(instruction, category, text):
    """Route to ChatGPT for processing."""
    try:
        messages = [
            {
                "role": "user",
                "content": f"{instruction}\nCategory: {category}\n\n{text}"
            }
        ]

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=1000
        ).to_dict()

        grading_result = response['choices'][0]['message']['content']
        return jsonify({"grading_result": grading_result})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"ChatGPT error: {str(e)}"}), 500

def process_with_gemini(instruction, category, file_path):
    """Route to Gemini AI for processing."""
    try:
        file_obj = genai.upload_file(path=file_path)
        model = genai.GenerativeModel('gemini-1.5-pro')

        response = model.generate_content([
            f"{instruction}\nCategory: {category}",
            file_obj
        ])

        result = response.text
        return jsonify({"grading_result": result})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Gemini AI error: {str(e)}"}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(port=8000)
