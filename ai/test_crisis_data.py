import pandas as pd
import os

def test_crisis_data_loading():
    """Test loading crisis data from Excel file"""
    try:
        excel_file = "testing_api_data.xlsx"
        print(f"Testing crisis data loading from: {excel_file}")
        print(f"File exists: {os.path.exists(excel_file)}")
        
        if os.path.exists(excel_file):
            print(f"File size: {os.path.getsize(excel_file)} bytes")
            
            # Try to read the Excel file
            print("Attempting to read Excel file...")
            crisis_data = pd.read_excel(excel_file)
            
            print(f"✅ Successfully loaded {len(crisis_data)} rows of crisis data")
            print(f"📋 Columns: {list(crisis_data.columns)}")
            print(f"📊 First few rows:")
            print(crisis_data.head(3))
            
            return True
        else:
            print(f"❌ Excel file {excel_file} not found")
            return False
            
    except Exception as e:
        print(f"❌ Error loading crisis data: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_crisis_data_loading()
