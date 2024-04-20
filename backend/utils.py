from dotenv import load_dotenv
import os
import googlemaps

# Load environment variables
load_dotenv()

# Retrieve the API key from the environment
google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

# Initialize the Google Maps client with your API key
gmaps = googlemaps.Client(key=google_maps_api_key)

def get_location_details(address):
    """Retrieve basic location details including formatted address, latitude, and longitude."""
    geocode_result = gmaps.geocode(address)
    if not geocode_result:
        return "No results found."
    
    result = geocode_result[0]
    location_details = {
        'address': result.get('formatted_address'),
        'latitude': result['geometry']['location']['lat'],
        'longitude': result['geometry']['location']['lng'],
    }
    return location_details

def get_places(address, num_places):
    """Retrieve details for a number of places near a specified address."""
    # First get the location details of the given address
    location_details = get_location_details(address)
    if isinstance(location_details, str):
        return location_details  # Return the error message if no results found
    
    # Use nearby search to find places around the given address
    latitude = location_details['latitude']
    longitude = location_details['longitude']
    places_result = gmaps.places_nearby(location=(latitude, longitude), radius=500)  # radius in meters
    
    # Limit the number of places to the requested number
    places_info = []
    for place in places_result.get('results', [])[:num_places]:
        place_details = {
            'name': place.get('name'),
            'type': place.get('types')[0] if place.get('types') else 'Not specified',
            'rating': place.get('rating', 'No rating'),
        }
        places_info.append(place_details)
    
    return places_info

# Get input from the user
address = input("Please enter the address or location: ")
num_places = int(input("How many nearby places would you like to list? "))

# Retrieve and print places information
places_info = get_places(address, num_places)
for place in places_info:
    print(place)
