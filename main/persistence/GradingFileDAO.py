"""
May not need this depending on how the ai stuff works out but im not sure

Will contain the methods used by the GradingController if it is needed
"""
import model.Assignment as Assignment

from openai import OpenAI
client = OpenAI()

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

