import os
from openai import OpenAI
from typing import Dict, List, Any

class AIGrader:
    def __init__(self):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    async def grade_assignment(self, content: str, rubric: Dict, grade_format: str = "numeric") -> Dict[str, Any]:
        """
        Grade assignments with flexible output formats.
        grade_format options: "numeric", "letter", "percentage", or custom format
        """
        try:
            # Format the rubric and grading instructions
            grading_instructions = self._get_grading_instructions(grade_format)
            rubric_prompt = self._format_rubric_prompt(rubric, grade_format)
            
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": f"""You are an expert grader. Grade the assignment based on the provided rubric. 
                        {grading_instructions}
                        
                        Rubric criteria and guidelines:
                        {rubric_prompt}
                        
                        Format your response as a structured JSON with:
                        - grade (in specified format)
                        - feedback (detailed summary)
                        - criteria_grades (detailed grades for each criterion)"""
                    },
                    {
                        "role": "user",
                        "content": f"Assignment Content:\n{content}"
                    }
                ],
                temperature=0.3,
                response_format={ "type": "json_object" }
            )
            
            grading_result = self._parse_grading_response(response.choices[0].message.content, grade_format)
            return grading_result
            
        except Exception as e:
            raise Exception(f"AI grading failed: {str(e)}")

    def _get_grading_instructions(self, grade_format: str) -> str:
        """Return grading instructions based on format"""
        format_instructions = {
            "numeric": "Grade each criterion on a scale from 0-100.",
            "letter": "Assign letter grades (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F).",
            "percentage": "Grade as percentages (0-100%).",
            # Add more formats as needed
        }
        return format_instructions.get(grade_format, "Use the specified grading format.")

    def _format_rubric_prompt(self, rubric: Dict, grade_format: str) -> str:
        """Format rubric based on grading format"""
        formatted_criteria = []
        
        for criterion, details in rubric.items():
            criterion_text = f"\n{criterion}:\n"
            for grade, description in details['grades'].items():
                criterion_text += f"Grade level {grade}: {description}\n"
            formatted_criteria.append(criterion_text)
            
        return "\n".join(formatted_criteria)

    def _parse_grading_response(self, response_text: str, grade_format: str) -> Dict[str, Any]:
        """Parse and validate the AI response with format-specific validation"""
        try:
            import json
            grading_data = json.loads(response_text)
            
            # Validate required fields
            required_fields = ['grade', 'feedback', 'criteria_grades']
            for field in required_fields:
                if field not in grading_data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Validate grade format (example validation)
            if grade_format == "letter":
                valid_grades = {'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'}
                if grading_data['grade'] not in valid_grades:
                    raise ValueError(f"Invalid letter grade: {grading_data['grade']}")
            elif grade_format == "percentage":
                grade = float(grading_data['grade'].strip('%'))
                if not (0 <= grade <= 100):
                    raise ValueError("Percentage grade must be between 0 and 100")
            
            return grading_data
            
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON response from AI grader")
        except Exception as e:
            raise ValueError(f"Error parsing grading response: {str(e)}")