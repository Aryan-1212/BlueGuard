#!/usr/bin/env python3
"""
Simple HTTP server for crisis monitoring testing
"""

import json
import http.server
import socketserver
from datetime import datetime
from urllib.parse import urlparse, parse_qs

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

class CrisisMonitoringHandler(http.server.BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers()
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/':
            response = {
                'message': '🚨 Crisis Monitoring HTTP Server is Running!',
                'status': 'success',
                'timestamp': datetime.now().isoformat(),
                'endpoints': [
                    'GET  /                    - Home page',
                    'GET  /crisis-data/info    - Crisis data info',
                    'GET  /crisis-status       - Crisis status',
                    'POST /crisis-monitoring/start - Start monitoring',
                    'POST /crisis-monitoring/stop  - Stop monitoring'
                ]
            }
        elif path == '/crisis-data/info':
            response = {
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
            }
        elif path == '/crisis-status':
            response = mock_crisis_data
        elif path == '/health':
            response = {
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'message': 'Crisis monitoring server is running'
            }
        else:
            response = {
                'error': 'Endpoint not found',
                'path': path,
                'available_endpoints': ['/', '/crisis-data/info', '/crisis-status', '/health']
            }
            self._set_headers(404)
            self.wfile.write(json.dumps(response).encode())
            return
        
        self._set_headers()
        self.wfile.write(json.dumps(response, indent=2).encode())
    
    def do_POST(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/crisis-monitoring/start':
            response = {
                'message': 'Crisis monitoring started successfully',
                'status': 'success',
                'timestamp': datetime.now().isoformat(),
                'data_rows_available': 50
            }
        elif path == '/crisis-monitoring/stop':
            response = {
                'message': 'Crisis monitoring stopped successfully',
                'status': 'success',
                'timestamp': datetime.now().isoformat()
            }
        else:
            response = {
                'error': 'Endpoint not found',
                'path': path,
                'available_endpoints': ['/crisis-monitoring/start', '/crisis-monitoring/stop']
            }
            self._set_headers(404)
            self.wfile.write(json.dumps(response).encode())
            return
        
        self._set_headers()
        self.wfile.write(json.dumps(response, indent=2).encode())

if __name__ == '__main__':
    PORT = 5001
    
    print(f"🚀 Starting Crisis Monitoring HTTP Server on port {PORT}...")
    print("📊 Available endpoints:")
    print("   GET  /                    - Home page")
    print("   GET  /health              - Health check")
    print("   GET  /crisis-data/info    - Crisis data info")
    print("   GET  /crisis-status       - Crisis status")
    print("   POST /crisis-monitoring/start - Start monitoring")
    print("   POST /crisis-monitoring/stop  - Stop monitoring")
    print(f"\n🌐 Server will be available at: http://localhost:{PORT}")
    
    try:
        with socketserver.TCPServer(("", PORT), CrisisMonitoringHandler) as httpd:
            print(f"✅ Server started successfully on port {PORT}")
            print("🔄 Press Ctrl+C to stop the server")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Try using a different port or check if port 5001 is available")
