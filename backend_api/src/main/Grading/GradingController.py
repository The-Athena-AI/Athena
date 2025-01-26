from flask import Flask, request, jsonify
import GradingFileDAO as DAO

app = Flask(__name__)

@app.route('/grade', methods=['POST'])
def grade():
    assignment_id = request.json['assignment_id']
    completed_assignment = request.json['completed_assignment']
    student_id = request.json['student_id']
    

"""
gets the id of the empty assignment and the json of the completed assignment

uses the id of the empty assignment to get the rubric

retrieves the rubric from the database

uses the json of both the completed assignemnt and the rubric to grade the assignment

gets any necessary information from the empty assignment needed to insert the completed assignment into the database

inserts the completed assignment into the database
"""