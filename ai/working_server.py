#!/usr/bin/env python3
"""
Simple working Flask server for crisis monitoring
"""

from flask import Flask, jsonify
from flask_cors import CORS
import json
from datetime import datetime

# Create Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5001"])

# Mock crisis data
mock_crisis_data = {
    'timestamp': datetime.now().isoformat(),
    'summary': {
        'total_threats': 3,
        'critical_threats': 1,
        'high_threats': 1,
        'medium_threats': 1,
        'low_threats': 0
    },
    'predictions': {
        'cyclone': True,
        'sea_level': False,
        'algal_bloom': True,
        'erosion': True
    },
    'threat_levels': {
        'cyclone': 'Critical',
        'sea_level': 'Low',
        'algal_bloom': 'High',
        'erosion': 'Medium'
    },
    'probabilities': {
        'cyclone': 85.5,
        'sea_level': 15.2,
        'algal_bloom': 72.8,
        'erosion': 45.3
    },
    'input_data': {
        'station_id': 'COAST-001',
        'sea_level_m': 1.85,
        'wave_height_m': 2.3,
        'wind_speed_kmph': 28.5,
        'rainfall_mm': 45.2,
        'cyclone_distance_km': 150.0
    }
}

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': '🚨 Crisis Monitoring Flask Server is Running!',
        'status': 'success',
        'timestamp': datetime.now().isoformat(),
        'endpoints': [
            'GET  /                    - Home page',
            'GET  /crisis-data/info    - Crisis data info',
            'GET  /crisis-status       - Crisis status',
            'POST /crisis-monitoring/start - Start monitoring',
            'POST /crisis-monitoring/stop  - Stop monitoring'
        ]
    })

@app.route('/crisis-data/info', methods=['GET'])
def crisis_data_info():
    return jsonify({
        'message': 'Crisis data info endpoint working',
        'status': 'success',
        'timestamp': datetime.now().isoformat(),
        'total_rows': 50,
        'columns': [
            'timestamp', 'station_id', 'sea_level_m', 'wave_height_m',
            'wind_speed_kmph', 'rainfall_mm', 'sst_celsius'
        ],
        'sample_data': [
            {'station_id': 'COAST-001', 'sea_level_m': 1.85},
            {'station_id': 'COAST-002', 'sea_level_m': 1.92},
            {'station_id': 'COAST-003', 'sea_level_m': 1.78}
        ]
    })

@app.route('/crisis-status', methods=['GET'])
def crisis_status():
    return jsonify(mock_crisis_data)

@app.route('/crisis-monitoring/start', methods=['POST'])
def start_monitoring():
    return jsonify({
        'message': 'Crisis monitoring started successfully',
        'status': 'success',
        'timestamp': datetime.now().isoformat(),
        'data_rows_available': 50
    })

@app.route('/crisis-monitoring/stop', methods=['POST'])
def stop_monitoring():
    return jsonify({
        'message': 'Crisis monitoring stopped successfully',
        'status': 'success',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'message': 'Crisis monitoring server is running'
    })

if __name__ == '__main__':
    print("🚀 Starting Crisis Monitoring Flask Server on port 5001...")
    print("📊 Available endpoints:")
    print("   GET  /                    - Home page")
    print("   GET  /health              - Health check")
    print("   GET  /crisis-data/info    - Crisis data info")
    print("   GET  /crisis-status       - Crisis status")
    print("   POST /crisis-monitoring/start - Start monitoring")
    print("   POST /crisis-monitoring/stop  - Stop monitoring")
    print("\n🌐 Server will be available at: http://localhost:5001")
    
    try:
        app.run(
            host='0.0.0.0',
            port=5001,
            debug=True,
            use_reloader=False  # Disable reloader to avoid duplicate processes
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Try using a different port or check if port 5001 is available")
