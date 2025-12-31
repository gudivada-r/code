
import requests
import json

REMOTE_URL = "https://student-success-backend-cnya.onrender.com/api/auth/login"
LOCAL_URL = "http://localhost:8000/api/auth/login"

CREDENTIALS = {
    "username": "student@university.edu",
    "password": "student123"
}

def test_login(url, name):
    print(f"Testing {name} Login...")
    try:
        response = requests.post(url, data=CREDENTIALS)
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {response.json()}")
        except:
            print(f"Response Text: {response.text}")
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    test_login(LOCAL_URL, "LOCAL")
    print("-" * 20)
    test_login(REMOTE_URL, "REMOTE")
