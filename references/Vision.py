
# Imports the Google Cloud client library
from google.cloud import vision
import os
from os import listdir
from os.path import isfile, join
from Athena.references.my_timer import my_timer
import time

def detect_text(path):
    client = vision.ImageAnnotatorClient()
    with open(path, "rb") as image_file:
        content = image_file.read()
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations
    ocr_text = []
    for text in texts:
        ocr_text.append(f"\r\n{text.description}")
    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
    return texts[0].description

@my_timer
def main():
    mypath = "poseidon/uploads/ChemistryProblem.png"
    only_files = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    for image_path in only_files:
        text = detect_text(mypath+image_path)
        print(image_path)
        print(text)

if __name__ == "__main__":
     main()

# def run_quickstart() -> vision.EntityAnnotation:
#     """Provides a quick start example for Cloud Vision."""

#     # Instantiates a client
#     client = vision.ImageAnnotatorClient()

#     # The URI of the image file to annotate
#     file_uri = "/Users/prajnyiqueghimire/Pandora-s-Box/poseidon/uploads/ChemistryProblem.png"

#     image = vision.Image()
#     image.source.image_uri = file_uri

#     # Performs label detection on the image file
#     response = client.label_detection(image=image)
#     labels = response.label_annotations

#     print("Labels:")
#     for label in labels:
#         print(label.description)

#     return labels

# run_quickstart()