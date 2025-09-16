import os
import shutil

# List of real disease names you want to use as folder names
DISEASE_NAMES = [
    "Dutch_elm_disease",
    "Chestnut_blight",
    "Ash_dieback",
    "Oak_wilt",
    "Sudden_oak_death",
    "White_pine_blister_rust",
    "Dothistroma_needle_blight",
    "Needle_cast",
    "Armillaria_root_rot",
    "Phytophthora_root_rot",
    "Fire_blight",
    "Anthracnose",
    "Verticillium_wilt",
    "Powdery_mildew",
    "Bacterial_leaf_scorch",
    "Thousand_cankers_disease",
    "Laurel_wilt",
    "Black_knot",
    "Cytospora_canker",
    "Beech_bark_disease",
    "Seiridium_canker",
    "Spruce_needle_rust",
    "Apple_scab",
    "Brown_rot",
    "Pine_wilt_disease",
    "Botryosphaeria_canker",
    "Diplodia_tip_blight",
    "Elm_yellows",
    "Oak_decline",
    "Sooty_mold",
    "Palm_lethal_yellowing",
    "Phytophthora_collar_rot",
    "Silver_leaf",
    "Hypoxylon_canker",
    "Fusarium_wilt",
    "Cedar_apple_rust",
    "Stem_rust",
    "Nectria_canker",
    "Lophodermium_needle_cast",
    "Anthracnose_of_sycamore"
]

# Path to your dataset
DATASET_PATH = "plant-disease-data/train"

# Create new folders for each disease
for disease in DISEASE_NAMES:
    new_folder = os.path.join(DATASET_PATH, disease)
    if not os.path.exists(new_folder):
        os.makedirs(new_folder)
        print(f"Created folder: {new_folder}")

print("All disease folders created. Please move/copy your images into the correct folders.")
