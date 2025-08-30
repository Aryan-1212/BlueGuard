"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  TrendingUp, 
  AlertTriangle, 
  Waves, 
  Wind, 
  Droplets, 
  Thermometer, 
  Activity,
  MapPin,
  Clock,
  Users,
  Shield,
  Target,
  Eye,
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  Gauge
} from "lucide-react";
import SeaLevelChart from "./components/SeaLevelChart";
import RiskChart from "./components/RiskChart";
import EnvironmentalChart from "./components/EnvironmentalChart";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const router = useRouter();

  // Sample environmental and coastal risk data
  const sampleData = {
    timestamp: new Date().toISOString(),
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

  // Historical data for charts
  const historicalData = [
    { time: "00:00", sea_level: 1.82, wave_height: 2.1, wind_speed: 25.0, rainfall: 0 },
    { time: "04:00", sea_level: 1.84, wave_height: 2.2, wind_speed: 26.5, rainfall: 12.5 },
    { time: "08:00", sea_level: 1.86, wave_height: 2.3, wind_speed: 27.8, rainfall: 28.0 },
    { time: "12:00", sea_level: 1.88, wave_height: 2.4, wind_speed: 28.5, rainfall: 45.2 },
    { time: "16:00", sea_level: 1.87, wave_height: 2.3, wind_speed: 28.0, rainfall: 38.7 },
    { time: "20:00", sea_level: 1.85, wave_height: 2.2, wind_speed: 27.2, rainfall: 22.1 },
    { time: "24:00", sea_level: 1.83, wave_height: 2.1, wind_speed: 26.8, rainfall: 15.3 }
  ];

  // Risk assessment data
  const riskData = [
    { name: "Storm Surge", value: 68, color: "#ef4444" },
    { name: "Coastal Erosion", value: 72, color: "#f97316" },
    { name: "Algal Bloom", value: 31, color: "#22c55e" },
    { name: "Pollution", value: 45, color: "#eab308" }
  ];

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

  const getAlertColor = (level) => {
    switch (level) {
      case "LOW": return "bg-green-100 text-green-800 border-green-200";
      case "MODERATE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "HIGH": return "bg-red-100 text-red-800 border-red-200";
      case "CRITICAL": return "bg-red-200 text-red-900 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                BlueGuard Dashboard
              </h1>
              <p className="text-gray-600 text-sm">Welcome back, {user.displayName || user.name || user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium">{new Date(sampleData.timestamp).toLocaleTimeString()}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedTimeRange === range
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sea Level</p>
                <p className="text-2xl font-bold text-gray-900">{sampleData.sea_level_m}m</p>
                <p className="text-sm text-gray-500">Anomaly: {sampleData.sea_level_anomaly_m}m</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Waves className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wave Height</p>
                <p className="text-2xl font-bold text-gray-900">{sampleData.wave_height_m}m</p>
                <p className="text-sm text-gray-500">Current conditions</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wind Speed</p>
                <p className="text-2xl font-bold text-gray-900">{sampleData.wind_speed_kmph} km/h</p>
                <p className="text-sm text-gray-500">Gusting</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Wind className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rainfall</p>
                <p className="text-2xl font-bold text-gray-900">{sampleData.rainfall_mm}mm</p>
                <p className="text-sm text-gray-500">Last 24h</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Droplets className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sea Level Trend Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sea Level Trends</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">24 Hour Trend</span>
                </div>
              </div>
              <div className="h-64">
                <SeaLevelChart data={historicalData} width={600} height={256} />
              </div>
            </div>

            {/* Environmental Parameters Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Environmental Parameters</h3>
              <div className="h-64">
                <EnvironmentalChart data={historicalData} width={600} height={256} />
              </div>
            </div>

            {/* Environmental Parameters Details */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Parameter Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Thermometer className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium">Sea Surface Temp</span>
                    </div>
                    <span className="font-semibold">{sampleData.sst_celsius}°C</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">Chlorophyll</span>
                    </div>
                    <span className="font-semibold">{sampleData.chlorophyll_mg_m3} mg/m³</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium">Turbidity</span>
                    </div>
                    <span className="font-semibold">{sampleData.turbidity_index}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium">Cyclone Distance</span>
                    </div>
                    <span className="font-semibold">{sampleData.cyclone_distance_km} km</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium">AI Confidence</span>
                    </div>
                    <span className="font-semibold">{(sampleData.ai_confidence_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm font-medium">Population Exposed</span>
                    </div>
                    <span className="font-semibold">{sampleData.population_exposed.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Risk Assessment */}
          <div className="space-y-8">
            {/* Alert Status */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Alert Status</h3>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getAlertColor(sampleData.alert_level)}`}>
                {sampleData.alert_level}
              </div>
              <p className="text-sm text-gray-600 mt-3">{sampleData.recommended_action}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Alert Sent:</span>
                  <span className="font-medium text-green-600">{sampleData.alert_sent_status}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Response Team:</span>
                  <span className="font-medium text-blue-600">{sampleData.response_team_deployed}</span>
                </div>
              </div>
            </div>

            {/* Risk Indexes Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Assessment</h3>
              <div className="h-48">
                <RiskChart data={riskData} width={300} height={192} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/ai" className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-700">AI Analysis</span>
                </Link>
                <Link href="/about" className="flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-700">Detailed Reports</span>
                </Link>
                <Link href="/" className="flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-purple-700">Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fisherfolk Activity</h3>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${sampleData.fisherfolk_activity * 100}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{(sampleData.fisherfolk_activity * 100).toFixed(0)}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Current activity level</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure Exposure</h3>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray={`${sampleData.infrastructure_exposure_index * 100}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{(sampleData.infrastructure_exposure_index * 100).toFixed(0)}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Exposure index</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Blue Carbon Loss</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{sampleData.blue_carbon_loss_ton_co2}</div>
              <p className="text-sm text-gray-600">Tons CO₂</p>
              <p className="text-xs text-gray-500 mt-1">Estimated loss</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
