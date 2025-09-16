import os
import shutil
import random

# Source data directory containing all disease/plant folders
DATA_SRC = 'C:/Users/leela/Downloads/diseases_images/archive/data'
# Destination base directories
TRAIN_DST = '../plant-disease-data/train'
VAL_DST = '../plant-disease-data/val'

def split_and_move(src, train_dst, val_dst, split_ratio=0.8):
    images = [f for f in os.listdir(src) if os.path.isfile(os.path.join(src, f))]
    random.shuffle(images)
    split_idx = int(len(images) * split_ratio)
    train_images = images[:split_idx]
    val_images = images[split_idx:]
    os.makedirs(train_dst, exist_ok=True)
    os.makedirs(val_dst, exist_ok=True)
    for img in train_images:
        shutil.copy2(os.path.join(src, img), os.path.join(train_dst, img))
    for img in val_images:
        shutil.copy2(os.path.join(src, img), os.path.join(val_dst, img))
    print(f"Moved {len(train_images)} images to {train_dst}, {len(val_images)} images to {val_dst}")

def organize_all():
    for folder in os.listdir(DATA_SRC):
        src_folder = os.path.join(DATA_SRC, folder)
        if os.path.isdir(src_folder):
            train_folder = os.path.join(TRAIN_DST, folder)
            val_folder = os.path.join(VAL_DST, folder)
            print(f"Organizing {folder}...")
            split_and_move(src_folder, train_folder, val_folder)

if __name__ == "__main__":
    organize_all()
    print('Image organization complete.')
