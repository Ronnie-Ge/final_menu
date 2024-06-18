import json
import sys
from utils import BOX, create_dict
from det_rec import ocr_image
from det_num import detect_CNS_mark

# ocr_image parameters
img_file = sys.argv[1]
# img_file = "/home/skes/final_menu/frontend/uploads/a7a4b9f105f3d94dd797c225ac402368"
rec_model = "/home/skes/final_menu/v4_best_rec"
# detect_CNS_mark parameters
model_path = '/home/skes/final_menu/runs/detect/train/weights/best.pt'
image_path = "/home/skes/final_menu/frontend/resize.jpg"

ocr_result = ocr_image(img_file,rec_model)[0]
sel_list = detect_CNS_mark(model_path,image_path)

def create_menu(ocr_result):
    all_inf = []
    price_box_list = []
    old_box = BOX([[0,0],[0,0],[0,0],[0,0]])
    meal = ''

    for inf in ocr_result:
        box = inf[0]
        new_box = BOX(box)
        if meal and new_box.y > old_box.y_max:
            meal = ''
        info = inf[1][0]
        length = len(info)
        number = ''
        for i,c in enumerate(info):
            if c.isdigit():
                number += c
                if i==length-1:
                    d = create_dict([meal,number])
                    price_box_list.append(new_box)
                    all_inf.append(d)
                    meal = ''
            else:
                if number:
                    if len(number)>=4 or number[0]=='0':
                        number = ''
                        meal = ''
                        continue
                    d = create_dict([meal,number])
                    price_box_list.append(old_box)
                    all_inf.append(d)
                    meal = ''
                    number = ''
                meal += c
        old_box = new_box
    return all_inf,price_box_list

def create_custom_menu(price_box_list,all_inf,sel_list):
    # bill = 0
    num_list = [0 for _ in range(len(price_box_list))]
    for sel in sel_list:
        idx = -1
        dis_min = 9999
        for i, price_box in enumerate(price_box_list):
            if price_box.y_min <= sel.y <= price_box.y_max and sel.x >= price_box.x:
                x_dis = sel.x - price_box.x_max
                if x_dis < dis_min:
                    dis_min = x_dis
                    idx = i
                    
        num_list[idx] = sel.num

    for i,num in enumerate(num_list):
        all_inf[i]['index'] = i
        all_inf[i]['quantity'] = num
        if num!=0:
            print(all_inf[i])

    # Save the list to a JSON file
    with open('menu.json', 'w') as f:
        json.dump(all_inf, f, ensure_ascii=False, indent=4)

all_inf,price_box_list = create_menu(ocr_result)
create_custom_menu(price_box_list,all_inf,sel_list)