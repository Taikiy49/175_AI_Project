from flask import Flask, request, jsonify
from flask_cors import CORS
from minimax_ai import best_move_minimax

app = Flask(__name__)
CORS(app)

@app.route('/api/next-move', methods=['POST'])
def next_move():
    data = request.get_json()
    state = data.get('state')  # e.g. "X-OX--O--"
    move = best_move_minimax(state)
    if move is None:
        return jsonify({'error': 'No move available'}), 400
    return jsonify({'move': move})

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
