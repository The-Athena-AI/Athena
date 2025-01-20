from PIL import Image
from pix2tex.cli import LatexOCR

img = Image.open('./uploads/HW_8_Assignment_submission_number_4.jpg')
model = LatexOCR()
print(model(img))