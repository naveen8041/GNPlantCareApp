MODEL_PATH = 'C://Users//leela//Downloads//Final4//GNPlantCareApp//plant-disease-data//train//plant_disease_model.h5'
train_dir = 'C://Users//leela//Downloads//Final4//GNPlantCareApp//plant-disease-data//train'
print('Starting Flask API...')
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)


# IDENTIFY_MODEL_PATH: For Plant Confidence and plant details
IDENTIFY_MODEL_PATH = 'plant_disease_mobilenet_final.h5'
# HEALTH_MODEL_PATH: For Condition, Health Confidence, and Spoilage
HEALTH_MODEL_PATH = 'plant_health_model.h5'
# DISEASE_MODEL_PATH: For Disease field alone
DISEASE_MODEL_PATH = 'disease_model.h5'

print('Loading models:', IDENTIFY_MODEL_PATH, HEALTH_MODEL_PATH, DISEASE_MODEL_PATH)
identify_model = load_model(IDENTIFY_MODEL_PATH)
health_model = load_model(HEALTH_MODEL_PATH)
disease_model = load_model(DISEASE_MODEL_PATH)
print('Models loaded successfully.')
print('Model input shape:', identify_model.input_shape)



# Dynamically load class names for plant identification (original train_dir)
CLASS_NAMES = [d for d in os.listdir('C://Users//leela//Downloads//Final4//GNPlantCareApp//plant-disease-data//train') if os.path.isdir(os.path.join('C://Users//leela//Downloads//Final4//GNPlantCareApp//plant-disease-data//train', d))]
print('Loaded class names:', CLASS_NAMES)

# Load disease class names from PlantVillage dataset for disease model (ignore non-class folders)
plantvillage_dir = 'C:/Users/leela/Downloads/diseases_images/Newfolder/archive/PlantVillage'
DISEASE_CLASS_NAMES = [d for d in os.listdir(plantvillage_dir) if os.path.isdir(os.path.join(plantvillage_dir, d)) and d.lower() != 'plantvillage']
print('Loaded disease class names:', DISEASE_CLASS_NAMES)

@app.route('/predict', methods=['POST'])
def predict():
    print('Received request to /predict')
    if 'file' not in request.files:
        print('No file uploaded')
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
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


    # Plant identification (plant details and confidence)
    id_preds = identify_model.predict(x_id)
    id_class_idx = np.argmax(id_preds[0])
    id_confidence = float(id_preds[0][id_class_idx])
    id_class = CLASS_NAMES[id_class_idx] if id_class_idx < len(CLASS_NAMES) else 'Unknown'

    # Health model (condition, health confidence, spoilage)
    health_preds = health_model.predict(x_health)
    print(f'Raw health model predictions: {health_preds[0]}')
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
    # Improved spoilage percent calculation
    if health_confidence >= health_conf_threshold:
        if condition == "healthy":
            # Healthy: low spoilage (10-30%)
            spoilage_percent = int((1 - health_confidence) * 20) + 10
        elif condition == "unhealthy":
            # Unhealthy: high spoilage (30-100%)
            spoilage_percent = int((1 - health_confidence) * 70) + 30
        else:
            spoilage_percent = 0
    else:
        spoilage_percent = 0

    # Disease model (disease field only)
    disease_pred = "Unknown"
    try:
        # If plant or health model predicts healthy, set disease to 'healthy'
        if condition == "healthy" or "healthy" in id_class.lower():
            disease_pred = "healthy"
        else:
            disease_model = load_model(DISEASE_MODEL_PATH)
            img = image.load_img(img_path, target_size=(224, 224))
            x = image.img_to_array(img)
            x = np.expand_dims(x, axis=0)
            x = x / 255.0
            preds = disease_model.predict(x)
            disease_class_idx = np.argmax(preds[0])
            if disease_class_idx < len(DISEASE_CLASS_NAMES):
                folder_name = DISEASE_CLASS_NAMES[disease_class_idx]
                # Replace the part before the first underscore with the plant name
                if '_' in folder_name:
                    parts = folder_name.split('_', 1)
                    disease_pred = f"{id_class}_{parts[1]}"
                else:
                    disease_pred = folder_name
            else:
                disease_pred = str(disease_class_idx)
    except Exception as e:
        print(f"Disease prediction error: {e}")
    result = {
        "plant": id_class,
        "plant_confidence": id_confidence,
        "disease": disease_pred,
        "condition": condition,
        "spoilage_percent": spoilage_percent,
        "medicine": medicine
    }
    print('Prediction result:', result)
    os.remove(img_path)
    return jsonify(result)

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    print('Uploads directory ready.')
    app.run(host='0.0.0.0', port=5000, debug=True)