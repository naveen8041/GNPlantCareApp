<<<<<<< HEAD
from google_images_search import GoogleImagesSearch
import os

API_KEY = '668566251642-jacuubb7jt009o7ghi19152o1nd7t2hv.apps.googleusercontent.com'  # Replace with your Google Custom Search API Key
CX = '92587d8cc17e9410c'    # Replace with your Custom Search Engine ID

def download_images(query, folder, num_images=50):
    gis = GoogleImagesSearch(API_KEY, CX)
    if not os.path.exists(folder):
        os.makedirs(folder)
    gis.search({'q': query, 'num': num_images, 'safe': 'off', 'fileType': 'jpg|png'})
    for i, image in enumerate(gis.results()):
        try:
            image.download(folder)
        except Exception as e:
            print(f"Error downloading image {i}: {e}")

# Download images for each category
download_images('guava leaf healthy', 'plant-disease-data/train/guava_healthy', num_images=50)
download_images('guava leaf disease unhealthy', 'plant-disease-data/train/guava_unhealthy', num_images=50)
download_images('sapota leaf healthy', 'plant-disease-data/train/sapota_healthy', num_images=50)
download_images('sapota leaf disease unhealthy', 'plant-disease-data/train/sapota_unhealthy', num_images=50)
=======
from bing_image_downloader import downloader

# Download 50 guava leaf images
print('Downloading guava leaf images...')
downloader.download(
    "guava leaf",
    limit=50,
    output_dir="downloaded_images",
    adult_filter_off=True,
    force_replace=False,
    timeout=60
)

# Download 50 sapota leaf images
print('Downloading sapota leaf images...')
downloader.download(
    "sapota leaf",
    limit=50,
    output_dir="downloaded_images",
    adult_filter_off=True,
    force_replace=False,
    timeout=60
)

print('Image download complete. Check the downloaded_images folder.')
>>>>>>> 116c06a9960a32a0463a3cb7ff0a56f200dfdc6d
