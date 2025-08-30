# BlueGuard Dashboard

A modern, interactive dashboard for environmental and coastal risk monitoring built with Next.js, React, and D3.js.

## Features

### 🎯 **KPI Cards**
- **Sea Level Monitoring**: Real-time sea level data with anomaly detection
- **Wave Height Tracking**: Current wave conditions and trends
- **Wind Speed Analysis**: Wind speed monitoring in km/h
- **Rainfall Measurement**: 24-hour rainfall accumulation

### 📊 **Interactive Charts**
- **Sea Level Trends**: D3.js line chart with gradient fill and hover tooltips
- **Environmental Parameters**: Multi-line chart for wave height, wind speed, and rainfall
- **Risk Assessment**: Bar chart visualization of various risk indices

### 🚨 **Risk Assessment**
- **Storm Surge Risk**: Real-time storm surge probability
- **Coastal Erosion**: Erosion risk monitoring
- **Algal Bloom Risk**: Harmful algal bloom detection
- **Pollution Risk**: Water quality and pollution monitoring

### 📈 **Environmental Data**
- **Sea Surface Temperature**: SST monitoring in Celsius
- **Chlorophyll Levels**: Phytoplankton activity measurement
- **Turbidity Index**: Water clarity assessment
- **Cyclone Distance**: Tropical cyclone proximity tracking

### 🤖 **AI Integration**
- **AI Confidence Score**: Machine learning model confidence
- **Population Exposure**: Affected population calculation
- **Infrastructure Risk**: Critical infrastructure vulnerability assessment

### 🌊 **Coastal Monitoring**
- **Fisherfolk Activity**: Fishing activity monitoring
- **Blue Carbon Loss**: Carbon sequestration impact assessment
- **Response Team Status**: Emergency response readiness

## Components

### `SeaLevelChart.js`
- Interactive line chart with gradient fill
- Hover tooltips with precise values
- Responsive design with smooth animations
- Grid lines and axis labels

### `RiskChart.js`
- Bar chart visualization for risk indices
- Color-coded risk levels
- Interactive hover effects
- Percentage-based risk assessment

### `EnvironmentalChart.js`
- Multi-line chart for environmental parameters
- Legend with color coding
- Responsive tooltips
- Grid overlay for readability

## Data Structure

The dashboard uses static sample data for demonstration:

```javascript
const sampleData = {
  timestamp: "2024-01-01T12:00:00Z",
  station_id: "COAST-001",
  sea_level_m: 1.85,
  wave_height_m: 2.3,
  wind_speed_kmph: 28.5,
  rainfall_mm: 45.2,
  sst_celsius: 24.8,
  chlorophyll_mg_m3: 0.85,
  turbidity_index: 0.42,
  sea_level_anomaly_m: 0.15,
  storm_surge_risk_index: 0.68,
  coastal_erosion_risk: 0.72,
  algal_bloom_risk_index: 0.31,
  pollution_risk_index: 0.45,
  cyclone_distance_km: 125.0,
  ai_confidence_score: 0.89,
  population_exposed: 15420,
  fisherfolk_activity: 0.78,
  infrastructure_exposure_index: 0.65,
  blue_carbon_loss_ton_co2: 12.5,
  alert_level: "MODERATE",
  recommended_action: "Monitor sea level changes and prepare evacuation protocols",
  alert_sent_status: "SENT",
  response_team_deployed: "READY"
};
```

## Technologies Used

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **Charts**: D3.js 7.8.5
- **Icons**: Lucide React
- **Animations**: CSS transitions and transforms

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Required Packages**:
   ```bash
   npm install d3 recharts lucide-react
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Customization

### Adding New Charts
1. Create a new component in the `components/` directory
2. Import D3.js and implement chart logic
3. Add the component to the main dashboard
4. Pass appropriate data and styling props

### Modifying Data Sources
1. Update the `sampleData` object with new fields
2. Modify chart components to handle new data
3. Update KPI cards to display new metrics

### Styling Changes
1. Modify Tailwind CSS classes in components
2. Update color schemes in chart components
3. Adjust responsive breakpoints as needed

## Responsive Design

The dashboard is fully responsive with:
- Mobile-first approach
- Grid-based layouts
- Flexible chart sizing
- Touch-friendly interactions

## Performance Features

- **Lazy Loading**: Charts render only when visible
- **Smooth Animations**: CSS transitions for better UX
- **Optimized Rendering**: Efficient D3.js updates
- **Memory Management**: Proper cleanup of chart instances

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- Real-time data integration
- WebSocket connections for live updates
- Export functionality for reports
- Mobile app development
- Advanced AI predictions
- Historical data analysis
- Custom alert configurations
