import os
import json
from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model=genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  system_instruction="You are a helpful assistant helping students and teachers with their questions.")

def chat(message, conversation_history):
    chat = model.start_chat(history=conversation_history)
    response = chat.send_message(message)
    return response.text

def get_chat_history(session_id):
    with open('chatHistory.json', 'r') as file:
        data = json.load(file)
    
    for chat in data:
        if chat['session_id'] == session_id:
            return chat['conversation_history']
    
    return []

def update_chat_history(session_id, conversation_history):
    # Open the file and load the existing chat history
    with open('chatHistory.json', 'r') as file:
        chat_history = json.load(file)
    
    updated = False

    # Check if the session_id already exists in the chat history
    for chat in chat_history:
        if chat['session_id'] == session_id:
            chat['conversation_history'] = conversation_history
            updated = True
            break

    # If no match was found, create a new entry
    if not updated:
        chat_history.append({
            "session_id": session_id,
            "conversation_history": conversation_history
        })

    # Write the updated chat history back to the file
    with open('chatHistory.json', 'w') as file:
        json.dump(chat_history, file, indent=4)