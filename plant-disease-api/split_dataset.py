import os
import shutil
import random

# Set your source directory containing class folders
SOURCE_DIR = 'C:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-api/all_images'
TRAIN_DIR = 'C:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-api/train'
VAL_DIR = 'C:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-api/val'
SPLIT_RATIO = 0.8  # 80% train, 20% val

os.makedirs(TRAIN_DIR, exist_ok=True)
os.makedirs(VAL_DIR, exist_ok=True)

for class_name in os.listdir(SOURCE_DIR):
    class_path = os.path.join(SOURCE_DIR, class_name)
    if not os.path.isdir(class_path):
        continue
    images = [f for f in os.listdir(class_path) if os.path.isfile(os.path.join(class_path, f))]
    random.shuffle(images)
    split_idx = int(len(images) * SPLIT_RATIO)
    train_images = images[:split_idx]
    val_images = images[split_idx:]

    train_class_dir = os.path.join(TRAIN_DIR, class_name)
    val_class_dir = os.path.join(VAL_DIR, class_name)
    os.makedirs(train_class_dir, exist_ok=True)
    os.makedirs(val_class_dir, exist_ok=True)

    for img in train_images:
        shutil.copy2(os.path.join(class_path, img), os.path.join(train_class_dir, img))
    for img in val_images:
        shutil.copy2(os.path.join(class_path, img), os.path.join(val_class_dir, img))

print('Dataset split complete!')
