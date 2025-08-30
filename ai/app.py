from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from datetime import datetime
import os
import sys
import threading
import time

# Add the current directory to Python path to import model
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from model import CoastalThreatPredictor

app = Flask(__name__)
CORS(app,origins=["http://localhost:3000", "http://localhost:5000"])  # Enable CORS for all routes

# Global predictor instance
predictor = None

# Global variables for crisis monitoring
crisis_data = None
current_crisis_status = None
crisis_update_thread = None
stop_crisis_monitoring = False

# Test data for prediction
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

def initialize_predictor():
    global predictor
    try:
        # Check if data file exists, if not create sample data
        data_file = "cleaned_coastal_data.csv"
        if not os.path.exists(data_file):
            create_sample_data(data_file)
        
        predictor = CoastalThreatPredictor(data_file)
        
        # Try to load existing models first
        try:
            predictor.load_models()
            print("Loaded existing trained models")
            
            # Ensure scaler is properly fitted by loading and preprocessing data
            print("Ensuring scaler is properly fitted...")
            predictor.load_and_preprocess_data()
            
            # Verify that models are actually loaded and working
            if not hasattr(predictor, 'models') or not predictor.models:
                print("⚠️ Models loaded but empty, retraining...")
                predictor.train_classification_models()
                predictor.train_arima_models()
                predictor.save_models()
                print("✅ Models retrained and saved")
            
        except Exception as load_error:
            print(f"No existing models found or error loading: {load_error}")
            print("Training new models...")
            # Load and preprocess data
            predictor.load_and_preprocess_data()
            # Train models
            predictor.train_classification_models()
            predictor.train_arima_models()
            # Save models
            predictor.save_models()
            print("Models trained and saved successfully")
        
        # Final verification
        if not hasattr(predictor, 'models') or not predictor.models:
            print("❌ Models still not available after initialization")
            return False
            
        if not hasattr(predictor, 'scaler') or predictor.scaler is None:
            print("❌ Scaler still not available after initialization")
            return False
            
        print("✅ All components verified and ready")
        
        # Load crisis data
        if load_crisis_data():
            print("✅ Crisis data loaded successfully")
            
            # Start crisis monitoring
            if start_crisis_monitoring():
                print("✅ Crisis monitoring started")
            else:
                print("⚠️ Crisis monitoring already running")
        else:
            print("⚠️ Could not load crisis data")
        
        return True
        
    except Exception as e:
        print(f"Error initializing predictor: {str(e)}")
        return False

def load_crisis_data():
    """Load crisis data from Excel file"""
    global crisis_data
    try:
        excel_file = "testing_api_data.xlsx"
        if os.path.exists(excel_file):
            print(f"📊 Loading crisis data from {excel_file}...")
            crisis_data = pd.read_excel(excel_file)
            print(f"✅ Loaded {len(crisis_data)} rows of crisis data")
            print(f"📋 Columns: {list(crisis_data.columns)}")
            return True
        else:
            print(f"❌ Excel file {excel_file} not found")
            return False
    except Exception as e:
        print(f"❌ Error loading crisis data: {e}")
        return False

def create_sample_data(filename):
    print("Creating sample coastal data...")
    
    # Generate sample data
    np.random.seed(42)
    n_samples = 1000
    
    # Generate timestamps
    start_date = datetime(2023, 1, 1)
    timestamps = [start_date + pd.Timedelta(hours=i) for i in range(n_samples)]
    
    # Generate sample features
    data = {
        'timestamp': timestamps,
        'sea_level_m': np.random.normal(1.5, 0.3, n_samples),
        'wave_height_m': np.random.exponential(0.8, n_samples),
        'wind_speed_kmph': np.random.weibull(2.0, n_samples) * 30,
        'rainfall_mm': np.random.exponential(5.0, n_samples),
        'sst_celsius': np.random.normal(25, 3, n_samples),
        'chlorophyll_mg_m3': np.random.exponential(0.5, n_samples),
        'turbidity_index': np.random.uniform(0, 1, n_samples),
        'sea_level_anomaly_m': np.random.normal(0, 0.2, n_samples),
        'storm_surge_risk_index': np.random.uniform(0, 1, n_samples),
        'coastal_erosion_risk': np.random.uniform(0, 1, n_samples),
        'algal_bloom_risk_index': np.random.uniform(0, 1, n_samples),
        'pollution_risk_index': np.random.uniform(0, 1, n_samples),
        'cyclone_distance_km': np.random.exponential(200, n_samples),
        'ai_confidence_score': np.random.uniform(0.7, 1.0, n_samples),
        'population_exposed': np.random.randint(1000, 100000, n_samples),
        'fisherfolk_activity': np.random.uniform(0, 1, n_samples),
        'infrastructure_exposure_index': np.random.uniform(0, 1, n_samples),
        'blue_carbon_loss_ton_co2': np.random.exponential(50, n_samples)
    }
    
    # Create DataFrame and save
    df = pd.DataFrame(data)
    df.to_csv(filename, index=False)
    print(f"Sample data created: {filename}")

