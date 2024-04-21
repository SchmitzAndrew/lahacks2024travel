from typing import List
from dotenv import load_dotenv
import os
import googlemaps
import google.generativeai as genai
from elevenlabs.client import ElevenLabs
from elevenlabs import save
import json
import requests
import bs4
import base64
import wikipedia


load_dotenv()

google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")
elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")

if(google_maps_api_key is None or gemini_api_key is None or elevenlabs_api_key is None):
    raise ValueError("API Key for Python backend missing")

# Initialize API Clients
gmaps = googlemaps.Client(key=google_maps_api_key)

genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-1.5-pro-latest')


elevenlabs_client = ElevenLabs(
  api_key=elevenlabs_api_key
)

def get_location_details(address):
    """Retrieve basic location details including formatted address, latitude, and longitude."""
    geocode_result = gmaps.geocode(address)
    if not geocode_result:
        return "No results found."
    
    result = geocode_result[0]
    location_details = {
        'address': result.get('formatted_address'),
        'latitude': result['geometry']['location']['lat'],
        'longitude': result['geometry']['location']['lng']
    }
    return location_details

def get_top_attractions(address=None, latitude=None, longitude=None, num_places=10, radius=10000):
    """Retrieve details for the top n attractions near a specified address."""

    if latitude is None or longitude is None:
        if address is None:
            return 'Failed to get destinations'
        geocode_result = gmaps.geocode(address)
        location = geocode_result[0]['geometry']['location']
        latitude = location['lat']
        longitude = location['lng']
    else:
        geocode_result = gmaps.reverse_geocode((latitude, longitude))

    places_result = gmaps.places_nearby(
        location=(latitude, longitude),
        radius=radius,  # radius in meters, increased to cover more potential attractions
        type='tourist_attraction',
        rank_by='prominence'  # Sort by prominence which considers rating, relevance, and location
    )
    
    # Extract the top n attractions, focusing on the most relevant details
    attractions_info = []
    destinations = []
    for place in places_result.get('results', [])[:num_places]:  # Collect destinations for Distance Matrix API
        if 'geometry' in place:
            lat_lng = place['geometry']['location']
            destinations.append((lat_lng['lat'], lat_lng['lng']))
    print(latitude, longitude)
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
        city = place['vicinity'].split(', ')[-1]
        place_location = place['geometry']['location']
        print(place)
        attraction_details = {
            'name': place.get('name'),
            'type': ', '.join(place.get('types', ['Not specified'])),
            'rating': place.get('rating', 'No rating'),
            'address': place.get('vicinity'),
            'city': city,
            'distance': distance,
            'image_url': photo_url,
            'latitude': place_location['lat'],
            'longitude': place_location['lng']
        }
        attractions_info.append(attraction_details)
    print('test')
    return attractions_info


def get_top_attractions_gemini(address=None, latitude=None, longitude=None, num_places=10, radius=10000):
    """Retrieve details for the top n attractions near a specified address."""

    if latitude is None or longitude is None:
        if address is None:
            return 'Failed to get destinations'
        geocode_result = gmaps.geocode(address)
        location = geocode_result[0]['geometry']['location']
        latitude = location['lat']
        longitude = location['lng']
    else:
        geocode_result = gmaps.reverse_geocode((latitude, longitude))

    places_result = gmaps.places_nearby(
        location=(latitude, longitude),
        radius=radius,  # radius in meters, increased to cover more potential attractions
        type='tourist_attraction',
        rank_by='prominence'  # Sort by prominence which considers rating, relevance, and location
    )
    
    # Extract the top n attractions, focusing on the most relevant details
    attractions_info = []
    destinations = []
    for place in places_result.get('results', [])[:num_places]:  # Collect destinations for Distance Matrix API
        if 'geometry' in place:
            lat_lng = place['geometry']['location']
            destinations.append((lat_lng['lat'], lat_lng['lng']))
    print(latitude, longitude)
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
        city = place['vicinity'].split(', ')[-1]
        place_location = place['geometry']['location']
        print(place)
        attraction_details = {
            'name': place.get('name'),
            'type': ', '.join(place.get('types', ['Not specified'])),
            'rating': place.get('rating', 'No rating'),
            'address': place.get('vicinity'),
            'city': city,
            'distance': distance,
            'image_url': photo_url,
            'latitude': place_location['lat'],
            'longitude': place_location['lng']
        }
        attractions_info.append(attraction_details)
    print('test')
    return attractions_info


