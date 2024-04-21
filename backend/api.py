from flask import Flask, jsonify, request, current_app
from utils import get_top_attractions, get_gemini_result, text_to_speech_base64, get_proompt, process_gemini_json
from flask_cors import CORS, cross_origin
import concurrent.futures
import os
import googlemaps.exceptions

app = Flask(__name__)
CORS(app)

@cross_origin()
@app.route('/places', methods=['GET'])
def get_places():
    latitude = request.args.get('lat')
    longitude = request.args.get('long')
    address = request.args.get('address')
    
    num_places = int(request.args.get('num_places'))
    radius = int(request.args.get('radius'))

    attractions = get_top_attractions(address, latitude, longitude, num_places, radius)


    success = True
    places = []
    for i, attraction in enumerate(attractions):
        attraction_details = dict()
        attraction_details['id'] = i
        attraction_details['name'] = attraction['name']
        attraction_details['description'] = 'Placeholder description'
        attraction_details['image_url'] = attraction['image_url']
        attraction_details['latitude'] = float(attraction['latitude'])
        attraction_details['longitude'] = float(attraction['longitude'])
        attraction_details['city'] = attraction['city']
        places.append(attraction_details)
    result = dict()
    result['success'] = success
    result['places'] = places
    return jsonify(result)

def get_description_obj(place):
        id = place['id']
        name = place['name']
        description = get_gemini_result(f"Create a description for the following place in plain text without markdown or extra newlines: {name}")
        return id, description
    
@cross_origin()
@app.route('/placedescriptions', methods=['POST'])
def get_place_descriptions():
    places = request.json['places']

    success = True
    descriptions = []

    # Ask Gemini for descriptions of each place in parallel
    with concurrent.futures.ProcessPoolExecutor() as executor:
        results = executor.map(get_description_obj, places)

        for id, description in results:
            description_obj = {'id': id, 'description': description}
            descriptions.append(description_obj)

    result = dict()
    result['success'] = success
    result['descriptions'] = descriptions
    
    return jsonify(result)


@cross_origin()
@app.route('/placedescriptionsv2', methods=['POST'])
def get_place_descriptionsv2():
    places = request.json['places']

    prompt = get_proompt(places)
    result = process_gemini_json(get_gemini_result(prompt))
    return jsonify(result)


@cross_origin()
@app.route('/generatetts', methods=['POST'])
def generate_tts():
    text = request.json['text']

    success = True
    base64_speech = text_to_speech_base64(text)
    
    result = {'success': success, 'content': base64_speech}
    
    return jsonify(result)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000)) 
    app.run(host='0.0.0.0', port=port, debug=bool(os.environ.get('BACKEND_DEBUG', True)))
