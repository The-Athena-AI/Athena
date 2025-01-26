import ChatFileDao as DAO

def main():
    session_id = 2
    message = "what was my last message?"
    
    conversation_history = DAO.get_chat_history(session_id)

    response = DAO.chat(message, conversation_history)
    
    conversation_history.append({"role": "user", "parts": message})
    conversation_history.append({"role": "model", "parts": response})
    DAO.update_chat_history(session_id, conversation_history)
    
    print(response)

    DAO.upload_chat_history(1)

if __name__ == "__main__":
    main()