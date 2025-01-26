import docai_processing

def main():
    with open ("Athena/backend_api/src/main/Creation/00i_ALG1HWPFM_890836.indd.pdf", "rb") as file:
        text = docai_processing.process_document(file)
        print(text)

if __name__ == "__main__":
    main()
