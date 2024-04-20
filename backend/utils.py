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

def get_top_attractions(address):
    """Retrieve details for the top 10 attractions near a specified address."""
    location_details = get_location_details(address)
    if isinstance(location_details, str):
        return location_details  # Return the error message if no results found
    
    # Use nearby search to find attractions around the given address
    latitude = location_details['latitude']
    longitude = location_details['longitude']
    places_result = gmaps.places_nearby(
        location=(latitude, longitude),
        radius=10000,  # radius in meters, increased to cover more potential attractions
        type='tourist_attraction',
        rank_by='prominence'  # Sort by prominence which considers rating, relevance, and location
    )
    
    # Extract the top 10 attractions, focusing on the most relevant details
    attractions_info = []
    for place in places_result.get('results', [])[:num]:  # Limit to top 10 results
        attraction_details = {
            'name': place.get('name'),
            'type': ', '.join(place.get('types', ['Not specified'])),
            'rating': place.get('rating', 'No rating'),
            'address': place.get('vicinity')
        }
        attractions_info.append(attraction_details)
    
    return attractions_info

# Get input from the user
address = input("Please enter the address or location: ")
num = int(input("How many attractions: "))

# Retrieve and print attractions information
attractions_info = get_top_attractions(address)
if isinstance(attractions_info, list):
    print(f"\nTop {num} Attractions:")
    for attraction in attractions_info:
        print(f"{attraction['name']} - Rating: {attraction['rating']} - Address: {attraction['address']}")
else:
    print(attractions_info)


from dotenv import load_dotenv
load_dotenv()
import os
import google.generativeai as genai


google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")

def get_places(num_places: int):
    
    pass

genai.configure(api_key=gemini_api_key)
print(google_maps_api_key)
print(gemini_api_key)
model = genai.GenerativeModel('gemini-1.5-pro-latest')
response = model.generate_content(r'What is the meaning of life? respond using this JSON schema: {"meanings":[meaning1, meaning2, meaning3]}')
print(response.text)