def crisis_monitoring_loop():
    """Background thread that continuously monitors crisis conditions every 5 seconds"""
    global current_crisis_status, stop_crisis_monitoring
    
    print("🚨 Starting crisis monitoring loop (5-second intervals)...")
    
    while not stop_crisis_monitoring:
        try:
            if crisis_data is not None and predictor is not None:
                # Randomly select one row from the crisis data
                random_row = crisis_data.sample(n=1).iloc[0]
                
                print(f"\n🔄 [{datetime.now().strftime('%H:%M:%S')}] Processing random row...")
                
                # Convert row to DataFrame for prediction
                input_df = pd.DataFrame([random_row.to_dict()])
                
                # Ensure all required columns are present
                required_columns = [
                    'sea_level_m', 'wave_height_m', 'wind_speed_kmph', 'rainfall_mm',
                    'sst_celsius', 'chlorophyll_mg_m3', 'turbidity_index', 'sea_level_anomaly_m',
                    'storm_surge_risk_index', 'coastal_erosion_risk', 'algal_bloom_risk_index',
                    'pollution_risk_index', 'cyclone_distance_km', 'ai_confidence_score',
                    'population_exposed', 'fisherfolk_activity', 'infrastructure_exposure_index',
                    'blue_carbon_loss_ton_co2'
                ]
                
                # Fill missing columns with default values
                for col in required_columns:
                    if col not in input_df.columns:
                        if col in ['sea_level_m', 'sst_celsius']:
                            input_df[col] = 25.0
                        elif col in ['wave_height_m', 'wind_speed_kmph', 'rainfall_mm']:
                            input_df[col] = 0.0
                        elif col in ['chlorophyll_mg_m3', 'blue_carbon_loss_ton_co2']:
                            input_df[col] = 0.5
                        else:
                            input_df[col] = 0.0
                
                # Make predictions
                try:
                    predictions, probabilities, arima_forecasts = predictor.predict_threats(input_df)
                    
                    # Format crisis status
                    crisis_status = {
                        'timestamp': datetime.now().isoformat(),
                        'input_data': random_row.to_dict(),
                        'predictions': {},
                        'probabilities': {},
                        'threat_levels': {},
                        'recommendations': {},
                        'summary': {
                            'total_threats': 0,
                            'critical_threats': 0,
                            'high_threats': 0,
                            'medium_threats': 0,
                            'low_threats': 0
                        }
                    }
                    
                    # Process each threat type
                    for threat_name in predictions.keys():
                        pred = predictions[threat_name][0]
                        prob = probabilities[threat_name][0] * 100
                        
                        # Determine threat level
                        if prob < 25:
                            level = "Low"
                            crisis_status['summary']['low_threats'] += 1
                        elif prob < 50:
                            level = "Medium"
                            crisis_status['summary']['medium_threats'] += 1
                        elif prob < 75:
                            level = "High"
                            crisis_status['summary']['high_threats'] += 1
                        else:
                            level = "Critical"
                            crisis_status['summary']['critical_threats'] += 1
                        
                        if pred:
                            crisis_status['summary']['total_threats'] += 1
                        
                        # Get recommendation
                        recommendation = predictor._get_recommendation(threat_name, prob, level)
                        
                        crisis_status['predictions'][threat_name] = bool(pred)
                        crisis_status['probabilities'][threat_name] = round(prob, 2)
                        crisis_status['threat_levels'][threat_name] = level
                        crisis_status['recommendations'][threat_name] = recommendation
                    
                    # Update global crisis status
                    current_crisis_status = crisis_status
                    
                    print(f"✅ Crisis status updated - {crisis_status['summary']['total_threats']} threats detected")
                    
                except Exception as pred_error:
                    print(f"❌ Prediction error: {pred_error}")
                    current_crisis_status = {
                        'timestamp': datetime.now().isoformat(),
                        'error': f"Prediction failed: {str(pred_error)}",
                        'input_data': random_row.to_dict()
                    }
            
            # Wait 5 seconds before next update
            time.sleep(5)
            
        except Exception as e:
            print(f"❌ Error in crisis monitoring loop: {e}")
            time.sleep(5)
    
    print("🛑 Crisis monitoring loop stopped")

