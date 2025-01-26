import sys
import os

# Add project root to PYTHONPATH
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
sys.path.append(project_root)

from Athena.backend_api.src.main.Grading import Files
import CreateFileDAO as DAO
import docai_processing as docai

def main():
    pdf = None
    with open("C:/Users/undea/Athena/Athena/backend_api/src/main/Creation/Winnie_the_Pooh_3_Pages.pdf", "rb") as pdf_file:
        pdf = docai.process_document(pdf_file)
    rubric = Files.Rubric("3", "rubric_id", "Rubric 3", "teacher_id", pdf)
    DAO.upload_rubric(rubric)
    print("Hello World")

if __name__ == "__main__":
    main()
