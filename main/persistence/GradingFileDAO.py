"""
May not need this depending on how the ai stuff works out but im not sure

Will contain the methods used by the GradingController if it is needed
"""
import model.Assignment as Assignment

from openai import OpenAI
client = OpenAI()

def get_assignment(assignment_id):
    return Assignment.Assignment(assignment_id, "assignment_name", "teacher_id")

def get_rubric(rubric_id):
    return Assignment.Rubric(rubric_id, "rubric_name", "teacher_id")