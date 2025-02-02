import os
import json
from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai
import supabase

supabase_url = os.getenv("SUPABASE_URL")
supabase_api_key = os.getenv("SUPABASE_API_KEY")

supabase_client = supabase.create_client(supabase_url, supabase_api_key)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model=genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  system_instruction="You are a helpful assistant helping students and teachers with their questions.")

def chat(message, conversation_history):
    chat = model.start_chat(history=conversation_history)
    response = chat.send_message(message)
    return response.text

def get_chat_history(session_id, user_id):
    with open('Athena/backend_api/src/main/Chatbot/chatHistory.json', 'r') as file:
        data = json.load(file)

    for chat in data:
        if chat['session_id'] == session_id:
            return chat['conversation_history']
        
    chat_history = supabase_client.table("AiConversations").select("*").eq("user_id", user_id).eq("session_id", session_id).execute()
    
    if chat_history.data:
        return chat_history.data[0]['conversation']
    else:
        return []

def update_chat_history(session_id, conversation_history):
    with open('Athena/backend_api/src/main/Chatbot/chatHistory.json', 'r') as file:
        chat_history = json.load(file)
    
    updated = False

    for chat in chat_history:
        if chat['session_id'] == session_id:
            chat['conversation_history'] = conversation_history
            updated = True
            break

    if not updated:
        chat_history.append({
            "session_id": session_id,
            "conversation_history": conversation_history
        })

    with open('Athena/backend_api/src/main/Chatbot/chatHistory.json', 'w') as file:
        json.dump(chat_history, file, indent=4)

def upload_chat_history(user_id):
    with open('Athena/backend_api/src/main/Chatbot/chatHistory.json', 'r') as file:
        chat_history = json.load(file)
    
    for chat in chat_history:
        supabase_client.table("AiConversations").insert({"session_id": chat['session_id'], "user_id": user_id, "conversation": chat['conversation_history']}).execute()
