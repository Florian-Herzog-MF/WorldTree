import os
from flask import Flask, jsonify, request

from src.llm_client import LLMClient

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to my Flask app!"

@app.route('/api/v1/world-objects', methods=['GET'])
def get_world_objects():
    type = request.args.get('type')
    skip = request.args.get('amount')
    amount = request.args.get('amount')
    data = {
        "data": [1, 2, 3, 4, 5],
        "limit": 500,
    }
    return jsonify(data)

@app.route('/api/v1/world-objects/search', methods=['GET'])
def search_world_objects():
    prompt = request.args.get('prompt')
    type = request.args.get('type')
    amount = request.args.get('amount')
    data = {
        "message": "Here is some data",
        "data": [1, 2, 3, 4, 5, prompt, type, amount]
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
    app.run(debug=True, port=5001)