"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Waves, 
  TrendingUp, 
  Wind, 
  Droplets, 
  AlertTriangle,
  Activity,
  MapPin,
  Users,
  Leaf,
  Settings,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { AnimatedCounter } from "./ui/animated-counter";
import { GlassCard } from "./ui/glass-card";
import EnhancedSeaLevelChart from "./charts/EnhancedSeaLevelChart.jsx";
import RiskGaugeChart from "./charts/RiskGaugeChart.jsx";
import EnvironmentalChart from "./charts/EnvironmentalChart.jsx";

import CrisisStatusDisplay from "./components/CrisisStatusDisplay";
import { useCrisisMonitoring } from "./hooks/useCrisisMonitoring";

// Dashboard data and alert structures defined inline


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [selectedView, setSelectedView] = useState("combined");
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [isLoadingTimeRange, setIsLoadingTimeRange] = useState(false);
  const router = useRouter();
  
  // Crisis monitoring hook
  const {
    crisisData,
    isMonitoring,
    loading: crisisLoading,
    error: crisisError,
    lastUpdate,
    startMonitoring,
    stopMonitoring,
  } = useCrisisMonitoring();
  
  // Dynamic crisis monitoring data
  const [dashboardData, setDashboardData] = useState({
    timestamp: new Date().toISOString(),
    sea_level: 0,
    wave_height: 0,
    wind_speed: 0,
    rainfall: 0,
    alert_level: "UNKNOWN",
    population_exposed: 0,
    ai_confidence: 0,
    storm_surge_risk: 0,
    coastal_erosion_risk: 0,
    water_quality_risk: 0,
    sst_celsius: 0,
    chlorophyll_mg_m3: 0,
    cyclone_distance_km: 0,
    blue_carbon_loss_ton_co2: 0,
  });

  // Dynamic time series data from crisis monitoring
  const [timeSeriesData, setTimeSeriesData] = useState({
    seaLevel: [],
    environmental: [],
  });

  // Dynamic alerts from crisis monitoring
  const [alerts, setAlerts] = useState([]);

  // Get current dataset from dynamic time series data
  const currentSeaLevelData = timeSeriesData.seaLevel;
  const currentEnvironmentalData = timeSeriesData.environmental;

  // Update dashboard data from crisis monitoring data
  const updateDashboardFromCrisisData = useCallback((crisisData) => {
    if (!crisisData || !crisisData.input_data) return;

    const inputData = crisisData.input_data;

    // Update main dashboard metrics
    setDashboardData((prev) => ({
      ...prev,
      timestamp: crisisData.timestamp,
      sea_level: inputData.sea_level_m || 0,
      wave_height: inputData.wave_height_m || 0,
      wind_speed: inputData.wind_speed_kmph || 0,
      rainfall: inputData.rainfall_mm || 0,
      sst_celsius: inputData.sst_celsius || 0,
      chlorophyll_mg_m3: inputData.chlorophyll_mg_m3 || 0,
      cyclone_distance_km: inputData.cyclone_distance_km || 0,
      population_exposed: inputData.population_exposed || 0,
      ai_confidence: Math.round((inputData.ai_confidence_score || 0) * 100),
      storm_surge_risk: Math.min(Math.round(
        (inputData.storm_surge_risk_index || 0) * 100
      ), 100),
      coastal_erosion_risk: Math.min(Math.round(
        (inputData.coastal_erosion_risk || 0) * 100
      ), 100),
      water_quality_risk: Math.min(Math.round(
        (inputData.pollution_risk_index || 0) * 100
      ), 100),
      blue_carbon_loss_ton_co2: inputData.blue_carbon_loss_ton_co2 || 0,
      alert_level: getAlertLevelFromThreats(crisisData.summary),
    }));

    // Update time series data
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    setTimeSeriesData((prev) => ({
      seaLevel: [
        ...prev.seaLevel.slice(-6), // Keep last 6 entries
        {
          time: timeStr,
          actual: inputData.sea_level_m || 0,
          predicted: (inputData.sea_level_m || 0) + (Math.random() * 0.1 - 0.05), // Add some prediction variation
        },
      ],
      environmental: [
        ...prev.environmental.slice(-6), // Keep last 6 entries
        {
          time: timeStr,
          wave_height: inputData.wave_height_m || 0,
          wind_speed: inputData.wind_speed_kmph || 0,
          rainfall: inputData.rainfall_mm || 0,
        },
      ],
    }));

    // Update alerts from predictions
    const newAlerts = [];
    if (crisisData.predictions && crisisData.threat_levels) {
      Object.entries(crisisData.predictions).forEach(
        ([threatType, isThreat]) => {
          if (isThreat) {
            const level = crisisData.threat_levels[threatType] || "MODERATE";
            const prob = crisisData.probabilities[threatType] || 0;
            const recommendation = crisisData.recommendations[threatType] || "";

            newAlerts.push({
              id: `${threatType}-${Date.now()}`,
              type: level.toUpperCase(),
              title: `${threatType.replace("_", " ").toUpperCase()} Alert`,
              message:
                recommendation ||
                `${threatType} threat detected with ${prob}% probability`,
              timestamp: timeStr,
              station: inputData.station_id || "COAST-001",
              probability: prob,
            });
          }
        }
      );
    }

    // Add system status alert if no threats
    if (newAlerts.length === 0) {
      newAlerts.push({
        id: `status-${Date.now()}`,
      type: "INFO",
        title: "System Status",
        message: "All systems normal - no immediate threats detected",
        timestamp: timeStr,
        station: "System",
        probability: 0,
      });
    }

    setAlerts(newAlerts);
  }, []);

  // Helper function to determine alert level
  const getAlertLevelFromThreats = (summary) => {
    if (!summary) return "UNKNOWN";
    if (summary.critical_threats > 0) return "CRITICAL";
    if (summary.high_threats > 0) return "HIGH";
    if (summary.medium_threats > 0) return "MODERATE";
    if (summary.low_threats > 0) return "LOW";
    return "SAFE";
  };

  // Handle time range change with loading state
  const handleTimeRangeChange = async (range) => {
    if (range === selectedTimeRange) return;
    
    setIsLoadingTimeRange(true);
    
    // Simulate API call delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setSelectedTimeRange(range);
    setIsLoadingTimeRange(false);
  };

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (token) {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              setUser(data.user);
              setLoading(false);
              return;
            }
          }
        }
        
        const googleResponse = await fetch(
          "http://localhost:5000/api/auth/google/status",
          {
          credentials: "include",
          }
        );
        
        if (googleResponse.ok) {
          const googleData = await googleResponse.json();
          if (googleData.authenticated && googleData.user) {
            setUser(googleData.user);
            localStorage.setItem("Gtoken", "google_authenticated");
            setLoading(false);
            return;
          }
        }
        
        router.push("/login");
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Update timestamp every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync crisis monitoring data with dashboard
  useEffect(() => {
    if (crisisData && !crisisError) {
      updateDashboardFromCrisisData(crisisData);
    }
  }, [crisisData, crisisError, updateDashboardFromCrisisData]);

  // Auto-start crisis monitoring when component mounts
  useEffect(() => {
    if (!isMonitoring && !crisisLoading) {
      startMonitoring();
    }
  }, [isMonitoring, crisisLoading, startMonitoring]);

  const getAlertColor = (level) => {
    switch (level) {
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      case "MODERATE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "CRITICAL":
        return "bg-red-200 text-red-900 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAlertTypeColor = (type) => {
    switch (type) {
      case "CRITICAL":
        return "bg-red-50 border-red-200";
      case "MODERATE":
        return "bg-yellow-50 border-yellow-200";
      case "INFO":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getThreatLevelColor = (level) => {
    switch (level?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-500";
      case "HIGH":
        return "bg-orange-500";
      case "MODERATE":
        return "bg-yellow-500";
      case "LOW":
        return "bg-green-500";
      case "SAFE":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getThreatLevelTextColor = (level) => {
    switch (level?.toUpperCase()) {
      case "CRITICAL":
        return "text-red-600";
      case "HIGH":
        return "text-orange-600";
      case "MODERATE":
        return "text-yellow-600";
      case "LOW":
        return "text-green-600";
      case "SAFE":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "CRITICAL":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "MODERATE":
        return <Activity className="w-4 h-4 text-yellow-600" />;
      case "INFO":
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading)
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    </div>
  );
  
  if (!user)
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Redirecting to login...</p>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
      data-testid="dashboard-page"
    >
      {/* Enhanced Header */}
       <header
         className="bg-white sticky top-0 z-40 border-b border-border/50"
         data-testid="dashboard-header"
       >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Waves className="w-8 h-8 text-primary animate-float" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text">
                    BlueGuard
                  </h1> */}
                  <p className="text-sm text-muted-foreground">
                    Advanced Coastal Threat Monitoring
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* User Welcome */}
              {user && (
                <div className="flex items-center space-x-2 bg-card/80 px-4 py-2 rounded-lg shadow-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Welcome, {user.name || user.email}
                  </span>
                </div>
              )}
              
              {/* Real-time Data Stream Indicator */}
              <div className="flex items-center space-x-2 bg-card/80 px-4 py-2 rounded-lg shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-green-500 rounded animate-pulse"></div>
                  <div
                    className="w-1 h-4 bg-green-500 rounded animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1 h-4 bg-green-500 rounded animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {isMonitoring ? "AI Live Data" : "Data Offline"}
                </span>
              </div>
              
              {/* System Status */}
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p
                  className="text-sm font-semibold text-foreground"
                  data-testid="last-updated"
                >
                  {/* {currentTime} */}
                  <div className="text-sm text-muted-foreground">

                  {crisisData && crisisData.predictions && crisisData.timestamp ? new Date(crisisData.timestamp).toLocaleTimeString() : 'Never'}
              </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
       <main
         className="max-w-7xl mx-auto px-6 pt-4 pb-8 space-y-8"
         data-testid="dashboard-main"
       >
        {/* Active Alerts - High Priority */}
        {alerts.length > 0 && (
          <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-bold text-foreground">🚨 Active Alerts</h2>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {alerts.length} Active
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {/* Last Updated: {new Date().toLocaleTimeString()} */}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.slice(0, 6).map((alert) => (
                <div key={alert.id} className={`p-4 border rounded-lg ${getAlertTypeColor(alert.type)}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-opacity-50 rounded-full flex items-center justify-center">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{alert.title}</p>
                      <p className="text-xs mt-1 opacity-75">{alert.message}</p>
                      <p className="text-xs mt-2 opacity-60">
                        {alert.timestamp} • {alert.station}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAlertColor(alert.type)}`}>
                        {alert.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Current Predictions - High Priority */}
        {crisisData && crisisData.predictions && (
          <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-bold text-foreground">🔮 Current AI Predictions</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Real-time Analysis
                </span>
              </div>
              {/* <div className="text-sm text-muted-foreground">
                Last Updated: {crisisData.timestamp ? new Date(crisisData.timestamp).toLocaleTimeString() : 'Never'}
              </div> */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(crisisData.predictions).map(([threatType, isThreat]) => {
                const probability = crisisData.probabilities?.[threatType] || 0;
                const level = crisisData.threat_levels?.[threatType] || 'UNKNOWN';
                const recommendation = crisisData.recommendations?.[threatType] || '';
                
                return (
                  <div key={threatType} className={`p-4 border rounded-lg ${
                    isThreat ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">
                        {threatType.replace('_', ' ').toUpperCase()}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isThreat ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {isThreat ? 'THREAT' : 'SAFE'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Probability:</span>
                        <span className="font-semibold">{probability.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Level:</span>
                        <span className="font-semibold">{level}</span>
                      </div>
                      {recommendation && (
                        <div className="text-xs text-muted-foreground bg-white/50 p-2 rounded">
                          {recommendation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Enhanced Time Range Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-foreground">
              Dashboard Overview
            </h2>

            {/* Crisis Monitoring Status */}
            <div className="flex items-center space-x-2 bg-card rounded-lg p-2 shadow-sm border border-border">
              <div
                className={`w-2 h-2 rounded-full ${
                  isMonitoring ? "bg-green-500" : "bg-red-500"
                } animate-pulse`}
              ></div>
              <span className="text-sm font-medium">
                {crisisLoading
                  ? "Starting..."
                  : isMonitoring
                  ? "Monitoring Active"
                  : "Monitoring Stopped"}
              </span>
              {crisisError && (
                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  Error: {crisisError}
                </span>
              )}
            </div>

            {/* Data Refresh Status */}
            {/* <div className="flex items-center space-x-2 bg-card rounded-lg p-2 shadow-sm border border-border">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">
                Last Update:{" "}
                {lastUpdate
                  ? new Date(lastUpdate).toLocaleTimeString()
                  : "Never"}
              </span>
            </div> */}

            {/* <div className="flex items-center space-x-2 bg-card rounded-lg p-1 shadow-sm border border-border">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTimeRangeChange(range)}
                  className={`transition-all duration-300 relative ${
                    selectedTimeRange === range ? 'scale-105 shadow-md' : 'hover:scale-102'
                  }`}
                  disabled={isLoadingTimeRange || crisisLoading}
                  data-testid={`time-range-${range}`}
                >
                  {isLoadingTimeRange && selectedTimeRange === range && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <span className={isLoadingTimeRange && selectedTimeRange === range ? 'opacity-0' : 'opacity-100'}>
                    {range}
                  </span>
                </Button>
              ))}
            </div> */}
            {isLoadingTimeRange && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading data...</span>
              </div>
            )}
          </div>
          
          {/* Alert Status Indicator */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-sm border">
            {/* Threat Indicator Circle */}
            <div
              className={`relative flex items-center justify-center w-12 h-12 rounded-full 
      ${getThreatLevelColor(dashboardData.alert_level)} 
      ${dashboardData.alert_level === "HIGH" ? "animate-pulse" : ""}`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-wide 
        ${getThreatLevelTextColor(dashboardData.alert_level)}`}
              >
                {dashboardData.alert_level?.substring(0, 3) || "UNK"}
              </span>
              </div>

            {/* Text Section */}
            <div>
              <p className="text-sm font-medium text-gray-600">
                Current Threat Level
              </p>
              <p
                className={`text-lg font-semibold tracking-wide 
        ${getThreatLevelTextColor(dashboardData.alert_level)}`}
              >
                {dashboardData.alert_level || "UNKNOWN"}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ${
            isLoadingTimeRange || crisisLoading
              ? "opacity-75 scale-[0.98]"
              : "opacity-100 scale-100"
          }`}
          data-testid="kpi-cards"
        >
          {/* Sea Level Card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sea Level
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {crisisLoading ? (
                    <div className="animate-pulse bg-muted h-8 w-16 rounded"></div>
                  ) : (
                    <AnimatedCounter
                      end={dashboardData.sea_level}
                      decimals={2}
                    />
                  )}
                  m
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500 font-medium">
                    {crisisLoading
                      ? "..."
                      : `${dashboardData.sea_level > 1.8 ? "+" : ""}${(
                          dashboardData.sea_level - 1.8
                        ).toFixed(2)}m`}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Waves className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    (dashboardData.sea_level / 2.5) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {crisisLoading
                ? "Loading..."
                : `${Math.round(
                    (dashboardData.sea_level / 2.5) * 100
                  )}% of danger threshold`}
            </p>
          </GlassCard>

          {/* Wave Height Card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Wave Height
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {crisisLoading ? (
                    <div className="animate-pulse bg-muted h-8 w-16 rounded"></div>
                  ) : (
                    <AnimatedCounter
                      end={dashboardData.wave_height}
                      decimals={1}
                    />
                  )}
                  m
                </p>
                <div className="flex items-center mt-1">
                  <Activity className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-500 font-medium">
                    {crisisLoading
                      ? "..."
                      : dashboardData.wave_height > 2.0
                      ? "High"
                      : "Normal"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-cyan-600" />
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    (dashboardData.wave_height / 4.0) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {crisisLoading
                ? "Loading..."
                : `${Math.round(
                    (dashboardData.wave_height / 4.0) * 100
                  )}% of max recorded`}
            </p>
          </GlassCard>

          {/* Wind Speed Card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Wind Speed
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {crisisLoading ? (
                    <div className="animate-pulse bg-muted h-8 w-16 rounded"></div>
                  ) : (
                    <AnimatedCounter
                      end={dashboardData.wind_speed}
                      decimals={1}
                    />
                  )}
                  <span className="text-base"> km/h</span>
                </p>
                <div className="flex items-center mt-1">
                  <Wind className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">
                    {crisisLoading
                      ? "..."
                      : dashboardData.wind_speed > 25
                      ? "High"
                      : "Normal"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg relative">
                <Wind className="w-8 h-8 text-green-600 animate-pulse" />
                <div
                  className="particle"
                  style={{ top: "10px", left: "5px", animationDelay: "0s" }}
                ></div>
                <div
                  className="particle"
                  style={{ top: "20px", left: "15px", animationDelay: "0.5s" }}
                ></div>
                <div
                  className="particle"
                  style={{ top: "30px", left: "25px", animationDelay: "1s" }}
                ></div>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    (dashboardData.wind_speed / 60.0) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {crisisLoading
                ? "Loading..."
                : `${Math.round(
                    (dashboardData.wind_speed / 60.0) * 100
                  )}% of storm threshold`}
            </p>
          </GlassCard>

          {/* Rainfall Card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rainfall
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {crisisLoading ? (
                    <div className="animate-pulse bg-muted h-8 w-16 rounded"></div>
                  ) : (
                    <AnimatedCounter
                      end={dashboardData.rainfall}
                      decimals={1}
                    />
                  )}
                  <span className="text-base">mm</span>
                </p>
                <div className="flex items-center mt-1">
                  <Droplets className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-500 font-medium">
                    {crisisLoading
                      ? "..."
                      : dashboardData.rainfall > 50
                      ? "Heavy"
                      : "Light"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Droplets className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    (dashboardData.rainfall / 100.0) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {crisisLoading
                ? "Loading..."
                : `${Math.round(
                    (dashboardData.rainfall / 100.0) * 100
                  )}% of monthly average`}
            </p>
          </GlassCard>
        </div>

        {/* Loading State for No Data */}
        {!crisisData && crisisLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">
              Starting crisis monitoring...
            </p>
            <p className="text-sm text-muted-foreground">
              AI models are analyzing coastal data
            </p>
          </div>
        )}

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Sea Level Chart */}
            <Card
              className="chart-container shadow-lg border border-border"
              data-testid="sea-level-chart-container"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Sea Level Monitoring
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time measurements with AI predictions
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">
                        Actual
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">
                        Predicted
                      </span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div
                  className={`h-80 transition-opacity duration-500 ${
                    isLoadingTimeRange ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <EnhancedSeaLevelChart
                    data={currentSeaLevelData}
                    width={600}
                    height={320}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Environmental Parameters Chart */}
            <Card
              className="chart-container shadow-lg border border-border"
              data-testid="environmental-chart-container"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Environmental Parameters
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Multi-sensor data correlation
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={
                        selectedView === "combined" ? "default" : "ghost"
                      }
                      size="sm"
                      onClick={() => setSelectedView("combined")}
                      data-testid="view-combined"
                    >
                      Combined
                    </Button>
                    <Button
                      variant={
                        selectedView === "individual" ? "default" : "ghost"
                      }
                      size="sm"
                      onClick={() => setSelectedView("individual")}
                      data-testid="view-individual"
                    >
                      Individual
                    </Button>
                  </div>
                </div>
                <div
                  className={`h-80 transition-opacity duration-500 ${
                    isLoadingTimeRange ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <EnvironmentalChart 
                    data={currentEnvironmentalData} 
                    width={600} 
                    height={320}
                    viewMode={selectedView}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Risk Assessment & Alerts */}
          <div className="space-y-8">
            {/* Interactive Risk Gauge */}
            <Card
              className="chart-container shadow-lg border border-border"
              data-testid="risk-gauge-container"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Threat Assessment
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      AI-powered risk analysis
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      Systems Normal
                    </span>
                  </div>
                </div>
                
                                 <div
                   className={`h-72 flex flex-col items-center justify-center transition-opacity duration-500 ${
                     isLoadingTimeRange ? "opacity-50" : "opacity-100"
                   }`}
                 >
                   <div className="mb-12 flex-shrink-0">
                     <RiskGaugeChart value={Math.min(dashboardData.storm_surge_risk, 100)} />
                   </div>
                   
                   {/* Percentage Display Below Gauge */}
                   <div className="text-center flex-shrink-0">
                     {/* <p className="text-2xl font-bold text-foreground">
                       {Math.min(dashboardData.storm_surge_risk, 100)}%
                     </p> */}
                     <p className="text-sm text-muted-foreground">
                       Storm Surge Risk Level
                     </p>
                   </div>
                </div>

                {/* Risk Breakdown */}
                 <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Storm Surge</span>
                    </div>
                     <div className="text-right min-w-[70px]">
                       <span className="text-sm font-semibold text-red-600">
                         {Math.min(dashboardData.storm_surge_risk, 100)}%
                       </span>
                     </div>
                  </div>
                  {/* <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                       <span className="text-sm font-medium">
                         Coastal Erosion
                       </span>
                    </div>
                     <div className="text-right min-w-[70px]">
                       <span className="text-sm font-semibold text-orange-600">
                         {Math.min(dashboardData.coastal_erosion_risk, 100)}%
                       </span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Water Quality</span>
                    </div>
                     <div className="text-right min-w-[70px]">
                       <span className="text-sm font-semibold text-green-600">
                         {Math.min(dashboardData.water_quality_risk, 100)}%
                          </span>
                        </div>
                      </div> */}
                </div>
              </CardContent>
            </Card>
                  </div>
        </div>

        {/* Crisis Monitoring Section */}
        <div className="mt-8">
          {/* <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              🚨 Crisis Monitoring System
            </h2>
            <p className="text-muted-foreground">
              Real-time monitoring of coastal threats using AI predictions from
              Excel data
            </p>
          </div> */}

          {/* <div className="grid grid-cols-1 gap-6">
            <div>
              <CrisisStatusDisplay
                crisisData={crisisData}
                lastUpdate={lastUpdate}
              />
            </div>
          </div> */}
          </div>
      </main>
    </div>
  );
}