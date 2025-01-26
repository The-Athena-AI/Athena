from flask import Flask, request, jsonify
import ChatFileDao as DAO

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    session_id = request.json.get('session_id')
    message = request.json.get('message')
    
    conversation_history = DAO.get_chat_history(session_id)

    response = DAO.chat(message, conversation_history)
    
    conversation_history.append({"role": "user", "parts": message})
    conversation_history.append({"role": "model", "parts": response})
    DAO.update_chat_history(session_id, conversation_history)
    
    return jsonify(response)

@app.route('/upload_chat_history', methods=['POST'])
def upload_chat_history():
    user_id = request.json.get('user_id')
    DAO.upload_chat_history(user_id)