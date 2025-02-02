from flask import Flask, jsonify, request
import asyncio
from asyncio import Queue, Semaphore
import aiohttp
import fitz  # PyMuPDF
from openai import AsyncOpenAI
from supabase import create_client, Client
import logging
from typing import Dict, List, Any

class AssignmentQueue:
    def __init__(self, max_concurrent: int = 5):
        self.queue = asyncio.Queue()
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.processing = set()
        self.openai_client = AsyncOpenAI()
        self.setup_logging()

    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    async def add_submission(self, submission_id: str, pdf_url: str):
        await self.queue.put({
            'submission_id': submission_id,
            'pdf_url': pdf_url,
            'status': 'pending'
        })
        self.logger.info(f"Added submission {submission_id} to queue")

    async def process_queue(self):
        while True:
            try:
                # Process submissions concurrently but with rate limiting
                async with self.semaphore:
                    submission = await self.queue.get()
                    self.processing.add(submission['submission_id'])
                    
                    try:
                        await self.process_submission(submission)
                    except Exception as e:
                        self.logger.error(f"Error processing submission {submission['submission_id']}: {str(e)}")
                    finally:
                        self.processing.remove(submission['submission_id'])
                        self.queue.task_done()
                        
            except Exception as e:
                self.logger.error(f"Queue processing error: {str(e)}")
                await asyncio.sleep(1)  # Prevent tight loop on errors

    async def process_submission(self, submission: Dict):
        try:
            # 1. Extract PDF content
            pdf_content = await self.extract_pdf_content(submission['pdf_url'])
            
            # 2. Process with GPT-4o
            grades = await self.grade_with_ai(pdf_content)
            
            # 3. Update database
            await self.update_submission(submission['submission_id'], grades)
            
        except Exception as e:
            await self.handle_processing_error(submission['submission_id'], str(e))

    async def grade_with_ai(self, content: str) -> Dict:
        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert grader analyzing student submissions..."
                    },
                    {
                        "role": "user",
                        "content": content
                    }
                ],
                temperature=0.3
            )
            return self._parse_ai_response(response)
        except Exception as e:
            raise Exception(f"AI grading failed: {str(e)}")

# Flask application setup
app = Flask(__name__)
queue_processor = AssignmentQueue()

@app.route('/submit', methods=['POST'])
async def submit_assignment():
    data = request.json
    submission_id = data.get('submission_id')
    pdf_url = data.get('pdf_url')
    
    await queue_processor.add_submission(submission_id, pdf_url)
    return jsonify({'status': 'queued', 'submission_id': submission_id})

# Start queue processor
@app.before_first_request
def start_queue_processor():
    asyncio.create_task(queue_processor.process_queue())