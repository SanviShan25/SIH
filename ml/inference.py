import json
import os
import sys

import cv2
from ultralytics import YOLO


def main():
    image_path, output_dir, model_path = sys.argv[1:4]
    model = YOLO(model_path)
    confidence = float(os.getenv("YOLO_CONF", "0.80"))
    image_size = int(os.getenv("YOLO_IMGSZ", "1280"))
    iou = float(os.getenv("YOLO_IOU", "0.5"))
    augment = os.getenv("YOLO_AUGMENT", "1").lower() in {"1", "true", "yes"}
    is_video = os.path.splitext(image_path)[1].lower() in {".mp4", ".mov", ".avi", ".webm", ".mkv"}
    frames = []
    if is_video:
        capture = cv2.VideoCapture(image_path)
        frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = capture.get(cv2.CAP_PROP_FPS) or 1.0
        target_frames = 60
        step = max(1, int(frame_count / target_frames)) if frame_count > 0 else max(1, int(fps))
        frame_index = 0
        while len(frames) < target_frames:
            ok, frame = capture.read()
            if not ok:
                break
            if frame_index % step == 0:
                frames.append((frame_index, frame))
            frame_index += 1
        capture.release()
    else:
        frame = cv2.imread(image_path)
        if frame is None:
            raise ValueError(f"Unable to read media file: {image_path}")
        frames = [(0, frame)]

    detections = []
    best_plot = None
    best_count = -1
    for frame_index, frame in frames:
        result = model.predict(source=frame, conf=confidence, imgsz=image_size, iou=iou, augment=augment, save=False, verbose=False)[0]
        frame_detections = []
        for box in result.boxes:
            coords = box.xyxy[0].tolist()
            width = max(0.0, coords[2] - coords[0]) / result.orig_shape[1]
            height = max(0.0, coords[3] - coords[1]) / result.orig_shape[0]
            frame_detections.append({"class": result.names[int(box.cls[0])], "confidence": float(box.conf[0]), "bbox": [coords[0] / result.orig_shape[1], coords[1] / result.orig_shape[0], width, height], "frameIndex": frame_index})
        detections.extend(frame_detections)
        if len(frame_detections) > best_count:
            best_count = len(frame_detections)
            best_plot = result.plot()
    annotated_dir = os.path.join(output_dir, "annotated")
    os.makedirs(annotated_dir, exist_ok=True)
    annotated_name = os.path.splitext(os.path.basename(image_path))[0] + ".jpg"
    annotated = os.path.join(annotated_dir, annotated_name)
    if best_plot is not None:
        cv2.imwrite(annotated, best_plot)
    model_classes = list(model.names.values())
    class_text = " ".join(model_classes).lower()
    capabilities = {
        "peopleDetection": any(term in class_text for term in ("person", "people")),
        "floodMapping": any(term in class_text for term in ("flood", "water", "inundat")),
        "settlementIdentification": any(term in class_text for term in ("building", "settlement", "house")),
        "roadAccessibility": any(term in class_text for term in ("road", "bridge", "blocked", "vehicle")),
    }
    print(json.dumps({
        "detections": detections,
        "annotatedImage": annotated,
        "framesProcessed": len(frames),
        "mediaType": "VIDEO" if is_video else "IMAGE",
        "modelClasses": model_classes,
        "capabilities": capabilities,
        "inference": {"confidence": confidence, "imageSize": image_size, "iou": iou, "augment": augment},
    }))


if __name__ == "__main__":
    main()