import os
from pathlib import Path

# Path to the problematic file
bing_downloader_path = os.path.join(os.path.dirname(os.__file__), 'site-packages', 'bing_image_downloader', 'downloader.py')

# Read the file
with open(bing_downloader_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Replace Path.isdir with Path(image_dir).is_dir()
for i, line in enumerate(lines):
    if 'Path.isdir' in line:
        lines[i] = line.replace('Path.isdir(image_dir)', 'Path(image_dir).is_dir()')

# Write back the file
with open(bing_downloader_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Patched bing_image_downloader/downloader.py successfully.')
