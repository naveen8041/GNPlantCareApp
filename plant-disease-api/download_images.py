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