def get_directions(attractions_info):
    print("\n\n")

    place_ids = []
    for attraction in attractions_info:
        place_ids.insert(-1, attraction['place_id'])

    # Convert Place IDs to strings
    locations = ['place_id:' + place_id for place_id in place_ids]

    # Request directions
    directions = gmaps.directions(
        origin=locations[0],
        destination=locations[-1],
        waypoints=locations[1:-1],  # Exclude origin and destination from waypoints
        optimize_waypoints=True,    # Optimize the order of waypoints for the shortest route
        mode="driving"              # Travel mode (driving, walking, bicycling, transit)
    )

    # Extract route information
    best_route = directions[0]['legs']

    # Print route details
    for step in best_route:
        print(step['start_address'], 'to', step['end_address'], ':', step['distance']['text'], '-', step['duration']['text'])


def get_gemini_result(prompt: str):
    return model.generate_content(prompt).text

def process_gemini_json(gemini_json: str) -> object:
    return json.loads(gemini_json.replace('```', '').replace('json', ''))

# Gets the body text of the relevant wikipedia article
def scrape_place_wikipedia(place: str) -> str:
    place_page = wikipedia.page(place)
    return f'The following is a wikipedia article on {place_page.title}: \n {place_page.content}'


def get_proompt(places: List[object]) -> str:
    proompt = ''
    with open('proompt.txt', 'r') as proompt_base_file:
        proompt_base = proompt_base_file.read()
    
    proompt += proompt_base

    # Demonstrate JSON formatting
    proompt += r'{'
    proompt += 'success: true,'
    proompt += 'content: ['
    for place in places:
        place_id = place['id']
        place_name = place['name']
        proompt += '{'
        proompt += f'"id": {place_id}, "name": {place_name}, "description": "generated description goes here"'
        proompt += '}'
    proompt = proompt[:-1] # Remove trailing comma
    proompt += ']'
    proompt += r'}'

    proompt += "The following are the relevant locations in order:\n"
    place_names = [place['name'] for place in places]
    # Add all places to proompt in order
    for place_name in place_names:
        proompt += place_name + '\n'
    
    proompt += 'The following are wikipedia articles that may contain relevant information:\n'
    
    for place in places:
        place_name = place['name']
        proompt += scrape_place_wikipedia(place_name)
    return proompt


def scrape_website(url: str) -> str:
    response = requests.get(url,headers={'User-Agent': 'Mozilla/5.0'})
    if not response.ok:
        return ''
    soup = bs4.BeautifulSoup(response.text,'lxml')

    return soup.body.get_text(' ', strip=True)


def text_to_speech_base64(text: str)->str:
    audio = elevenlabs_client.generate(
        text=text,
        voice="Daniel",
        model="eleven_multilingual_v2"
        )
    
    if not os.path.exists('./temp/'):
        os.makedirs('./temp')
    
    save(audio, "./temp/temp.mp3")

    enc = str(base64.b64encode(open("temp/temp.mp3", "rb").read()))[2:][:-1]
    return str(enc)



#process_gemini_json(get_gemini_result(r'What is the meaning of life? respond using this JSON schema: {"meanings":[meaning1, meaning2, meaning3]}'))
#print(scrape_website('https://en.wikipedia.org/wiki/University_of_California,_Los_Angeles'))

"""

print(google_maps_api_key)
print(gemini_api_key)

response = model.generate_content(r'What is the meaning of life? respond using this JSON schema: {"meanings":[meaning1, meaning2, meaning3]}')
print(response.text)"""