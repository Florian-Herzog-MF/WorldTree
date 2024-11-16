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
    obj_type = request.args.get('type')
    try:
        skip = int(request.args.get('skip', 0))
        amount = int(request.args.get('amount', 5))
    except ValueError:
        return jsonify({"error": "Invalid input, 'skip' and 'amount' should be integers."}), 400

    world_objects = wm.get_world_object_page(skip, amount, obj_type)
    if world_objects is None:
        return jsonify({"error": "Could not fetch world objects."}), 500

    return jsonify(world_objects)

@app.route('/api/v1/world-objects/search', methods=['GET'])
def search_world_objects():
    prompt = request.args.get('prompt')
    obj_type = request.args.get('type')
    try:
        amount = int(request.args.get('amount', 5))
    except ValueError:
        return jsonify({"error": "Invalid input, 'amount' should be an integer."}), 400

    world_objects = wm.world_object_search(prompt, obj_type, amount)
    if world_objects is None:
        return jsonify({"error": "Could not search world objects."}), 500
    
    return jsonify(world_objects)


@app.route('/api/v1/world-objects/<id>', methods=['GET'])
def get_world_object_by_id(id):
    world_object = wm.get_world_object_by_id(id)
    if world_object is None:
        return jsonify({"error": "World object not found."}), 404

    return jsonify(world_object)


@app.route('/api/v1/source/<id>', methods=['GET'])
def get_source_by_id(id):
    source = wm.get_world_object_by_id(id)
    if source is None:
        return jsonify({"error": "Source not found."}), 404

    return jsonify(source)


@app.route('/api/v1/source/generate', methods=['POST'])
def generate_source():
    prompt = request.json.get('prompt')
    try:
        amount = int(request.json.get('amount', 5))
    except ValueError:
        return jsonify({"error": "Invalid input, 'amount' should be an integer."}), 400

    source = wm.generate_world_object_source_in_context(prompt, amount)
    if source is None:
        return jsonify({"error": "Could not generate source."}), 500

    return jsonify(source)


@app.route('/api/v1/world-objects/generate', methods=['POST'])
def generate_world_objects():
    data = request.json
    
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400
    
    source = data.get("source")
    wo_ids = data.get("wo_ids")

    if not source or not isinstance(source, str):
        return jsonify({"error": "'source' must be a non-empty string"}), 400

    if not isinstance(wo_ids, list):
        return jsonify({"error": "'wo_ids' must be a list of IDs"}), 400

    world_objects = wm.generate_world_objects_from_source(source, wo_ids)
    
    if world_objects is None:
        return jsonify({"error": "Could not generate world objects"}), 500

    print(world_objects)
    return jsonify(world_objects)


@app.route('/api/v1/world-object/persist', methods=['POST'])
def persist_world_object():
    world_object = request.json.get("world_object")
    if not world_object:
        return jsonify({"error": "Missing 'world_object' in request body"}), 400
    
    source_id = request.json.get("source_id")
    if not source_id:
        return jsonify({"error": "Missing 'source_id' in request body"}), 400

    result = wm.persist_world_object(world_object, source_id)
    if not result:
        return jsonify({"error": "Could not persist world object."}), 500

    return {"id": result}


@app.route('/api/v1/source/persist', methods=['POST'])
def persist_source():
    source = request.json.get("source")
    if not source:
        return jsonify({"error": "Missing 'source' in request body"}), 400

    result = wm.persist_source(source)
    if not result:
        return jsonify({"error": "Could not persist source."}), 500

    return {"id": result}


if __name__ == '__main__':
    app.run(debug=True, port=5001)