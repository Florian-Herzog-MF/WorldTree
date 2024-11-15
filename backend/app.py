import os
from flask import Flask, jsonify, request

from src.world_manager import WorldManager

app = Flask(__name__)
wm = WorldManager(os.getenv("PROJECT_NAME"))

@app.route('/')
def home():
    return "Welcome to my Flask app!"

@app.route('/api/v1/world-objects', methods=['GET'])
def get_world_objects():
    type = request.args.get('type')
    skip = request.args.get('skip')
    amount = request.args.get('amount')
    
    world_objects = wm.get_world_object_page(skip, amount, type)
    return jsonify(world_objects)

@app.route('/api/v1/world-objects/search', methods=['GET'])
def search_world_objects():
    prompt = request.args.get('prompt')
    type = request.args.get('type')
    amount = request.args.get('amount')

    world_objects = wm.world_object_search(prompt, type, amount)
    return jsonify(world_objects)

@app.route('/api/v1/world-objects/<id>', methods=['GET'])
def get_world_object_by_id(id):
    world_object = wm.get_world_object_by_id(id)
    return jsonify(world_object)

@app.route('/api/v1/source/<id>', methods=['GET'])
def get_source_by_id(id):
    world_object = wm.get_world_object_by_id(id)
    return jsonify(world_object)

if __name__ == '__main__':
    app.run(debug=True, port=5001)