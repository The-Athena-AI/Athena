from Athena.backend_api.src.main.Grading import Files
import CreateFileDAO as DAO
import docai_processing as docai

def main():
    pdf = None
    with open("C:/Users/undea/Athena/Athena/backend_api/src/main/Creation/Winnie_the_Pooh_3_Pages.pdf", "rb") as pdf_file:
        pdf = docai.process_document(pdf_file)
    assignment = Files.Assignment("2", "rubric_id", "Assignment 2", "teacher_id", pdf)
    DAO.upload_assignment(assignment)
    print("Hello World")

if __name__ == "__main__":
    main()
