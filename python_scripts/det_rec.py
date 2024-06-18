import numpy as np
import os
from PIL import Image, ExifTags
from paddleocr import PaddleOCR

img_file = "/home/skes/final_menu/frontend/uploads/a7a4b9f105f3d94dd797c225ac402368"
rec_model = "/home/skes/final_menu/v4_best_rec"

def ocr_image(img_file,rec_model):
    image = Image.open(img_file)
    size = (640,640)

    if ".JPG" in img_file:
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                break
        exif = dict(image._getexif().items())
        
        if exif[orientation] == 3:
            image = image.rotate(180, expand=True)
        elif exif[orientation] == 6:
            image = image.rotate(270, expand=True)
        elif exif[orientation] == 8:
            image = image.rotate(90, expand=True)

    image = image.resize(size)
    image.save('resize.jpg')

    ocr = PaddleOCR(use_angle_cls=True,rec_model=rec_model)  # need to run only once to download and load model into memory
    img_path = 'resize.jpg'
    result = ocr.ocr(img_path, cls=True)

    return result

if __name__ == "__main__":
    result = ocr_image(img_file,rec_model)
    print(result)