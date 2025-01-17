from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/llama', methods=['POST'])
def grade():
    # Receive data from the frontend
    data = request.form.get("text", "")
    file = request.files.get("file")

    ngrokURL = os.getenv("COLAB_URL")
    print("Ngrok URL:", ngrokURL)

    # Check if a file was uploaded
    if file:
        # Save the file temporarily
        file_path = "temp_image.jpg"
        file.save(file_path)

        # Send both text and file to the Colab endpoint
        with open(file_path, 'rb') as f:
            response = requests.post(
                f"{ngrokURL}/process_file",
                files={'file': f},
                data={'text': data}
            )

        # Remove the temporary file after the request
        os.remove(file_path)
    else:
        # Only send text to the Colab endpoint if no file was uploaded
        response = requests.post(
            f"{ngrokURL}/process_file",
            data={'text': data}
        )

    try:
        print("Response status code:", response.status_code)  # Debugging output
        print("Response content:", response.text)             # Debugging output

        # Attempt to parse JSON only if status code is 200
        if response.status_code == 200:
            colab_result = response.json()
        else:
            return jsonify({"error": f"Colab server error: {response.status_code}", "details": response.text}), response.status_code
    except requests.exceptions.JSONDecodeError:
        # Log the error and return an appropriate message
        print("JSON decode error. Response content was not JSON.")
        return jsonify({"error": "Invalid response from Colab server"}), 500

    # Return the response from Colab
    return jsonify(colab_result)

if __name__ == '__main__':
    app.run(host="10.118.8.119", port=8000)
