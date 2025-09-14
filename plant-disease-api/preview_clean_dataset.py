import os
from PIL import Image

# Folders to check
folders = [
    'c:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-data/train/guava',
    'c:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-data/train/sapota',
    'c:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-data/val/guava',
    'c:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-data/val/sapota'
]

for folder in folders:
    print(f'Checking folder: {folder}')
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            with Image.open(file_path) as img:
                img.verify()  # Check if image is readable
        except Exception as e:
            print(f'Corrupt or unreadable image: {file_path} ({e})')

print('Dataset preview and cleaning complete. Remove any listed corrupt images.')
