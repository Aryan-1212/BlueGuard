# Coastal Threat Prediction AI Server

This Flask server provides a REST API for the Coastal Threat Prediction system, integrating with the existing `CoastalThreatPredictor` model.

## Features

- **Threat Prediction**: POST endpoint to predict coastal threats based on input data
- **Threat Reports**: GET endpoint for comprehensive threat analysis
- **Time Series Forecasting**: GET endpoint for ARIMA-based forecasts
- **Model Information**: GET endpoint for model status and configuration
- **Model Retraining**: POST endpoint to retrain models with new data
- **Health Check**: GET endpoint to verify server status

## Setup Instructions

### 1. Install Dependencies

```bash
cd ai
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
- **URL**: `GET /health`
- **Description**: Check server and model status
- **Response**: Server health information

### 2. Threat Prediction
- **URL**: `POST /predict`
- **Description**: Predict threats based on input data
- **Request Body**: JSON with coastal data parameters
- **Response**: Threat predictions, probabilities, levels, and recommendations

#### Example Request:
```json
{
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
```

#### Example Response:
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "input_data": {...},
  "predictions": {
    "cyclone": true,
    "sea_level": false,
    "algal_bloom": true,
    "erosion": false
  },
  "probabilities": {
    "cyclone": 78.5,
    "sea_level": 23.2,
    "algal_bloom": 65.8,
    "erosion": 18.9
  },
  "threat_levels": {
    "cyclone": "High",
    "sea_level": "Low",
    "algal_bloom": "High",
    "erosion": "Low"
  },
  "recommendations": {
    "cyclone": "Activate emergency protocols, evacuate vulnerable areas",
    "sea_level": "Continue monitoring, check coastal infrastructure",
    "algal_bloom": "Close affected beaches, activate health alerts",
    "erosion": "Monitor coastal changes, maintain existing defenses"
  }
}
```

### 3. Threat Report
- **URL**: `GET /threat-report`
- **Description**: Get comprehensive threat analysis
- **Response**: Detailed threat report with probabilities, levels, trends, and recommendations

### 4. Time Series Forecast
- **URL**: `GET /forecast`
- **Description**: Get 30-day forecasts for key metrics
- **Response**: ARIMA-based forecasts for sea level, wave height, chlorophyll, and cyclone distance

### 5. Model Information
- **URL**: `GET /model-info`
- **Description**: Get information about loaded models
- **Response**: Model status, feature columns, and configuration

### 6. Model Retraining
- **URL**: `POST /retrain`
- **Description**: Retrain models with current data
- **Response**: Retraining status and updated model information

## Data Requirements

The server expects input data with the following features:

- **Environmental Metrics**: sea_level_m, wave_height_m, wind_speed_kmph, rainfall_mm, sst_celsius
- **Water Quality**: chlorophyll_mg_m3, turbidity_index
- **Risk Indices**: storm_surge_risk_index, coastal_erosion_risk, algal_bloom_risk_index, pollution_risk_index
- **Threat Indicators**: cyclone_distance_km, ai_confidence_score
- **Socio-economic**: population_exposed, fisherfolk_activity, infrastructure_exposure_index
- **Environmental Impact**: blue_carbon_loss_ton_co2

## Model Training

The server automatically:
1. Creates sample data if no data file exists
2. Loads existing trained models if available
3. Trains new models if none exist
4. Saves models for future use

## Error Handling

All endpoints include proper error handling:
- Input validation
- Model availability checks
- Graceful error responses with descriptive messages
- HTTP status codes for different error types

## CORS Support

The server includes CORS support to allow requests from your React frontend running on different ports.

## Integration with Frontend

To integrate with your React/Next.js frontend:

1. Make HTTP requests to the Flask endpoints
2. Handle JSON responses
3. Display predictions, threat levels, and recommendations
4. Use the forecast data for time series visualizations

## Development Notes

- The server runs in debug mode by default
- Models are automatically saved and loaded
- Sample data is generated if no data file exists
- All predictions include confidence intervals and recommendations
