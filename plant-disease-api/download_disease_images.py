"""
download_disease_images.py

This script downloads plant disease images from the web for each specified class.
It uses Bing Image Search API (or Google Custom Search API if you provide keys) to fetch images for each disease and healthy class.

Usage:
  python download_disease_images.py --output_dir plant-disease-api/raw --num_images 100

You must set your API key in the script or as an environment variable.
"""
import os
import requests
import argparse
from urllib.parse import quote

API_KEY = os.getenv('BING_API_KEY')  # Set your Bing Image Search API key here or as env var
SEARCH_URL = "https://api.bing.microsoft.com/v7.0/images/search"

# List your plant and disease classes here
CLASSES = [
    "guava anthracnose",
    "guava leaf spot",
    "guava healthy",
    "sapota powdery mildew",
    "sapota healthy"
]

def download_images(query, output_dir, num_images):
    headers = {"Ocp-Apim-Subscription-Key": API_KEY}
    params = {"q": query, "license": "public", "imageType": "photo", "count": num_images}
    response = requests.get(SEARCH_URL, headers=headers, params=params)
    response.raise_for_status()
    results = response.json()["value"]
    os.makedirs(output_dir, exist_ok=True)
    for i, img in enumerate(results):
        img_url = img["contentUrl"]
        ext = img_url.split('.')[-1].split('?')[0]
        fname = f"{query.replace(' ', '_')}_{i}.{ext}"
        try:
            img_data = requests.get(img_url, timeout=10)
            img_data.raise_for_status()
            with open(os.path.join(output_dir, fname), 'wb') as f:
                f.write(img_data.content)
            print(f"Downloaded {fname}")
        except Exception as e:
            print(f"Failed to download {img_url}: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download plant disease images.")
    parser.add_argument('--output_dir', type=str, required=True, help='Directory to save images')
    parser.add_argument('--num_images', type=int, default=100, help='Number of images per class')
    args = parser.parse_args()

    if not API_KEY:
        print("Error: Set your Bing Image Search API key in the script or as BING_API_KEY env variable.")
        exit(1)

    for cls in CLASSES:
        out_dir = os.path.join(args.output_dir, cls.replace(' ', '_'))
        print(f"Downloading images for {cls}...")
        download_images(cls, out_dir, args.num_images)
    print("Image download complete.")
