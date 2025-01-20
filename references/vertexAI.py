import vertexai
from vertexai.generative_models import GenerativeModel
from dotenv import load_dotenv
import os

# TODO(developer): Update and un-comment below line
# PROJECT_ID = "your-project-id"
load_dotenv()
projectID = os.getenv("PROJECT_ID")
vertexai.init(project=projectID, location="us-central1")

model = GenerativeModel("gemini-1.5-pro-002")

response = model.generate_content(
    "What's a good name for a flower shop that specializes in selling bouquets of dried flowers?"
)

print(response.text)
# Example response:
# **Emphasizing the Dried Aspect:**
# * Everlasting Blooms
# * Dried & Delightful
# * The Petal Preserve
# ...