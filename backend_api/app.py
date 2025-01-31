import sys
import os

# Add the project root directory to Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(project_root)

from flask import Flask
from Athena.backend_api.src.main.Creation.CreateController import upload_assignment
from Athena.backend_api.src.main.Chatbot.ChatController import chat, upload_chat_history
from Athena.backend_api.src.main.Grading.GradingController import grade
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Register routes from CreateController
app.add_url_rule('/upload_assignment', 'upload_assignment', upload_assignment, methods=['POST'])

# Register routes from ChatController
app.add_url_rule('/chat', 'chat', chat, methods=['POST'])
app.add_url_rule('/upload_chat_history', 'upload_chat_history', upload_chat_history, methods=['POST'])

# Register routes from GradingController
app.add_url_rule('/grade', 'grade', grade, methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True, port=5000)