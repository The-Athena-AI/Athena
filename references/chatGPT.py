from flask import Flask, request, jsonify, send_from_directory
import openai
import os
from dotenv import load_dotenv
from pyngrok import ngrok
from PyPDF2 import PdfReader
import traceback

load_dotenv()

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'
client = openai.OpenAI(api_key=os.getenv("ChatGPT"))

public_url = ngrok.connect(8000).public_url
print("Public ngrok URL:", public_url)

def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        extracted_text = ""
        page_count = len(reader.pages)
        print(f"Total pages in PDF: {page_count}")

        for page_num, page in enumerate(reader.pages, start=1):
            print(f"Processing page {page_num}...")
            page_text = page.extract_text()
            if page_text:
                extracted_text += f"\n\n--- Page {page_num} ---\n\n{page_text}"
            else:
                extracted_text += f"\n\n--- Page {page_num} ---\n\n[No Text Found]"
        return extracted_text.strip()

    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None

def split_text_into_chunks(text, chunk_size=1000):
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0

    for word in words:
        current_length += len(word) + 1
        current_chunk.append(word)

        if current_length >= chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_length = 0

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

@app.route('/chatGPT', methods=['POST'])
def process():
    try:
        prompt = request.form.get("text", "")
        file = request.files.get("file")

        extracted_text = None
        if file:
            filename = file.filename
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            if filename.lower().endswith('.pdf'):
                extracted_text = extract_text_from_pdf(file_path)

        if not extracted_text:
            return jsonify({"error": "No text could be extracted from the file."}), 400

        print(f"Extracted Text (first 500 characters): {extracted_text[:500]}")

        text_chunks = split_text_into_chunks(extracted_text, chunk_size=1000)
        print(f"Number of chunks: {len(text_chunks)}")

        aggregated_result = ""
        for idx, chunk in enumerate(text_chunks, start=1):
            messages = [
                {
                    "role": "user",
                    "content": f"{prompt}\n\n{chunk}"
                }
            ]

            print(f"Sending Chunk {idx} to GPT-4o (first 500 characters): {chunk[:500]}")

            response = client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                max_tokens=1000
            ).to_dict()

            print(f"Response for Chunk {idx}: {response}")

            chunk_result = response['choices'][0]['message']['content']
            aggregated_result += f"\n\n--- Chunk {idx} ---\n\n{chunk_result}"

        return jsonify({"result": aggregated_result})

    except Exception as e:
        
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(port=8000)
