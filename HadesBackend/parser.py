import requests
import pdfplumber
from flask import Flask, request, jsonify
from io import BytesIO

app = Flask(__name__)

def parse_pdf(file_bytes):
    """Extract text from a PDF file."""
    text = ""
    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()

@app.route("/fetch-pdf", methods=["POST"])
def fetch_pdf():
    try:
        data = request.json
        file_url = data.get("file_url")

        if not file_url:
            return jsonify({"error": "File URL is required"}), 400

        # Fetch the PDF file from the URL
        response = requests.get(file_url)
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch file", "status": response.status_code}), response.status_code

        file_content = response.content  # File as bytes

        # Extract text from PDF
        extracted_text = parse_pdf(file_content)

        return jsonify({
            "message": "PDF fetched and parsed successfully",
            "file_size": len(file_content),
            "extracted_text": extracted_text[:500]  # Limit to first 500 characters for preview
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
