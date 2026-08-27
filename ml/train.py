import argparse
from pathlib import Path

from ultralytics import YOLO


EXPECTED_CLASSES = ["stranded_person", "group_of_people"]


def parse_args():
    parser = argparse.ArgumentParser(description="Train the Sky Guardian YOLO detector.")
    parser.add_argument("--data", default="ml/data.yaml")
    parser.add_argument("--model", default="yolo11n.pt")
    parser.add_argument("--epochs", type=int, default=100)
    parser.add_argument("--imgsz", type=int, default=960)
    parser.add_argument("--batch", type=int, default=4)
    parser.add_argument("--device", default="auto", help="auto, cpu, mps, or a CUDA device")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--project", default="ml/runs")
    parser.add_argument("--name", default="sky_guardian_accuracy")
    parser.add_argument("--resume", action="store_true")
    parser.add_argument("--validate-only", action="store_true")
    return parser.parse_args()


def resolve_device(value: str):
    if value != "auto":
        return value
    try:
        import torch
        if torch.cuda.is_available():
            return 0
        if torch.backends.mps.is_available():
            return "mps"
    except ImportError:
        pass
    return "cpu"


def main():
    args = parse_args()
    data_path = Path(args.data)
    if not data_path.exists():
        raise FileNotFoundError(f"Dataset manifest not found: {data_path}")

    model = YOLO(args.model)
    if args.validate_only:
        result = model.val(data=str(data_path), imgsz=args.imgsz, device=resolve_device(args.device), verbose=False)
        print(f"mAP50={result.box.map50:.4f} mAP50-95={result.box.map:.4f}")
        return

    model.train(
        data=str(data_path),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        device=resolve_device(args.device),
        workers=args.workers,
        project=args.project,
        name=args.name,
        pretrained=True,
        patience=25,
        cache=False,
        amp=True,
        seed=0,
        deterministic=True,
        close_mosaic=10,
        cos_lr=True,
        fliplr=0.5,
        hsv_h=0.015,
        hsv_s=0.5,
        hsv_v=0.3,
        resume=args.resume,
    )


if __name__ == "__main__":
    main()