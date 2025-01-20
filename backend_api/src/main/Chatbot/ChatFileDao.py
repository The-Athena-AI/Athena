import openai

openai.api_key = "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"

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