import cv2
import sys
import json
import fitz
from ultralytics import YOLOv10
from utils import select

model_path = '/home/skes/final_menu/runs/detect/train/weights/best.pt'
# image_path = sys.argv[1]
image_path = "/home/skes/final_menu/frontend/resize.jpg"

def detect_CNS_mark(model_path,image_path):
    model = YOLOv10(model_path)
    image = cv2.imread(image_path,cv2.IMREAD_GRAYSCALE)
    image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    results = model(image)[0]
    num_list = results.boxes.cls.to('cpu').tolist()
    box_pos_list = results.boxes.xyxy.to('cpu').tolist()

    sel_list = []
    for i,box_two_point in enumerate(box_pos_list):
        sel_pos = (0.5*(box_two_point[0]+box_two_point[2]),0.5*(box_two_point[1]+box_two_point[3]))
        if num_list[i]==0:
            sel_num = 1
        elif num_list[i]==1:
            sel_num = 3
        elif num_list[i]==2:
            sel_num = 2
        elif num_list[i]==3:
            sel_num = 4
        else:
            sel_num = 5
        sel = select(sel_pos[0],sel_pos[1],sel_num)
        #保存所有selection
        sel_list.append(sel)

    # # Save the list to a JSON file
    # with open('sel_list.json', 'w') as f:
    #     json.dump(sel_list, f)

    return sel_list

if __name__ == "__main__":
    result = detect_CNS_mark(model_path,image_path)
    print(result)