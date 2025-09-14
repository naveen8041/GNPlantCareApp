import os
import shutil

# Paths
TRAIN_GUAVA = 'C:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-api/train/guava'
TRAIN_SAPOTA = 'C:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-api/train/sapota'
VAL_GUAVA = 'C:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-api/val/guava'
VAL_SAPOTA = 'C:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-api/val/sapota'

os.makedirs(VAL_GUAVA, exist_ok=True)
os.makedirs(VAL_SAPOTA, exist_ok=True)

def copy_one_image(src_folder, dst_folder):
    images = [f for f in os.listdir(src_folder) if os.path.isfile(os.path.join(src_folder, f))]
    if images:
        shutil.copy2(os.path.join(src_folder, images[0]), os.path.join(dst_folder, images[0]))
        print(f"Copied {images[0]} from {src_folder} to {dst_folder}")
    else:
        print(f"No images found in {src_folder}")

copy_one_image(TRAIN_GUAVA, VAL_GUAVA)
copy_one_image(TRAIN_SAPOTA, VAL_SAPOTA)
print('Validation folders populated.')
