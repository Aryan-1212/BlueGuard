import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all required modules can be imported"""
    try:
        print("🔍 Testing imports...")
        
        import pandas as pd
        print("✅ pandas imported successfully")
        
        import numpy as np
        print("✅ numpy imported successfully")
        
        from flask import Flask
        print("✅ Flask imported successfully")
        
        from flask_cors import CORS
        print("✅ Flask-CORS imported successfully")
        
        from model import CoastalThreatPredictor
        print("✅ CoastalThreatPredictor imported successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_crisis_data_loading():
    """Test crisis data loading independently"""
    try:
        print("\n🔍 Testing crisis data loading...")
        
        import pandas as pd
        excel_file = "testing_api_data.xlsx"
        
        if os.path.exists(excel_file):
            print(f"✅ Excel file exists: {excel_file}")
            crisis_data = pd.read_excel(excel_file)
            print(f"✅ Crisis data loaded: {len(crisis_data)} rows")
            return True
        else:
            print(f"❌ Excel file not found: {excel_file}")
            return False
            
    except Exception as e:
        print(f"❌ Crisis data loading error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_model_initialization():
    """Test model initialization independently"""
    try:
        print("\n🔍 Testing model initialization...")
        
        from model import CoastalThreatPredictor
        
        data_file = "cleaned_coastal_data.csv"
        if not os.path.exists(data_file):
            print(f"⚠️ Data file not found: {data_file}")
            return False
            
        print("✅ Data file exists")
        
        predictor = CoastalThreatPredictor(data_file)
        print("✅ Predictor instance created")
        
        # Try to load models
        try:
            predictor.load_models()
            print("✅ Models loaded successfully")
        except Exception as e:
            print(f"⚠️ Models not loaded: {e}")
            print("🔄 Training new models...")
            predictor.load_and_preprocess_data()
            predictor.train_classification_models()
            predictor.train_arima_models()
            predictor.save_models()
            print("✅ Models trained and saved")
        
        return True
        
    except Exception as e:
        print(f"❌ Model initialization error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🧪 Debugging server startup process...")
    
    # Test imports
    if not test_imports():
        print("❌ Import test failed")
        sys.exit(1)
    
    # Test crisis data loading
    if not test_crisis_data_loading():
        print("❌ Crisis data loading test failed")
        sys.exit(1)
    
    # Test model initialization
    if not test_model_initialization():
        print("❌ Model initialization test failed")
        sys.exit(1)
    
    print("\n✅ All tests passed! Server should be able to start.")
