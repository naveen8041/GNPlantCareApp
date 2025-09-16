import os
from shutil import move
from PIL import Image

def organize_disease_dataset(src_dir, disease_map):
    print(f"Organizing dataset in: {src_dir}")
    for img_name in os.listdir(src_dir):
        img_path = os.path.join(src_dir, img_name)
        if not os.path.isfile(img_path):
            continue
        # Use disease_map to determine folder
        disease = disease_map.get(img_name)
        if not disease:
            print(f"No disease label for {img_name}, skipping.")
            continue
        disease_dir = os.path.join(src_dir, disease)
        os.makedirs(disease_dir, exist_ok=True)
        move(img_path, os.path.join(disease_dir, img_name))
    print("Organization complete.")


import csv

def load_disease_map(csv_path):
    disease_map = {}
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if len(row) >= 2:
                disease_map[row[0]] = row[1]
    return disease_map

if __name__ == "__main__":
    # Prepare a CSV file with two columns: image_name,disease_name
    # Example row: img1.jpg,anthracnose
    csv_path = "plant-disease-data/disease_labels.csv"
    src_dir = "plant-disease-data/disease_raw"
    disease_map = load_disease_map(csv_path)
    organize_disease_dataset(src_dir, disease_map)
