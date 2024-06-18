import cv2
import supervision as sv
from ultralytics import YOLOv10

def det_num_of_menu(image_path='/home/luffy/final_menu/data/menu1.webp',model_path='/home/luffy/final_menu/runs/detect/train/weights/best.pt'):
    model = YOLOv10(model_path)
    image = cv2.imread(image_path,cv2.IMREAD_GRAYSCALE)
    image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    results = model(image)[0]
    num_list = results.boxes.cls.to('cpu').tolist()
    box_pos_list = results.boxes.xyxy.to('cpu').tolist()
    
    ####劃出結果照片
    detections = sv.Detections.from_ultralytics(results)

    bounding_box_annotator = sv.BoundingBoxAnnotator(thickness=1)
    label_annotator = sv.LabelAnnotator(
        text_position=sv.Position.CENTER,
        text_scale=0.2,
        text_padding=0,
    )

    annotated_image = bounding_box_annotator.annotate(
        scene=image, detections=detections)

    for detection_idx in range(len(detections)):
        x1, y1, x2, y2 = detections.xyxy[detection_idx].astype(int)
        color = (0, 0, 0)
        annotated_image = cv2.rectangle(
            img=annotated_image,
            pt1=(x1, y1),
            pt2=(x2, y2),
            color=color,
            thickness=-1,
        )

    annotated_image = label_annotator.annotate(
        scene=annotated_image, detections=detections)

    sv.plot_image(annotated_image)
    return num_list, box_pos_list