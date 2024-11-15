from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to my Flask app!"

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        "message": "Here is some data",
        "data": [1, 2, 3, 4, 5]
    }
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def post_data():
    new_data = request.json
    response = {
        "message": "Data received",
        "received_data": new_data
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)