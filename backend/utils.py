from dotenv import load_dotenv
load_dotenv()
import os


google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
def get_places(num_places: int):
    
    pass

print(google_maps_api_key)