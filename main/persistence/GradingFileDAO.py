import model.Files as Files

import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_assignment(assignment_id):
    """
    get assignment info from database
    get assignment file from database and store as string

    create assignment object

    return assignment object
    """

def get_rubric(rubric_id):
    """
    get rubric info from database
    get rubric file from database and store as string

    create rubric object

    return rubric object
    """

def get_assignment_file(assignment):
    return assignment.get_file()

def get_rubric_file(rubric):
    return rubric.get_file()

def grade_assignment(assignment, rubric):
    completion = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant grading an assignment based on a rubric or answer key. You will respond with a JSON object with the following keys: 'grade' and 'feedback'."},
            {"role": "user", "content": f"Here is the assignment: {assignment.get_file()}\nHere is the rubric or answer key: {rubric.get_file()}"},
        ]
    )
    return completion.choices[0].message.content