def start_crisis_monitoring():
    """Start the crisis monitoring background thread"""
    global crisis_update_thread, stop_crisis_monitoring
    
    if crisis_update_thread is None or not crisis_update_thread.is_alive():
        stop_crisis_monitoring = False
        crisis_update_thread = threading.Thread(target=crisis_monitoring_loop, daemon=True)
        crisis_update_thread.start()
        print("🚨 Crisis monitoring started")
        return True
    return False

def stop_crisis_monitoring():
    """Stop the crisis monitoring background thread"""
    global stop_crisis_monitoring
    
    stop_crisis_monitoring = True
    if crisis_update_thread and crisis_update_thread.is_alive():
        crisis_update_thread.join(timeout=2)
    print("🛑 Crisis monitoring stopped")

def verify_model_readiness():
    """Verify that all model components are ready for prediction"""
    global predictor
    
    if predictor is None:
        return False, "Predictor not initialized"
    
    # Check if models are loaded
    if not hasattr(predictor, 'models') or not predictor.models:
        return False, "No classification models loaded"
    
    # Check if scaler is fitted
    if not hasattr(predictor, 'scaler') or predictor.scaler is None:
        return False, "Scaler not available"
    
    # Check if data is loaded
    if not hasattr(predictor, 'data') or predictor.data is None:
        return False, "Training data not loaded"
    
    return True, "All components ready"

