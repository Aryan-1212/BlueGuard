#!/usr/bin/env python3
"""
Simple test script to test the prediction functionality
Run this after starting the Flask server
"""

import requests
import json

def test_prediction():
    """Test the prediction endpoint with predefined test data"""
    
    # Test data (same as defined in app.py)
    test_data = {
        'timestamp': "2025-05-01 00:00:00",
        'station_id': "STAT034",
        'sea_level_m': 1.529,
        'wave_height_m': 1.222,
        'wind_speed_kmph': 20.415,
        'rainfall_mm': 0.555,
        'sst_celsius': 27.542,
        'chlorophyll_mg_m3': 1.19,
        'turbidity_index': 1.931,
        'sea_level_anomaly_m': 0,
        'storm_surge_risk_index': 0.128,
        'coastal_erosion_risk': 31,
        'algal_bloom_risk_index': 0.311,
        'pollution_risk_index': 34,
        'cyclone_distance_km': 500.71,
        'ai_confidence_score': 0.749,
        'population_exposed': 506000,
        'fisherfolk_activity': 3,
        'infrastructure_exposure_index': 0.422,
        'blue_carbon_loss_ton_co2': 67.955
    }
    
    print("🧪 Testing Coastal Threat Prediction API")
    print("=" * 50)
    
    # Test health endpoint
    try:
        print("🔍 Testing health endpoint...")
        response = requests.get("http://localhost:5000/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return
    
    # Test prediction endpoint
    try:
        print("\n🔮 Testing prediction endpoint...")
        response = requests.post(
            "http://localhost:5000/predict",
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Prediction successful!")
            result = response.json()
            
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
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Prediction error: {e}")
    
    # Test test-prediction endpoint
    try:
        print("\n🧪 Testing test-prediction endpoint...")
        response = requests.get("http://localhost:5000/test-prediction")
        
        if response.status_code == 200:
            print("✅ Test prediction successful!")
            result = response.json()
            
            print("\n📋 TEST PREDICTION RESULTS:")
            print("=" * 50)
            print(json.dumps(result, indent=2, ensure_ascii=False))
            print("=" * 50)
            
        else:
            print(f"❌ Test prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Test prediction error: {e}")

if __name__ == "__main__":
    test_prediction()
