import os
from PIL import Image

def audit_and_clean_dataset(train_dir):
    print(f"Auditing dataset in: {train_dir}")
    for class_name in os.listdir(train_dir):
        class_path = os.path.join(train_dir, class_name)
        if not os.path.isdir(class_path):
            continue
        images = os.listdir(class_path)
        print(f"Checking {class_name}: {len(images)} images")
        for img_name in images:
            img_path = os.path.join(class_path, img_name)
            try:
                with Image.open(img_path) as img:
                    img.verify()  # Check if image is valid
            except Exception as e:
                print(f"Removing corrupted or invalid image: {img_path}")
                os.remove(img_path)
    print("Audit complete. Please manually check for irrelevant or mislabeled images.")

if __name__ == "__main__":
    train_dir = "C:/Users/leela/Downloads/Final4/GNPlantCareApp/plant-disease-api/plant-disease-data/train"
    audit_and_clean_dataset(train_dir)
