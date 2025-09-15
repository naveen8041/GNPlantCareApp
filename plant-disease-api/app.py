MODEL_PATH = 'C://Users//leela//Downloads//Final4//GNPlantCareApp//plant-disease-data//train//plant_disease_model.h5'
train_dir = 'C://Users//leela//Downloads//Final4//GNPlantCareApp//plant-disease-data//train'
print('Starting Flask API...')
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)

<<<<<<< HEAD
IDENTIFY_MODEL_PATH = 'plant_disease_mobilenet_final.h5'
HEALTH_MODEL_PATH = 'plant_health_model.h5'
print('Loading models:', IDENTIFY_MODEL_PATH, HEALTH_MODEL_PATH)
identify_model = load_model(IDENTIFY_MODEL_PATH)
health_model = load_model(HEALTH_MODEL_PATH)
print('Models loaded successfully.')
print('Model input shape:', identify_model.input_shape)
=======
MODEL_PATH = 'plant_disease_mobilenet_final.h5'  # Latest model for predictions
print('Loading model:', MODEL_PATH)
model = load_model(MODEL_PATH)
print('Model loaded successfully.')
print('Model input shape:', model.input_shape)
>>>>>>> 116c06a9960a32a0463a3cb7ff0a56f200dfdc6d

# Dynamically load class names from train directory
CLASS_NAMES = [d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))]
print('Loaded class names:', CLASS_NAMES)

@app.route('/predict', methods=['POST'])
def predict():
    print('Received request to /predict')
    if 'file' not in request.files:
        print('No file uploaded')
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
<<<<<<< HEAD
    # Accept only image files
    allowed_exts = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp', '.tiff'}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_exts:
        print(f'Unsupported file type: {ext}')
        return jsonify({'error': f'Unsupported file type: {ext}'}), 400
    img_path = os.path.join('uploads', file.filename)
    file.save(img_path)
    print('Saved file to', img_path)
    try:
        # Load image in any size, then resize for each model
        img_raw = image.load_img(img_path)
        # For identify model (128x128)
        img_id = img_raw.resize((128, 128))
        x_id = image.img_to_array(img_id)
        x_id = np.expand_dims(x_id, axis=0) / 255.0
        # For health model (224x224)
        img_health = img_raw.resize((224, 224))
        x_health = image.img_to_array(img_health)
        x_health = np.expand_dims(x_health, axis=0) / 255.0
    except Exception as e:
        print(f'Error loading image: {e}')
        os.remove(img_path)
        return jsonify({'error': 'Invalid image file'}), 400

    # Plant identification
    id_preds = identify_model.predict(x_id)
    id_class_idx = np.argmax(id_preds[0])
    id_confidence = float(id_preds[0][id_class_idx])
    id_class = CLASS_NAMES[id_class_idx] if id_class_idx < len(CLASS_NAMES) else 'Unknown'

    # Health/disease info
    health_preds = health_model.predict(x_health)
    # Use fixed class mapping from training
    class_indices = {
        'guava_healthy': 0,
        'guava_unhealthy': 1,
        'sapota_healthy': 2,
        'sapota_unhealthy': 3
    }
    health_class_names = [None] * len(class_indices)
    for name, idx in class_indices.items():
        health_class_names[idx] = name
    health_class_idx = np.argmax(health_preds[0])
    health_confidence = float(health_preds[0][health_class_idx])
    health_class = health_class_names[health_class_idx] if health_class_idx < len(health_class_names) else 'Unknown'

    if '_' in health_class:
        disease, condition = health_class.split('_', 1)
    else:
        disease, condition = health_class, 'Unknown'

    medicine_map = {
        'guava_bad': 'Copper fungicide, Neem oil',
        'guava_good': 'No treatment needed',
        'sapota_bad': 'Copper fungicide, Neem oil',
        'sapota_good': 'No treatment needed',
    }
    spoilage_map = {
        'guava_bad': 70,
        'guava_good': 10,
        'sapota_bad': 70,
        'sapota_good': 10,
    }
    medicine = medicine_map.get(health_class, 'Unknown')
    plant_conf_threshold = 0.7
    health_conf_threshold = 0.7
    # Dynamic spoilage percent based on health_confidence and condition
    if health_confidence >= health_conf_threshold:
        if condition == "unhealthy":
            spoilage_percent = int(health_confidence * 100)
        elif condition == "healthy":
            spoilage_percent = int((1 - health_confidence) * 10 + 10)  # 10-20% for healthy
        else:
            spoilage_percent = 0
    else:
        spoilage_percent = 0

    if id_confidence < plant_conf_threshold:
            est_health_conf = round(id_confidence, 2)
            est_spoilage = int((1 - id_confidence) * 80 + 20)  # 20-100% spoilage based on plant confidence
            result = {
                "plant": id_class,
                "plant_confidence": id_confidence,
                "disease": "Unknown",
                "condition": "unhealthy",
                "health_confidence": est_health_conf,
                "spoilage_percent": est_spoilage,
                "medicine": "N/A"
            }
    elif health_confidence < health_conf_threshold:
        result = {
            "plant": id_class,
            "plant_confidence": id_confidence,
            "disease": "Unknown",
            "condition": "Low confidence",
            "health_confidence": health_confidence,
            "spoilage_percent": 0,
            "medicine": "N/A"
        }
    else:
        result = {
            "plant": id_class,
            "plant_confidence": id_confidence,
            "disease": disease,
            "condition": condition,
            "health_confidence": health_confidence,
            "spoilage_percent": spoilage_percent,
            "medicine": medicine
=======
    img_path = os.path.join('uploads', file.filename)
    file.save(img_path)
    print('Saved file to', img_path)

    img = image.load_img(img_path, target_size=(128, 128))  # Match model input
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0) / 255.0

    preds = model.predict(x)
    print('Model output:', preds[0])
    class_idx = np.argmax(preds[0])
    print('Class idx:', class_idx)
    if class_idx >= len(CLASS_NAMES):
        result = {
            'class': 'Unknown',
            'confidence': float(np.max(preds[0]))
        }
    else:
        result = {
            'class': CLASS_NAMES[class_idx],
            'confidence': float(preds[0][class_idx])
>>>>>>> 116c06a9960a32a0463a3cb7ff0a56f200dfdc6d
        }
    print('Prediction result:', result)
    os.remove(img_path)
    return jsonify(result)

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    print('Uploads directory ready.')
    app.run(host='0.0.0.0', port=5000, debug=True)