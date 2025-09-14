MODEL_PATH = 'C://Users//leela//Downloads//Final4//GNPlantCareApp//plant-disease-data//train//plant_disease_model.h5'
train_dir = 'C://Users//leela//Downloads//Final4//GNPlantCareApp//plant-disease-data//train'
print('Starting Flask API...')
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)

MODEL_PATH = 'plant_disease_mobilenet_final.h5'  # Latest model for predictions
print('Loading model:', MODEL_PATH)
model = load_model(MODEL_PATH)
print('Model loaded successfully.')
print('Model input shape:', model.input_shape)

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
        }
    print('Prediction result:', result)
    os.remove(img_path)
    return jsonify(result)

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    print('Uploads directory ready.')
    app.run(host='0.0.0.0', port=5000, debug=True)