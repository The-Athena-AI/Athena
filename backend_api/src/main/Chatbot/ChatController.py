from flask import Flask, request, jsonify
import ChatFileDao as DAO

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    message = request.json.get('message')
    response = DAO.chat(message)
    return jsonify(response)