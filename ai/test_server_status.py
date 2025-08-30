import requests
import json

def test_server_endpoints():
    """Test various server endpoints to check status"""
    base_url = "http://localhost:5000"
    
    endpoints = [
        "/health",
        "/crisis-data/info", 
        "/crisis-status",
        "/model-info"
    ]
    
    for endpoint in endpoints:
        try:
            print(f"\n🔍 Testing endpoint: {endpoint}")
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    if endpoint == "/crisis-data/info":
                        print(f"   Crisis data rows: {data.get('total_rows', 'N/A')}")
                        print(f"   Columns: {len(data.get('columns', []))}")
                    elif endpoint == "/crisis-status":
                        print(f"   Crisis status available: {'timestamp' in data}")
                    elif endpoint == "/model-info":
                        print(f"   Models loaded: {len(data.get('models_loaded', []))}")
                    elif endpoint == "/health":
                        print(f"   Server status: {data.get('status', 'N/A')}")
                except json.JSONDecodeError:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"   Error response: {response.text[:100]}...")
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ Connection refused - server not running")
        except requests.exceptions.Timeout:
            print(f"   ⏰ Timeout - server not responding")
        except Exception as e:
            print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    print("🧪 Testing Flask server endpoints...")
    test_server_endpoints()
