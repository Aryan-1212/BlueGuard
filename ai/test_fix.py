#!/usr/bin/env python3
"""
Test script to verify the scaler issue is fixed
"""

import requests
import json
import time

def test_health_and_prediction():
    """Test health endpoint and prediction functionality"""
    
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Fixed Coastal Threat Prediction API")
    print("=" * 60)
    
    # Test health endpoint
    try:
        print("🔍 Testing health endpoint...")
        response = requests.get(f"{base_url}/health")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Health check response:")
            print(json.dumps(health_data, indent=2))
            
            # Check model readiness
            if health_data.get('model_ready', False):
                print("✅ Model is ready for predictions")
            else:
                print("⚠️ Model is not ready: " + health_data.get('message', 'Unknown'))
                return
        else:
            print(f"❌ Health check failed: {response.status_code}")
            print(f"Response: {response.text}")
            return
            
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return
    
    # Wait a bit for any background processing
    print("\n⏳ Waiting for model to be ready...")
    time.sleep(3)
    
    # Test prediction endpoint
    try:
        print("\n🔮 Testing prediction endpoint...")
        
        # Simple test data
        test_data = {
            'sea_level_m': 1.5,
            'cyclone_distance_km': 200
        }
        
        response = requests.post(
            f"{base_url}/predict",
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Prediction successful!")
            print("\n📋 PREDICTION RESULTS:")
            print("=" * 50)
            print(json.dumps(result, indent=2, ensure_ascii=False))
            print("=" * 50)
            
            # Print summary
            print("\n📊 THREAT SUMMARY:")
            for threat_name in result['predictions'].keys():
                pred = result['predictions'][threat_name]
                prob = result['probabilities'][threat_name]
                level = result['threat_levels'][threat_name]
                status = "⚠️ THREAT" if pred else "✅ SAFE"
                print(f"   {threat_name.replace('_', ' ').title()}: {level} ({prob:.1f}%) - {status}")
                
        else:
            print(f"❌ Prediction failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Prediction error: {e}")
    
    # Test the test-prediction endpoint
    try:
        print("\n🧪 Testing test-prediction endpoint...")
        response = requests.get(f"{base_url}/test-prediction")
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Test prediction successful!")
        else:
            print(f"❌ Test prediction failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Test prediction error: {e}")

if __name__ == "__main__":
    test_health_and_prediction()
