from flask import Flask, jsonify, request
from utils import get_top_attractions
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@cross_origin()
@app.route('/places', methods=['GET'])
def get_places():
    latitude = request.args.get('lat')
    longitude = request.args.get('long')
    num_places = int(request.args.get('num_places'))
    radius = int(request.args.get('radius'))
    print(latitude, longitude)
    attractions = get_top_attractions(latitude, longitude, num_places, radius)

    success = True
    places = []
    for i, attraction in enumerate(attractions):
        attraction_details = dict()
        attraction_details['id'] = i
        attraction_details['name'] = attraction['name']
        attraction_details['description'] = 'Placeholder description'
        attraction_details['image_url'] = attraction['image_url']
        places.append(attraction_details)
    result = dict()
    result['success'] = success
    result['places'] = places
    return jsonify(result)

@cross_origin()
@app.route('/placedescriptions', methods=['POST'])
def get_place_descriptions():
    latitude = request.args.get('lat')
    longitude = request.args.get('long')
    print(latitude, longitude)
    attractions = get_top_attractions(latitude, longitude)

    success = True
    places = []
    for i, attraction in enumerate(attractions):
        attraction_details = dict()
        attraction_details['id'] = i
        attraction_details['name'] = attraction['name']
        attraction_details['description'] = 'Placeholder description'
        attraction_details['image_url'] = attraction['image_url']
        places.append(attraction_details)
    result = dict()
    result['success'] = success
    result['places'] = places
    return jsonify(result)

print('test')
if __name__ == '__main__':
   app.run(port=3002, debug=True)