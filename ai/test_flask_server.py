#!/usr/bin/env python3
"""
Simple test to verify Flask server can start
"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5000"])

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Flask server is working!', 'status': 'success'})

@app.route('/crisis-data/info', methods=['GET'])
def crisis_data_info():
    return jsonify({
        'message': 'Crisis data info endpoint working',
        'status': 'success',
        'timestamp': '2024-01-15T12:00:00Z'
    })

@app.route('/crisis-status', methods=['GET'])
def crisis_status():
    return jsonify({
        'message': 'Crisis status endpoint working',
        'status': 'success',
        'timestamp': '2024-01-15T12:00:00Z'
    })

@app.route('/crisis-monitoring/start', methods=['POST'])
def start_monitoring():
    return jsonify({
        'message': 'Crisis monitoring started successfully',
        'status': 'success'
    })

@app.route('/crisis-monitoring/stop', methods=['POST'])
def stop_monitoring():
    return jsonify({
        'message': 'Crisis monitoring stopped successfully',
        'status': 'success'
    })

if __name__ == '__main__':
    print("🚀 Starting simple Flask test server...")
    print("📊 Available endpoints:")
    print("   GET  /test                    - Test endpoint")
    print("   GET  /crisis-data/info        - Crisis data info")
    print("   GET  /crisis-status           - Crisis status")
    print("   POST /crisis-monitoring/start - Start monitoring")
    print("   POST /crisis-monitoring/stop  - Stop monitoring")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
