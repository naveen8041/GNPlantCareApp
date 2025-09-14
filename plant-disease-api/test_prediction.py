import requests

# Change this to your Flask API endpoint
API_URL = 'http://127.0.0.1:5000/predict'

# Path to test image
TEST_IMAGE_PATH = 'test_guava.jpg'  # Change to your test image file

with open(TEST_IMAGE_PATH, 'rb') as img_file:
    files = {'file': img_file}
    response = requests.post(API_URL, files=files)
    print('Status code:', response.status_code)
    print('Response:', response.json())
