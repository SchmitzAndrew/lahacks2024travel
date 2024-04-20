from flask import Flask, jsonify, request
from utils import get_top_attractions
app = Flask(__name__)

@app.route('/places', methods=['GET'])
def get_places():
    latitude = request.args.get('lat')
    longitude = request.args.get('long')
    print(latitude, longitude)
    attractions = get_top_attractions(latitude, longitude)

    success = True
    places = []
    for attraction in attractions:
        attraction_details = dict()
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