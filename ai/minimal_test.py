#!/usr/bin/env python3
"""
Minimal Flask test to verify basic functionality
"""

from flask import Flask, jsonify
from flask_cors import CORS

# Create Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5001"])

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Flask server is working!', 'status': 'success'})

@app.route('/crisis-data/info', methods=['GET'])
def crisis_data_info():
    return jsonify({
        'message': 'Crisis data info endpoint working',
        'status': 'success',
        'timestamp': '2024-01-15T12:00:00Z',
        'total_rows': 50,
        'columns': ['timestamp', 'station_id', 'sea_level_m', 'wave_height_m']
    })

@app.route('/crisis-status', methods=['GET'])
def crisis_status():
    return jsonify({
        'message': 'Crisis status endpoint working',
        'status': 'success',
        'timestamp': '2024-01-15T12:00:00Z',
        'summary': {
            'total_threats': 2,
            'critical_threats': 0,
            'high_threats': 1,
            'medium_threats': 1,
            'low_threats': 0
        }
    })

@app.route('/crisis-monitoring/start', methods=['POST'])
def start_monitoring():
    return jsonify({
        'message': 'Crisis monitoring started successfully',
        'status': 'success',
        'timestamp': '2024-01-15T12:00:00Z'
    })

@app.route('/crisis-monitoring/stop', methods=['POST'])
def stop_monitoring():
    return jsonify({
        'message': 'Crisis monitoring stopped successfully',
        'status': 'success',
        'timestamp': '2024-01-15T12:00:00Z'
    })

if __name__ == '__main__':
    print("🚀 Starting minimal Flask test server on port 5001...")
    print("📊 Available endpoints:")
    print("   GET  /                    - Home page")
    print("   GET  /crisis-data/info    - Crisis data info")
    print("   GET  /crisis-status       - Crisis status")
    print("   POST /crisis-monitoring/start - Start monitoring")
    print("   POST /crisis-monitoring/stop  - Stop monitoring")
    
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True
    )
