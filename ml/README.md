# ML Inference

This folder contains the YOLO inference worker and model used by the backend.

Install dependencies from the repository root:

```bash
python3 -m pip install -r ml/requirements.txt
```

The backend invokes `inference.py` for uploaded images and videos. Override the
model location with `YOLO_MODEL_PATH` when needed; the default is
`ml/yolov11_flood.pt`.

## Training

The checked-in dataset manifest is `ml/data.yaml`. The current labels contain
only `stranded_person` and `group_of_people`; they do not provide ground truth
for water extent, settlements, roads, or road damage. Those capabilities need
new, human-reviewed labels before training a model for them.

Run a longer, reproducible training job from the repository root:

```bash
backend/.venv/bin/python ml/train.py --epochs 100 --imgsz 960 --batch 4
```

On a machine without the project environment, use `python3` after installing
`ml/requirements.txt`. Check the validation baseline without training with:

```bash
backend/.venv/bin/python ml/train.py --model ml/yolov11_flood.pt --validate-only
```

After reviewing `ml/runs/sky_guardian_accuracy/weights/best.pt`, point the API
at it with `YOLO_MODEL_PATH`. Keep separate labeled train and validation images
from the same flight out of both splits to avoid overly optimistic metrics.
