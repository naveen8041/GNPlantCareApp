import os
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer

# Example: symptoms for multi-label classification
SYMPTOM_LABELS = [
    "leaf_spots",
    "leaf_distortion",
    "twig_blight",
    "cankers",
    "premature_defoliation"
]

# Example: CSV format for multi-label dataset
# Columns: image_path, symptoms (comma-separated)
# Example row: plant-disease-data/train/Anthracnose_of_sycamore/img1.jpg,leaf_spots,twig_blight

# Create a template CSV for labeling images
DATASET_PATH = "plant-disease-data/train"
output_rows = []
for disease in os.listdir(DATASET_PATH):
    disease_folder = os.path.join(DATASET_PATH, disease)
    if os.path.isdir(disease_folder):
        for img in os.listdir(disease_folder):
            if img.lower().endswith(('.jpg', '.jpeg', '.png')):
                img_path = os.path.join(disease_folder, img)
                # Fill symptoms manually after generating CSV
                output_rows.append({
                    "image_path": img_path,
                    "symptoms": ""  # Fill with comma-separated symptoms
                })

# Save template CSV
df = pd.DataFrame(output_rows)
df.to_csv("multi_label_symptom_template.csv", index=False)
print("Template CSV created: multi_label_symptom_template.csv. Fill in symptoms for each image.")

# Example: How to use MultiLabelBinarizer for training
# df = pd.read_csv("multi_label_symptom_template.csv")
# mlb = MultiLabelBinarizer(classes=SYMPTOM_LABELS)
# y = mlb.fit_transform(df["symptoms"].str.split(","))
# Now y can be used as multi-label targets for model training.
