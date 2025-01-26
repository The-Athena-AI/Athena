import ChatFileDao as DAO

def main():
    session_id = 1
    message = "Hello"
    
    conversation_history = DAO.get_chat_history(session_id)

    response = DAO.chat(message, conversation_history)
    
    conversation_history.append({"role": "user", "parts": message})
    conversation_history.append({"role": "model", "parts": response})
    DAO.update_chat_history(session_id, conversation_history)
    
    print(response)

if __name__ == "__main__":
    main()