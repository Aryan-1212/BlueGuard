# 🚨 Crisis Monitoring Integration

## Overview
The Crisis Monitoring System has been integrated into the dashboard2 to provide real-time coastal threat analysis using AI predictions from Excel data.

## 🎯 What's Been Added

### **1. Crisis Monitoring Hook (`useCrisisMonitoring`)**
- **Location**: `hooks/useCrisisMonitoring.js`
- **Purpose**: Manages crisis monitoring state and API calls
- **Features**:
  - Auto-refresh every 5 seconds when monitoring is active
  - Start/stop monitoring controls
  - Error handling and loading states
  - Real-time data updates

### **2. Crisis Monitoring Controls Component**
- **Location**: `components/CrisisMonitoringControls.jsx`
- **Purpose**: Provides start/stop buttons for crisis monitoring
- **Features**:
  - Visual status indicators (Active/Inactive)
  - Loading states for buttons
  - Error display
  - Responsive design

### **3. Crisis Status Display Component**
- **Location**: `components/CrisisStatusDisplay.jsx`
- **Purpose**: Shows real-time crisis data and predictions
- **Features**:
  - Threat summary with color-coded levels
  - Current predictions with threat/safe indicators
  - Input data from randomly selected Excel row
  - Last update timestamp

### **4. API Integration**
- **Location**: `services/api.js`
- **Endpoints Added**:
  - `GET /crisis-status` - Get current crisis status
  - `GET /crisis-data/info` - Get Excel data information
  - `POST /crisis-monitoring/start` - Start monitoring
  - `POST /crisis-monitoring/stop` - Stop monitoring

## 🔄 How It Works

### **Data Flow**
```
Excel File (testing_api_data.xlsx) 
    ↓
Flask Server (5-second random row selection)
    ↓
AI Model (CoastalThreatPredictor)
    ↓
JSON Response
    ↓
React Dashboard (Real-time updates)
```

### **Update Cycle**
1. **User clicks "Start Monitoring"**
2. **Flask server begins 5-second loop**:
   - Randomly selects 1 row from Excel
   - Processes through ML model
   - Updates crisis status
3. **Dashboard auto-refreshes every 5 seconds**
4. **User sees real-time threat analysis**

## 🎨 Dashboard Integration

### **Location in Dashboard**
The crisis monitoring section is added at the bottom of the dashboard, below the existing metrics cards.

### **Layout**
- **Left Column**: Crisis monitoring controls (start/stop buttons)
- **Right Column**: Crisis status display (threats, predictions, data)

### **Responsive Design**
- **Desktop**: 3-column grid (1 for controls, 2 for status)
- **Mobile**: Single column stack

## 🚀 Usage Instructions

### **1. Start Monitoring**
- Click the green "Start Monitoring" button
- System will begin fetching crisis data every 5 seconds
- Status indicator shows "Active"

### **2. View Real-time Data**
- **Threat Summary**: Color-coded threat counts (Critical, High, Medium, Low)
- **Current Predictions**: Real-time threat predictions with confidence levels
- **Input Data**: Shows the randomly selected Excel row data
- **Last Update**: Timestamp of most recent data

### **3. Stop Monitoring**
- Click the red "Stop Monitoring" button
- System stops auto-refreshing
- Status indicator shows "Inactive"

## 🔧 Technical Details

### **API Base URL**
- **Flask Server**: `http://localhost:5000`
- **Crisis Endpoints**: Direct Flask routes (not `/api` prefixed)

### **Data Refresh**
- **Active Monitoring**: Every 5 seconds
- **Manual Refresh**: Available through the hook
- **Error Handling**: Graceful fallbacks and user notifications

### **State Management**
- **Local State**: Crisis data, monitoring status, loading states
- **Auto-cleanup**: Intervals are properly cleaned up on unmount
- **Error Boundaries**: User-friendly error messages

## 🎯 Key Features

### **Real-time Updates**
- ✅ 5-second refresh cycle
- ✅ Live threat analysis
- ✅ Dynamic data display
- ✅ Status indicators

### **User Controls**
- ✅ Start/stop monitoring
- ✅ Visual feedback
- ✅ Error handling
- ✅ Loading states

### **Data Display**
- ✅ Threat summary cards
- ✅ Prediction details
- ✅ Input data preview
- ✅ Timestamp tracking

## 🔍 Troubleshooting

### **Common Issues**

1. **"No crisis data available"**
   - Ensure Flask server is running
   - Check if `testing_api_data.xlsx` exists
   - Verify crisis monitoring is started

2. **API connection errors**
   - Check Flask server is running on port 5000
   - Verify CORS is enabled
   - Check network connectivity

3. **No updates**
   - Ensure monitoring is started
   - Check browser console for errors
   - Verify 5-second interval is working

### **Debug Information**
- Check browser console for API calls
- Monitor network tab for requests
- Verify Flask server logs

## 🎨 Customization

### **Modify Update Frequency**
Change the interval in `useCrisisMonitoring.js`:
```javascript
interval = setInterval(() => {
  fetchCrisisStatus();
}, 5000); // Change to desired milliseconds
```

### **Add New Data Fields**
Extend the `CrisisStatusDisplay` component to show additional fields from the crisis data.

### **Custom Styling**
Modify the component CSS classes to match your design system.

---

**🎯 The Crisis Monitoring System is now fully integrated into dashboard2, providing real-time coastal threat analysis with a modern React interface!**
