#!/usr/bin/env python3
"""
Test script for the Coastal Threat Prediction Flask API
Run this script to test all API endpoints
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_model_info():
    """Test the model info endpoint"""
    print("\n🔍 Testing Model Info...")
    try:
        response = requests.get(f"{BASE_URL}/model-info")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_threat_report():
    """Test the threat report endpoint"""
    print("\n🔍 Testing Threat Report...")
    try:
        response = requests.get(f"{BASE_URL}/threat-report")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_forecast():
    """Test the forecast endpoint"""
    print("\n🔍 Testing Forecast...")
    try:
        response = requests.get(f"{BASE_URL}/forecast")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_prediction():
    """Test the prediction endpoint with sample data"""
    print("\n🔍 Testing Prediction...")
    
    # Sample input data
    sample_data = {
        "sea_level_m": 1.8,
        "wave_height_m": 2.5,
        "wind_speed_kmph": 45,
        "rainfall_mm": 12.5,
        "sst_celsius": 28.5,
        "chlorophyll_mg_m3": 0.8,
        "turbidity_index": 0.6,
        "sea_level_anomaly_m": 0.4,
        "storm_surge_risk_index": 0.7,
        "coastal_erosion_risk": 0.5,
        "algal_bloom_risk_index": 0.6,
        "pollution_risk_index": 0.4,
        "cyclone_distance_km": 120,
        "ai_confidence_score": 0.85,
        "population_exposed": 50000,
        "fisherfolk_activity": 0.8,
        "infrastructure_exposure_index": 0.6,
        "blue_carbon_loss_ton_co2": 75.0
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json=sample_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_minimal_prediction():
    """Test prediction with minimal data"""
    print("\n🔍 Testing Minimal Prediction...")
    
    # Minimal input data (only essential fields)
    minimal_data = {
        "sea_level_m": 1.5,
        "cyclone_distance_km": 200
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json=minimal_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting API Tests for Coastal Threat Prediction System")
    print("=" * 60)
    
    # Wait a bit for the server to be ready
    print("⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    tests = [
        ("Health Check", test_health_check),
        ("Model Info", test_model_info),
        ("Threat Report", test_threat_report),
        ("Forecast", test_forecast),
        ("Full Prediction", test_prediction),
        ("Minimal Prediction", test_minimal_prediction)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        success = test_func()
        results.append((test_name, success))
        print(f"{'✅ PASS' if success else '❌ FAIL'}: {test_name}")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the server logs for details.")

if __name__ == "__main__":
    main()
