from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5000"])

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Flask is working!', 'status': 'success'})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'message': 'Minimal Flask app is running'})

if __name__ == '__main__':
    print("🚀 Starting minimal Flask test server...")
    app.run(host='0.0.0.0', port=5001, debug=True)
