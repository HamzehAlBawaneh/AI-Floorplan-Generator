# ===========================================================
# shape_ensemble_infer.py
# Ensemble ConvNeXt-Tiny Shape Classifier (Production Ready)
# With Backend-Compatible Function
# ===========================================================

import os, glob, sys, torch, torch.nn as nn, torch.nn.functional as F
from torchvision import transforms
from torchvision.models import convnext_tiny
from PIL import Image

# Fix Windows Unicode encoding issues
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# ---------- CONFIG ----------
IMG_SIZE = 192
CLASS_NAMES = ['Lshape', 'irregular', 'rectangle', 'square', 'triangle']
MODEL_PATTERN = "best_convnext_tiny*.pth"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ---------- PREPROCESSING ----------
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# ---------- MODEL BUILD ----------
def build_convnext_tiny(num_classes=len(CLASS_NAMES)):
    model = convnext_tiny(weights=None)
    in_features = model.classifier[2].in_features
    model.classifier[2] = nn.Sequential(
        nn.Dropout(0.6),
        nn.Linear(in_features, num_classes)
    )
    return model

def load_all_models():
    model_paths = sorted(glob.glob(MODEL_PATTERN))
    if not model_paths:
        raise FileNotFoundError("No model checkpoints found matching pattern: " + MODEL_PATTERN)
    models = []
    for path in model_paths:
        model = build_convnext_tiny()
        state = torch.load(path, map_location=DEVICE)
        model.load_state_dict(state, strict=False)
        model.eval().to(DEVICE)
        models.append(model)
        print(f"Loaded model: {os.path.basename(path)}")  # Removed emoji
    print(f"Total models loaded: {len(models)}")  # Removed emoji
    return models

# Load models with error handling
try:
    MODELS = load_all_models()
except Exception as e:
    print(f"Error loading models: {e}")
    MODELS = []

# ---------- ENSEMBLE PREDICTION ----------
@torch.no_grad()
def predict_shape(image_path: str):
    """Returns (predicted_label, confidence, top5_list)"""
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")  # Removed emoji

    if not MODELS:
        raise RuntimeError("No models available for prediction")

    try:
        img = Image.open(image_path).convert("RGB")
        x = transform(img).unsqueeze(0).to(DEVICE)

        total_probs = torch.zeros((1, len(CLASS_NAMES)), device=DEVICE)
        for model in MODELS:
            logits = model(x)
            probs = F.softmax(logits, dim=1)
            total_probs += probs
        avg_probs = total_probs / len(MODELS)

        conf, pred_idx = torch.max(avg_probs, dim=1)
        label = CLASS_NAMES[pred_idx.item()]
        confidence = conf.item() * 100.0
        return label, confidence
    except Exception as e:
        raise RuntimeError(f"Prediction failed: {str(e)}")

# ---------- BACKEND FUNCTION ----------
def predict_from_backend(image_path: str):
    """
    For Node.js backend → returns only the predicted label as plain text.
    Example call:
        python shape_ensemble_infer.py "path/to/image.png"
    """
    try:
        label, confidence = predict_shape(image_path)
        print(label)  # Backend will capture this output
        return label
    except Exception as e:
        print(f"ERROR: {str(e)}", file=sys.stderr)
        sys.exit(1)

# ---------- MAIN ENTRY (CLI/Backend) ----------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python shape_ensemble_infer.py <image_path>")
        sys.exit(1)

    img_path = sys.argv[1]
    predict_from_backend(img_path)