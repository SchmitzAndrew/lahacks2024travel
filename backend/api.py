from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/places', methods=['GET'])
def get_places():
 return jsonify('test')

print('test')
if __name__ == '__main__':
   app.run(port=5000)