from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
from AIGrader import AIGrader
from ProcessingDocument import AssignmentQueue
import logging
from supabase import create_client, Client

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize components
ai_grader = AIGrader()
queue_processor = AssignmentQueue()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/grade', methods=['POST'])
async def grade_submission():
    try:
        data = request.json
        submission_id = data.get('submissionId')
        assignment_id = data.get('assignmentId')
        grade_format = data.get('gradeFormat', 'numeric')  # Default to numeric if not specified

        if not submission_id or not assignment_id:
            return jsonify({'error': 'Missing required parameters'}), 400

        # Fetch submission and assignment details from Supabase
        supabase: Client = create_client(
            os.environ.get("SUPABASE_URL"),
            os.environ.get("SUPABASE_KEY")
        )

        # Get submission details
        submission_response = await supabase.table('SubmittedAssignment').select(
            '*'
        ).eq('id', submission_id).single().execute()

        if submission_response.error:
            raise Exception(f"Error fetching submission: {submission_response.error.message}")

        submission = submission_response.data

        # Get assignment details including rubric and preferred grade format
        assignment_response = await supabase.table('CreateAssignments').select(
            '*'
        ).eq('id', assignment_id).single().execute()

        if assignment_response.error:
            raise Exception(f"Error fetching assignment: {assignment_response.error.message}")

        assignment = assignment_response.data

        # Use assignment's grade format if specified, otherwise use the requested format
        grade_format = assignment.get('grade_format', grade_format)

        # Grade the submission using AIGrader
        grades = await ai_grader.grade_assignment(
            content=submission.get('content'), 
            rubric=assignment.get('rubric'),
            grade_format=grade_format
        )

        # Format the response
        grading_results = {
            'grade': grades.get('grade'),
            'feedback': grades.get('feedback'),
            'criteria_grades': grades.get('criteria_grades', {}),
            'success': True,
            'grade_format': grade_format
        }

        # Update submission with AI grades
        update_response = await supabase.table('SubmittedAssignment').update({
            'ai_grade': grading_results['grade'],
            'ai_feedback': grading_results['feedback'],
            'rubric_grades': grading_results['criteria_grades'],
            'status': 'grading_in_progress',
            'updated_at': 'now()'
        }).eq('id', submission_id).execute()

        if update_response.error:
            raise Exception(f"Error updating submission: {update_response.error.message}")

        return jsonify(grading_results), 200

    except Exception as e:
        logger.error(f"Error in grade_submission: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

# Error handler for async operations
@app.errorhandler(asyncio.CancelledError)
def handle_cancelled_error(error):
    logger.error(f"Operation cancelled: {str(error)}")
    return jsonify({
        'error': 'Operation cancelled',
        'success': False
    }), 500

# Startup tasks
@app.before_first_request
def startup():
    # Start the queue processor
    asyncio.create_task(queue_processor.process_queue())

if __name__ == '__main__':
    app.run(debug=True)