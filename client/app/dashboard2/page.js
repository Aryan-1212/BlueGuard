"use client";
import { useState, useEffect } from "react";
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
  ShieldCheck
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { AnimatedCounter } from "./ui/animated-counter";
import { GlassCard } from "./ui/glass-card";
import EnhancedSeaLevelChart from "./charts/EnhancedSeaLevelChart.jsx";
import RiskGaugeChart from "./charts/RiskGaugeChart.jsx";
import EnvironmentalChart from "./charts/EnvironmentalChart.jsx";
import CrisisMonitoringControls from "./components/CrisisMonitoringControls";
import CrisisStatusDisplay from "./components/CrisisStatusDisplay";
import { useCrisisMonitoring } from "./hooks/useCrisisMonitoring";

// Dashboard data and alert structures defined inline

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedView, setSelectedView] = useState('combined');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
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
    stopMonitoring
  } = useCrisisMonitoring();
  
  // Sample real-time data
  const [dashboardData, setDashboardData] = useState({
    timestamp: new Date().toISOString(),
    sea_level: 1.85,
    wave_height: 2.3,
    wind_speed: 28.5,
    rainfall: 45.2,
    alert_level: "MODERATE",
    population_exposed: 15420,
    ai_confidence: 89,
    storm_surge_risk: 68,
    coastal_erosion_risk: 72,
    water_quality_risk: 31
  });

  // Time range datasets
  const timeRangeData = {
    '24h': {
      seaLevel: [
        { time: '00:00', actual: 1.82, predicted: null },
        { time: '04:00', actual: 1.84, predicted: null },
        { time: '08:00', actual: 1.86, predicted: null },
        { time: '12:00', actual: 1.88, predicted: null },
        { time: '16:00', actual: 1.87, predicted: 1.89 },
        { time: '20:00', actual: null, predicted: 1.91 },
        { time: '24:00', actual: null, predicted: 1.93 }
      ],
      environmental: [
        { time: "00:00", wave_height: 2.1, wind_speed: 25.0, rainfall: 0 },
        { time: "04:00", wave_height: 2.2, wind_speed: 26.5, rainfall: 12.5 },
        { time: "08:00", wave_height: 2.3, wind_speed: 27.8, rainfall: 28.0 },
        { time: "12:00", wave_height: 2.4, wind_speed: 28.5, rainfall: 45.2 },
        { time: "16:00", wave_height: 2.3, wind_speed: 28.0, rainfall: 38.7 },
        { time: "20:00", wave_height: 2.2, wind_speed: 27.2, rainfall: 22.1 },
        { time: "24:00", wave_height: 2.1, wind_speed: 26.8, rainfall: 15.3 }
      ]
    },
    '7d': {
      seaLevel: [
        { time: 'Mon', actual: 1.78, predicted: null },
        { time: 'Tue', actual: 1.80, predicted: null },
        { time: 'Wed', actual: 1.85, predicted: null },
        { time: 'Thu', actual: 1.88, predicted: null },
        { time: 'Fri', actual: 1.87, predicted: 1.91 },
        { time: 'Sat', actual: null, predicted: 1.93 },
        { time: 'Sun', actual: null, predicted: 1.95 }
      ],
      environmental: [
        { time: "Mon", wave_height: 1.8, wind_speed: 22.0, rainfall: 5.2 },
        { time: "Tue", wave_height: 2.0, wind_speed: 24.5, rainfall: 8.7 },
        { time: "Wed", wave_height: 2.3, wind_speed: 27.8, rainfall: 15.3 },
        { time: "Thu", wave_height: 2.6, wind_speed: 30.2, rainfall: 32.1 },
        { time: "Fri", wave_height: 2.4, wind_speed: 28.9, rainfall: 45.2 },
        { time: "Sat", wave_height: 2.2, wind_speed: 26.5, rainfall: 28.8 },
        { time: "Sun", wave_height: 2.1, wind_speed: 25.1, rainfall: 18.9 }
      ]
    },
    '30d': {
      seaLevel: [
        { time: 'Week 1', actual: 1.75, predicted: null },
        { time: 'Week 2', actual: 1.78, predicted: null },
        { time: 'Week 3', actual: 1.82, predicted: null },
        { time: 'Week 4', actual: 1.85, predicted: 1.89 },
        { time: 'Week 5', actual: null, predicted: 1.92 }
      ],
      environmental: [
        { time: "Week 1", wave_height: 1.9, wind_speed: 23.5, rainfall: 125.3 },
        { time: "Week 2", wave_height: 2.1, wind_speed: 25.8, rainfall: 89.7 },
        { time: "Week 3", wave_height: 2.3, wind_speed: 27.2, rainfall: 156.8 },
        { time: "Week 4", wave_height: 2.4, wind_speed: 28.9, rainfall: 198.4 },
        { time: "Week 5", wave_height: 2.2, wind_speed: 26.7, rainfall: 112.5 }
      ]
    },
    '90d': {
      seaLevel: [
        { time: 'Month 1', actual: 1.70, predicted: null },
        { time: 'Month 2', actual: 1.75, predicted: null },
        { time: 'Month 3', actual: 1.85, predicted: 1.92 }
      ],
      environmental: [
        { time: "Month 1", wave_height: 1.8, wind_speed: 24.2, rainfall: 89.5 },
        { time: "Month 2", wave_height: 2.1, wind_speed: 26.8, rainfall: 145.3 },
        { time: "Month 3", wave_height: 2.4, wind_speed: 28.5, rainfall: 187.6 }
      ]
    }
  };

  const [alerts] = useState([
    {
      id: "1",
      type: "CRITICAL",
      title: "High Sea Level Alert",
      message: "Sea level 15cm above normal threshold detected",
      timestamp: "14:32",
      station: "COAST-001"
    },
    {
      id: "2", 
      type: "MODERATE",
      title: "Wave Height Warning",
      message: "Increased wave activity detected near fishing areas",
      timestamp: "14:28",
      station: "COAST-002"
    },
    {
      id: "3",
      type: "INFO",
      title: "System Update",
      message: "AI model updated with latest satellite data",
      timestamp: "14:15",
      station: "System"
    }
  ]);

  // Get current dataset based on selected time range
  const currentSeaLevelData = timeRangeData[selectedTimeRange].seaLevel;
  const currentEnvironmentalData = timeRangeData[selectedTimeRange].environmental;

  // Handle time range change with loading state
  const handleTimeRangeChange = async (range) => {
    if (range === selectedTimeRange) return;
    
    setIsLoadingTimeRange(true);
    
    // Simulate API call delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSelectedTimeRange(range);
    
    // Simulate updated metrics based on time range
    const baseData = {
      '24h': { 
        sea_level: 1.85, 
        wave_height: 2.3, 
        wind_speed: 28.5, 
        rainfall: 45.2,
        storm_surge_risk: 68,
        coastal_erosion_risk: 72,
        water_quality_risk: 31
      },
      '7d': { 
        sea_level: 1.83, 
        wave_height: 2.2, 
        wind_speed: 26.8, 
        rainfall: 156.8,
        storm_surge_risk: 65,
        coastal_erosion_risk: 69,
        water_quality_risk: 28
      },
      '30d': { 
        sea_level: 1.80, 
        wave_height: 2.1, 
        wind_speed: 25.5, 
        rainfall: 512.3,
        storm_surge_risk: 58,
        coastal_erosion_risk: 63,
        water_quality_risk: 35
      },
      '90d': { 
        sea_level: 1.78, 
        wave_height: 2.0, 
        wind_speed: 24.8, 
        rainfall: 1423.7,
        storm_surge_risk: 52,
        coastal_erosion_risk: 58,
        water_quality_risk: 42
      }
    };
    
    const rangeData = baseData[range];
    setDashboardData(prev => ({
      ...prev,
      ...rangeData,
      timestamp: new Date().toISOString()
    }));
    
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
        
        const googleResponse = await fetch("http://localhost:5000/api/auth/google/status", {
          credentials: "include",
        });
        
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

  // Simulate real-time data updates - only update every 30 seconds to reduce re-renders
  useEffect(() => {
    const timer = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        sea_level: 1.80 + Math.random() * 0.1,
        wave_height: 2.20 + Math.random() * 0.2,
        wind_speed: 25 + Math.random() * 8,
        rainfall: 40 + Math.random() * 15,
        timestamp: new Date().toISOString()
      }));
    }, 30000); // Changed from 10000 to 30000 (30 seconds)
    return () => clearInterval(timer);
  }, []);

  const getAlertColor = (level) => {
    switch (level) {
      case "LOW": return "bg-green-100 text-green-800 border-green-200";
      case "MODERATE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "HIGH": return "bg-red-100 text-red-800 border-red-200";
      case "CRITICAL": return "bg-red-200 text-red-900 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAlertTypeColor = (type) => {
    switch (type) {
      case "CRITICAL": return "bg-red-50 border-red-200";
      case "MODERATE": return "bg-yellow-50 border-yellow-200";
      case "INFO": return "bg-blue-50 border-blue-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "CRITICAL": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "MODERATE": return <Activity className="w-4 h-4 text-yellow-600" />;
      case "INFO": return <Info className="w-4 h-4 text-blue-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Redirecting to login...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50" data-testid="dashboard-page">
      {/* Enhanced Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50" data-testid="dashboard-header">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Waves className="w-8 h-8 text-primary animate-float" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    BlueGuard
                  </h1>
                  <p className="text-sm text-muted-foreground">Advanced Coastal Threat Monitoring</p>
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
                  <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                <span className="text-sm font-medium text-foreground">Live Data</span>
              </div>
              
              {/* System Status */}
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold text-foreground" data-testid="last-updated">
                  {currentTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8" data-testid="dashboard-main">
        
        {/* Enhanced Time Range Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-foreground">Dashboard Overview</h2>
            <div className="flex items-center space-x-2 bg-card rounded-lg p-1 shadow-sm border border-border">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTimeRangeChange(range)}
                  className={`transition-all duration-300 relative ${
                    selectedTimeRange === range ? 'scale-105 shadow-md' : 'hover:scale-102'
                  }`}
                  disabled={isLoadingTimeRange}
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
            </div>
            {isLoadingTimeRange && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading data...</span>
              </div>
            )}
          </div>
          
          {/* Alert Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="threat-indicator w-12 h-12">
              <div className="threat-indicator-inner">
                <span className="text-xs font-bold text-orange-600">MOD</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Current Threat Level</p>
              <p className="text-xs text-muted-foreground">{dashboardData.alert_level}</p>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ${isLoadingTimeRange ? 'opacity-75 scale-[0.98]' : 'opacity-100 scale-100'}`} data-testid="kpi-cards">
          {/* Sea Level Card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sea Level</p>
                <p className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={dashboardData.sea_level} decimals={2} />m
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500 font-medium">+0.15m</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Waves className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" style={{width: '72%'}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">72% of danger threshold</p>
          </GlassCard>

          {/* Wave Height Card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wave Height</p>
                <p className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={dashboardData.wave_height} decimals={1} />m
                </p>
                <div className="flex items-center mt-1">
                  <Activity className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-500 font-medium">Increasing</span>
                </div>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-cyan-600" />
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000" style={{width: '58%'}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">58% of max recorded</p>
          </GlassCard>

          {/* Wind Speed Card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wind Speed</p>
                <p className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={dashboardData.wind_speed} decimals={1} />
                  <span className="text-base"> km/h</span>
                </p>
                <div className="flex items-center mt-1">
                  <Wind className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">Gusting</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg relative">
                <Wind className="w-8 h-8 text-green-600 animate-pulse" />
                <div className="particle" style={{top: '10px', left: '5px', animationDelay: '0s'}}></div>
                <div className="particle" style={{top: '20px', left: '15px', animationDelay: '0.5s'}}></div>
                <div className="particle" style={{top: '30px', left: '25px', animationDelay: '1s'}}></div>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000" style={{width: '45%'}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">45% of storm threshold</p>
          </GlassCard>

          {/* Rainfall Card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rainfall</p>
                <p className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={dashboardData.rainfall} decimals={1} />
                  <span className="text-base">mm</span>
                </p>
                <div className="flex items-center mt-1">
                  <Droplets className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-500 font-medium">Last 24h</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Droplets className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000" style={{width: '67%'}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">67% of monthly average</p>
          </GlassCard>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Enhanced Sea Level Chart */}
            <Card className="chart-container shadow-lg border border-border" data-testid="sea-level-chart-container">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Sea Level Monitoring</h3>
                    <p className="text-sm text-muted-foreground">Real-time measurements with AI predictions</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">Actual</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">Predicted</span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className={`h-80 transition-opacity duration-500 ${isLoadingTimeRange ? 'opacity-50' : 'opacity-100'}`}>
                  <EnhancedSeaLevelChart data={currentSeaLevelData} width={600} height={320} />
                </div>
              </CardContent>
            </Card>

            {/* Environmental Parameters Chart */}
            <Card className="chart-container shadow-lg border border-border" data-testid="environmental-chart-container">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Environmental Parameters</h3>
                    <p className="text-sm text-muted-foreground">Multi-sensor data correlation</p>
                  </div>
                  <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={selectedView === 'combined' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedView('combined')}
                      data-testid="view-combined"
                    >
                      Combined
                    </Button>
                    <Button
                      variant={selectedView === 'individual' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedView('individual')}
                      data-testid="view-individual"
                    >
                      Individual
                    </Button>
                  </div>
                </div>
                <div className={`h-80 transition-opacity duration-500 ${isLoadingTimeRange ? 'opacity-50' : 'opacity-100'}`}>
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
            <Card className="chart-container shadow-lg border border-border" data-testid="risk-gauge-container">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Threat Assessment</h3>
                    <p className="text-sm text-muted-foreground">AI-powered risk analysis</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Systems Normal</span>
                  </div>
                </div>
                
                <div className={`h-64 flex items-center justify-center transition-opacity duration-500 ${isLoadingTimeRange ? 'opacity-50' : 'opacity-100'}`}>
                  <RiskGaugeChart value={dashboardData.storm_surge_risk} />
                </div>

                {/* Risk Breakdown */}
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Storm Surge</span>
                    </div>
                    <span className="text-sm font-semibold text-red-600">{dashboardData.storm_surge_risk}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">Coastal Erosion</span>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">{dashboardData.coastal_erosion_risk}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Water Quality</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{dashboardData.water_quality_risk}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Alerts Panel */}
            <Card className="chart-container shadow-lg border border-border" data-testid="alerts-panel">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Active Alerts</h3>
                    <p className="text-sm text-muted-foreground">System notifications & warnings</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-red-600">{alerts.length} Active</span>
                  </div>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {alerts.map((alert, index) => (
                    <div key={alert.id} className={`relative p-4 border rounded-lg ${getAlertTypeColor(alert.type)}`}>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-opacity-50 rounded-full flex items-center justify-center">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-xs mt-1 opacity-75">{alert.message}</p>
                          <p className="text-xs mt-2 opacity-60">{alert.timestamp} • {alert.station}</p>
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

                {/* Alert Actions */}
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
                  <Button className="flex-1" data-testid="view-all-alerts">
                    View All Alerts
                  </Button>
                  <Button variant="outline" size="icon" data-testid="alert-settings">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Monitoring Stations Map Preview */}
            <Card className="chart-container shadow-lg border border-border" data-testid="stations-map">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Station Network</h3>
                    <p className="text-sm text-muted-foreground">Coastal monitoring stations</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">12 Online</span>
                  </div>
                </div>

                {/* Simple map representation */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
                    <defs>
                      <pattern id="waves" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                        <path d="M0,5 Q5,0 10,5 T20,5" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.5"/>
                      </pattern>
                    </defs>
                    {/* Water */}
                    <rect x="0" y="0" width="300" height="120" fill="url(#waves)"/>
                    {/* Land */}
                    <path d="M0,120 Q50,110 100,120 T200,115 T300,120 L300,200 L0,200 Z" fill="#10b981" opacity="0.3"/>
                    
                    {/* Station markers */}
                    <g className="stations">
                      <circle cx="80" cy="100" r="4" fill="#ef4444" className="animate-pulse">
                        <title>COAST-001 - Critical Alert</title>
                      </circle>
                      <circle cx="150" cy="95" r="4" fill="#eab308" className="animate-pulse" style={{animationDelay: '0.5s'}}>
                        <title>COAST-002 - Moderate Alert</title>
                      </circle>
                      <circle cx="220" cy="105" r="4" fill="#10b981" className="animate-pulse" style={{animationDelay: '1s'}}>
                        <title>COAST-003 - Normal</title>
                      </circle>
                      <circle cx="50" cy="110" r="3" fill="#10b981" className="animate-pulse" style={{animationDelay: '1.5s'}}>
                        <title>COAST-004 - Normal</title>
                      </circle>
                      <circle cx="270" cy="100" r="3" fill="#10b981" className="animate-pulse" style={{animationDelay: '2s'}}>
                        <title>COAST-005 - Normal</title>
                      </circle>
                    </g>
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-foreground">Critical</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-foreground">Warning</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-foreground">Normal</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4" variant="outline" data-testid="open-full-map">
                  <MapPin className="w-4 h-4 mr-2" />
                  Open Full Map View
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* System Performance and Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="bottom-metrics">
          
          {/* System Performance */}
          <Card className="shadow-lg border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">System Health</h3>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">AI Confidence</span>
                    <span className="font-medium text-foreground">{dashboardData.ai_confidence}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{width: `${dashboardData.ai_confidence}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Data Quality</span>
                    <span className="font-medium text-foreground">94%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{width: '94%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Network Status</span>
                    <span className="font-medium text-foreground">96%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full transition-all duration-1000" style={{width: '96%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Population Impact */}
          <Card className="shadow-lg border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Population Impact</h3>
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    <AnimatedCounter end={dashboardData.population_exposed} />
                  </p>
                  <p className="text-sm text-muted-foreground">People in Risk Zone</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xl font-semibold text-foreground">
                      <AnimatedCounter end={1240} />
                    </p>
                    <p className="text-xs text-muted-foreground">Fishermen</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-foreground">
                      <AnimatedCounter end={890} />
                    </p>
                    <p className="text-xs text-muted-foreground">Vessels</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card className="shadow-lg border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Environmental Impact</h3>
                <Leaf className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Blue Carbon Loss</p>
                  <p className="text-2xl font-bold text-red-600">
                    <AnimatedCounter end={12.5} decimals={1} /> tons CO₂
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">24.8°C</p>
                    <p className="text-xs text-muted-foreground">Sea Temp</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">0.85</p>
                    <p className="text-xs text-muted-foreground">Chlorophyll</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crisis Monitoring Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">🚨 Crisis Monitoring System</h2>
            <p className="text-muted-foreground">
              Real-time monitoring of coastal threats using AI predictions from Excel data
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Crisis Monitoring Controls */}
            <div className="lg:col-span-1">
              <CrisisMonitoringControls
                isMonitoring={isMonitoring}
                onStart={startMonitoring}
                onStop={stopMonitoring}
                loading={crisisLoading}
                error={crisisError}
              />
            </div>
            
            {/* Crisis Status Display */}
            <div className="lg:col-span-2">
              <CrisisStatusDisplay
                crisisData={crisisData}
                lastUpdate={lastUpdate}
              />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
