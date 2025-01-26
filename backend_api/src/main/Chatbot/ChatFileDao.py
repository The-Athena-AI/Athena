import openai
import os
from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def chat(message):
    completion = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "developer", "content": "You are a helpful assistant helping students and teachers with their questions."},
            {"role": "user", "content": message}
        ],
        max_tokens=1000
    )
    return completion.choices[0].message.content