def test_prediction_with_sample_data():
    """Test prediction with the predefined test data and print JSON response to console"""
    global predictor
    
    if predictor is None:
        print("❌ Predictor not initialized. Cannot make predictions.")
        return
    
            # Verify model readiness
        is_ready, message = verify_model_readiness()
        if not is_ready:
            print(f"❌ Model not ready: {message}")
            print("🔄 Attempting to fix...")
            try:
                # Load and preprocess data
                predictor.load_and_preprocess_data()
                print("✅ Data loaded and preprocessed")
                
                # Check if models need to be trained
                if not hasattr(predictor, 'models') or not predictor.models:
                    print("🔄 Training classification models...")
                    predictor.train_classification_models()
                    print("✅ Classification models trained")
                
                if not hasattr(predictor, 'arima_models') or not predictor.arima_models:
                    print("🔄 Training ARIMA models...")
                    predictor.train_arima_models()
                    print("✅ ARIMA models trained")
                
                print("✅ All model components reinitialized")
                
            except Exception as e:
                print(f"❌ Failed to reinitialize: {e}")
                return
    
    try:
        print("\n" + "="*60)
        print("🧪 TESTING PREDICTION WITH SAMPLE DATA")
        print("="*60)
        
        # Convert test data to DataFrame
        input_df = pd.DataFrame([test_data])
        
        # Ensure all required columns are present
        required_columns = [
            'sea_level_m', 'wave_height_m', 'wind_speed_kmph', 'rainfall_mm',
            'sst_celsius', 'chlorophyll_mg_m3', 'turbidity_index', 'sea_level_anomaly_m',
            'storm_surge_risk_index', 'coastal_erosion_risk', 'algal_bloom_risk_index',
            'pollution_risk_index', 'cyclone_distance_km', 'ai_confidence_score',
            'population_exposed', 'fisherfolk_activity', 'infrastructure_exposure_index',
            'blue_carbon_loss_ton_co2'
        ]
        
        # Fill missing columns with default values
        for col in required_columns:
            if col not in input_df.columns:
                if col in ['sea_level_m', 'sst_celsius']:
                    input_df[col] = 0.5
                elif col in ['wave_height_m', 'wind_speed_kmph', 'rainfall_mm']:
                    input_df[col] = 0.0
                elif col in ['chlorophyll_mg_m3', 'blue_carbon_loss_ton_co2']:
                    input_df[col] = 0.5
                else:
                    input_df[col] = 0.0
        
        print(f"📊 Input Data:")
        print(f"   Station ID: {test_data.get('station_id', 'N/A')}")
        print(f"   Sea Level: {test_data.get('sea_level_m', 'N/A')} m")
        print(f"   Wave Height: {test_data.get('wave_height_m', 'N/A')} m")
        print(f"   Wind Speed: {test_data.get('wind_speed_kmph', 'N/A')} kmph")
        print(f"   Cyclone Distance: {test_data.get('cyclone_distance_km', 'N/A')} km")
        print(f"   Population Exposed: {test_data.get('population_exposed', 'N/A')}")
        
        # Make predictions
        print(f"\n🔮 Making predictions...")
        
        # Ensure scaler is ready
        if not hasattr(predictor, 'scaler') or predictor.scaler is None:
            print("❌ Scaler not available. Reinitializing...")
            predictor.load_and_preprocess_data()
        
        predictions, probabilities, arima_forecasts = predictor.predict_threats(input_df)
        
        # Format response
        response = {
            'timestamp': datetime.now().isoformat(),
            'input_data': test_data,
            'predictions': {},
            'probabilities': {},
            'threat_levels': {},
            'recommendations': {}
        }
        
        # Process each threat type
        for threat_name in predictions.keys():
            # Get prediction and probability
            pred = predictions[threat_name][0]  # First (and only) prediction
            prob = probabilities[threat_name][0] * 100  # Convert to percentage
            
            # Determine threat level
            if prob < 25:
                level = "Low"
            elif prob < 50:
                level = "Medium"
            elif prob < 75:
                level = "High"
            else:
                level = "Critical"
            
            # Get recommendation
            recommendation = predictor._get_recommendation(threat_name, prob, level)
            
            response['predictions'][threat_name] = bool(pred)
            response['probabilities'][threat_name] = round(prob, 2)
            response['threat_levels'][threat_name] = level
            response['recommendations'][threat_name] = recommendation
        
        # Print the JSON response to console
        print(f"\n📋 PREDICTION RESULTS:")
        print(f"="*60)
        print(json.dumps(response, indent=2, ensure_ascii=False))
        print(f"="*60)
        
        # Print summary
        print(f"\n📊 THREAT SUMMARY:")
        for threat_name in response['predictions'].keys():
            pred = response['predictions'][threat_name]
            prob = response['probabilities'][threat_name]
            level = response['threat_levels'][threat_name]
            print(f"   {threat_name.replace('_', ' ').title()}: {level} ({prob:.1f}%) - {'⚠️ THREAT' if pred else '✅ SAFE'}")
        
        return response
        
    except Exception as e:
        print(f"❌ Error during test prediction: {str(e)}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    if predictor is None:
        return jsonify({
            'status': 'unhealthy',
            'timestamp': datetime.now().isoformat(),
            'model_loaded': False,
            'message': 'Predictor not initialized'
        }), 500
    
    # Check model readiness
    is_ready, message = verify_model_readiness()
    
    return jsonify({
        'status': 'healthy' if is_ready else 'degraded',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': True,
        'model_ready': is_ready,
        'message': message,
        'components': {
            'models_loaded': hasattr(predictor, 'models') and bool(predictor.models),
            'scaler_ready': hasattr(predictor, 'scaler') and predictor.scaler is not None,
            'data_loaded': hasattr(predictor, 'data') and predictor.data is not None
        }
    })

@app.route('/test-prediction', methods=['GET'])
def test_prediction_endpoint():
    """Test prediction endpoint that uses predefined test data"""
    try:
        if predictor is None:
            return jsonify({'error': 'Model not initialized'}), 500
        
        # Call the test prediction function
        result = test_prediction_with_sample_data()
        
        if result:
            return jsonify(result)
        else:
            return jsonify({'error': 'Test prediction failed'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/crisis-status', methods=['GET'])
def get_crisis_status():
    """Get current crisis status and predictions"""
    try:
        if predictor is None:
            return jsonify({'error': 'Model not initialized'}), 500
        
        if current_crisis_status is None:
            return jsonify({
                'error': 'No crisis data available',
                'message': 'Crisis monitoring may not be running',
                'timestamp': datetime.now().isoformat()
            }), 503
        
        # Return the current crisis status
        return jsonify(current_crisis_status)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/crisis-monitoring/start', methods=['POST'])
def start_crisis_monitoring_endpoint():
    """Start crisis monitoring"""
    try:
        if predictor is None:
            return jsonify({'error': 'Model not initialized'}), 500
        
        if crisis_data is None:
            return jsonify({'error': 'Crisis data not loaded'}), 500
        
        success = start_crisis_monitoring()
        
        if success:
            return jsonify({
                'message': 'Crisis monitoring started successfully',
                'timestamp': datetime.now().isoformat(),
                'data_rows_available': len(crisis_data)
            })
        else:
            return jsonify({'error': 'Crisis monitoring already running'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/crisis-monitoring/stop', methods=['POST'])
def stop_crisis_monitoring_endpoint():
    """Stop crisis monitoring"""
    try:
        stop_crisis_monitoring()
        return jsonify({
            'message': 'Crisis monitoring stopped successfully',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/crisis-data/info', methods=['GET'])
def get_crisis_data_info():
    """Get information about the loaded crisis data"""
    try:
        if crisis_data is None:
            return jsonify({'error': 'No crisis data loaded'}), 500
        
        info = {
            'timestamp': datetime.now().isoformat(),
            'total_rows': len(crisis_data),
            'columns': list(crisis_data.columns),
            'data_types': crisis_data.dtypes.to_dict(),
            'sample_data': crisis_data.head(3).to_dict('records') if len(crisis_data) > 0 else []
        }
        
        return jsonify(info)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict_threats():
    """Predict threats based on input data"""
    try:
        if predictor is None:
            return jsonify({'error': 'Model not initialized'}), 500
        
        # Get input data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
        
        # Convert input data to DataFrame
        input_df = pd.DataFrame([data])
        
        # Ensure all required columns are present
        required_columns = [
            'sea_level_m', 'wave_height_m', 'wind_speed_kmph', 'rainfall_mm',
            'sst_celsius', 'chlorophyll_mg_m3', 'turbidity_index', 'sea_level_anomaly_m',
            'storm_surge_risk_index', 'coastal_erosion_risk', 'algal_bloom_risk_index',
            'pollution_risk_index', 'cyclone_distance_km', 'ai_confidence_score',
            'population_exposed', 'fisherfolk_activity', 'infrastructure_exposure_index',
            'blue_carbon_loss_ton_co2'
        ]
        
        # Fill missing columns with default values
        for col in required_columns:
            if col not in input_df.columns:
                if col in ['sea_level_m', 'sst_celsius']:
                    input_df[col] = 25.0
                elif col in ['wave_height_m', 'wind_speed_kmph', 'rainfall_mm']:
                    input_df[col] = 0.0
                elif col in ['chlorophyll_mg_m3', 'blue_carbon_loss_ton_co2']:
                    input_df[col] = 0.5
                else:
                    input_df[col] = 0.0
        
        # Make predictions
        # Ensure all components are ready
        if not hasattr(predictor, 'scaler') or predictor.scaler is None:
            print("❌ Scaler not available. Reinitializing...")
            predictor.load_and_preprocess_data()
            
        if not hasattr(predictor, 'models') or not predictor.models:
            print("❌ Models not available. Training...")
            predictor.train_classification_models()
            
        predictions, probabilities, arima_forecasts = predictor.predict_threats(input_df)
        
        # Format response
        response = {
            'timestamp': datetime.now().isoformat(),
            'input_data': data,
            'predictions': {},
            'probabilities': {},
            'threat_levels': {},
            'recommendations': {}
        }
        
        # Process each threat type
        for threat_name in predictions.keys():
            # Get prediction and probability
            pred = predictions[threat_name][0]  # First (and only) prediction
            prob = probabilities[threat_name][0] * 100  # Convert to percentage
            
            # Determine threat level
            if prob < 25:
                level = "Low"
            elif prob < 50:
                level = "Medium"
            elif prob < 75:
                level = "High"
            else:
                level = "Critical"
            
            # Get recommendation
            recommendation = predictor._get_recommendation(threat_name, prob, level)
            
            response['predictions'][threat_name] = bool(pred)
            response['probabilities'][threat_name] = round(prob, 2)
            response['threat_levels'][threat_name] = level
            response['recommendations'][threat_name] = recommendation
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/threat-report', methods=['GET'])
def get_threat_report():
    """Get comprehensive threat report"""
    try:
        if predictor is None:
            return jsonify({'error': 'Model not initialized'}), 500
        
        # Generate threat report
        threat_report = predictor.generate_threat_report()
        
        # Format response
        response = {
            'timestamp': datetime.now().isoformat(),
            'threat_report': threat_report,
            'summary': {
                'total_threats': len(threat_report),
                'critical_threats': sum(1 for report in threat_report.values() if report['level'] == 'Critical'),
                'high_threats': sum(1 for report in threat_report.values() if report['level'] == 'High'),
                'medium_threats': sum(1 for report in threat_report.values() if report['level'] == 'Medium'),
                'low_threats': sum(1 for report in threat_report.values() if report['level'] == 'Low')
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/forecast', methods=['GET'])
def get_forecast():
    """Get time series forecasts"""
    try:
        if predictor is None:
            return jsonify({'error': 'Model not initialized'}), 500
        
        if not hasattr(predictor, 'arima_models'):
            return jsonify({'error': 'ARIMA models not available'}), 500
        
        # Get predictions to trigger ARIMA forecasts
        predictions, probabilities, arima_forecasts = predictor.predict_threats()
        
        # Format ARIMA forecasts
        formatted_forecasts = {}
        for target_name, forecast in arima_forecasts.items():
            if hasattr(forecast, '__iter__'):
                # Convert forecast to list and round values
                formatted_forecasts[target_name] = [round(float(val), 4) for val in forecast]
            else:
                formatted_forecasts[target_name] = [round(float(forecast), 4)]
        
        response = {
            'timestamp': datetime.now().isoformat(),
            'forecast_horizon': 30,  # 30-day forecast
            'forecasts': formatted_forecasts
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/model-info', methods=['GET'])
def get_model_info():
    """Get information about the loaded models"""
    try:
        if predictor is None:
            return jsonify({'error': 'Model not initialized'}), 500
        
        info = {
            'timestamp': datetime.now().isoformat(),
            'models_loaded': list(predictor.models.keys()) if hasattr(predictor, 'models') else [],
            'arima_models_loaded': list(predictor.arima_models.keys()) if hasattr(predictor, 'arima_models') else [],
            'scaler_loaded': predictor.scaler is not None,
            'feature_columns': [
                'sea_level_m', 'wave_height_m', 'wind_speed_kmph', 'rainfall_mm',
                'sst_celsius', 'chlorophyll_mg_m3', 'turbidity_index', 'sea_level_anomaly_m',
                'storm_surge_risk_index', 'coastal_erosion_risk', 'algal_bloom_risk_index',
                'pollution_risk_index', 'cyclone_distance_km', 'ai_confidence_score',
                'population_exposed', 'fisherfolk_activity', 'infrastructure_exposure_index',
                'blue_carbon_loss_ton_co2'
            ]
        }
        
        return jsonify(info)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/retrain', methods=['POST'])
def retrain_models():
    """Retrain the models with new data"""
    try:
        if predictor is None:
            return jsonify({'error': 'Model not initialized'}), 500
        
        # Ensure data is loaded
        if not hasattr(predictor, 'data') or predictor.data is None:
            print("🔄 Loading and preprocessing data...")
            predictor.load_and_preprocess_data()
        
        # Retrain models
        print("🔄 Training classification models...")
        predictor.train_classification_models()
        
        print("🔄 Training ARIMA models...")
        predictor.train_arima_models()
        
        # Save models
        print("💾 Saving models...")
        predictor.save_models()
        
        response = {
            'timestamp': datetime.now().isoformat(),
            'message': 'Models retrained and saved successfully',
            'models_updated': list(predictor.models.keys()) if hasattr(predictor, 'models') else [],
            'scaler_ready': hasattr(predictor, 'scaler') and predictor.scaler is not None,
            'data_loaded': hasattr(predictor, 'data') and predictor.data is not None
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Initializing Coastal Threat Prediction API...")
    
    # Initialize predictor
    if initialize_predictor():
        print("✅ Predictor initialized successfully")
        
        # Run test prediction with sample data
        print("\n🧪 Running test prediction with sample data...")
        test_prediction_with_sample_data()
        
        print("\n🚀 Starting Flask server...")
        print("📊 Available endpoints:")
        print("   GET  /health                    - Health check")
        print("   GET  /test-prediction           - Test prediction with sample data")
        print("   GET  /model-info                - Model information")
        print("   GET  /threat-report             - Threat analysis")
        print("   GET  /forecast                  - Time series forecasts")
        print("   POST /predict                   - Make predictions")
        print("   POST /retrain                   - Retrain models")
        print("   🚨 CRISIS MONITORING ENDPOINTS:")
        print("   GET  /crisis-status             - Get current crisis status")
        print("   GET  /crisis-data/info          - Get crisis data information")
        print("   POST /crisis-monitoring/start   - Start crisis monitoring")
        print("   POST /crisis-monitoring/stop    - Stop crisis monitoring")
        
        # Run the Flask app
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=True
        )
    else:
        print("❌ Failed to initialize predictor")
        sys.exit(1)
