from flask import request, jsonify
from Athena.backend_api.src.main.Chatbot import ChatFileDao as DAO

def chat():
    session_id = request.json.get('session_id')
    user_id = request.json.get('user_id')
    message = request.json.get('message')
    
    conversation_history = DAO.get_chat_history(session_id, user_id)

    response = DAO.chat(message, conversation_history)
    
    conversation_history.append({"role": "user", "parts": message})
    conversation_history.append({"role": "model", "parts": response})
    DAO.update_chat_history(session_id, conversation_history)
    
    return jsonify(response)

def upload_chat_history():
    user_id = request.json.get('user_id')
    DAO.upload_chat_history(user_id)