import os
import shutil
import random

# Source folders
GUAVA_SRC = 'downloaded_images/guava leaf'
SAPOTA_SRC = 'downloaded_images/sapota leaf'
# Destination folders
GUAVA_TRAIN = '../plant-disease-data/train/guava'
GUAVA_VAL = '../plant-disease-data/val/guava'
SAPOTA_TRAIN = '../plant-disease-data/train/sapota'
SAPOTA_VAL = '../plant-disease-data/val/sapota'

os.makedirs(GUAVA_TRAIN, exist_ok=True)
os.makedirs(GUAVA_VAL, exist_ok=True)
os.makedirs(SAPOTA_TRAIN, exist_ok=True)
os.makedirs(SAPOTA_VAL, exist_ok=True)

def split_and_move(src, train_dst, val_dst, split_ratio=0.8):
    images = [f for f in os.listdir(src) if os.path.isfile(os.path.join(src, f))]
    random.shuffle(images)
    split_idx = int(len(images) * split_ratio)
    train_images = images[:split_idx]
    val_images = images[split_idx:]
    for img in train_images:
        shutil.copy2(os.path.join(src, img), os.path.join(train_dst, img))
    for img in val_images:
        shutil.copy2(os.path.join(src, img), os.path.join(val_dst, img))
    print(f"Moved {len(train_images)} images to {train_dst}, {len(val_images)} images to {val_dst}")

split_and_move(GUAVA_SRC, GUAVA_TRAIN, GUAVA_VAL)
split_and_move(SAPOTA_SRC, SAPOTA_TRAIN, SAPOTA_VAL)
print('Image organization complete.')
