from dotenv import load_dotenv
import os
import googlemaps
import google.generativeai as genai

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

def get_top_attractions(latitude, longitude, num_places=10, radius=10000):
    """Retrieve details for the top 10 attractions near a specified address."""
    places_result = gmaps.places_nearby(
        location=(latitude, longitude),
        radius=radius,  # radius in meters, increased to cover more potential attractions
        type='tourist_attraction',
        rank_by='prominence'  # Sort by prominence which considers rating, relevance, and location
    )
    
    # Extract the top 10 attractions, focusing on the most relevant details
    attractions_info = []
    destinations = []
    for place in places_result.get('results', [])[:num_places]:  # Collect destinations for Distance Matrix API
        if 'geometry' in place:
            lat_lng = place['geometry']['location']
            destinations.append((lat_lng['lat'], lat_lng['lng']))

    # Get distances from origin to each destination
    if destinations:
        distances_result = gmaps.distance_matrix(origins=[(latitude, longitude)], destinations=destinations, mode='driving')
        distances_info = distances_result.get('rows')[0]['elements']
    else:
        return 'Failed to get destinations'

    for i, place in enumerate(places_result.get('results', [])[:num_places]):
        photo_reference = place['photos'][0]['photo_reference'] if 'photos' in place and place['photos'] else None
        photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={google_maps_api_key}" if photo_reference else "No image available"
        distance = distances_info[i]['distance']['text'] if distances_info[i]['status'] == 'OK' else "Distance not available"
        
        attraction_details = {
            'name': place.get('name'),
            'type': ', '.join(place.get('types', ['Not specified'])),
            'rating': place.get('rating', 'No rating'),
            'address': place.get('vicinity'),
            'distance': distance,
            'image_url': photo_url
        }
        attractions_info.append(attraction_details)
    
    return attractions_info

google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")

def get_places(num_places: int):
    
    pass
"""
genai.configure(api_key=gemini_api_key)
print(google_maps_api_key)
print(gemini_api_key)
model = genai.GenerativeModel('gemini-1.5-pro-latest')
response = model.generate_content(r'What is the meaning of life? respond using this JSON schema: {"meanings":[meaning1, meaning2, meaning3]}')
print(response.text)"""