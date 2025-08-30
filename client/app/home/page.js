"use client";
import {useState, useEffect} from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { ArrowRight, Activity, Shield, AlertTriangle, TrendingUp, Waves, MapPin } from 'lucide-react';
import Link from 'next/link';

const page = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  const features = [
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Sensor Data Integration",
      description: "Collects data from tide gauges, weather stations, satellite feeds, and historical records."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "AI/ML Threat Detection",
      description: "Analyses trends and detects anomalies or patterns indicating threats like rising sea levels, algal blooms, illegal dumping, or cyclonic activity."
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Early Warning & Alerts",
      description: "Disseminates actionable alerts via SMS, app notifications, and web dashboards to authorities and communities."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Blue Carbon Protection",
      description: "Preserves essential blue carbon habitats from avoidable degradation."
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "User-Focused Design",
      description: "Built for disaster management, city governments, NGOs, fisherfolk, and civil defence teams."
    }
  ];

  const stats = [
    { number: "24/7", label: "Live Monitoring", status: "success" },
    { number: "100+", label: "Sensors Integrated", status: "success" },
    { number: "5+", label: "Threat Types Detected", status: "success" },
    { number: "10+", label: "Communities Protected", status: "success" }
  ];

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-100 overflow-hidden">
      {/* Hero & Stats Section */}
      <section className="relative">
        <div className="container mx-auto px-6 py-20 lg:py-28">
          <div className={`flex flex-col items-center justify-center mb-8 transition-all duration-1000 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl lg:text-6xl font-bold text-blue-700 drop-shadow-lg mb-2">
              Coastal Threat Alert System
            </h1>
            <p className="text-lg text-cyan-700 text-center mb-4 max-w-2xl">
              Comprehensive early warning and alerting platform for coastal areas, integrating sensor and satellite data, powered by AI/ML for threat detection and actionable alerts.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className={`bg-white border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-float ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ 
                  animationDelay: `${600 + index * 150}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-glow"></div>
                    <div className="text-xl font-bold text-blue-700">{stat.number}</div>
                  </div>
                  <div className="text-sm text-cyan-700">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-800">
              Impact & Benefits
            </h2>
            <ul className="text-lg text-cyan-800 max-w-2xl mx-auto list-disc list-inside space-y-4">
              <li>Protects human lives and reduces economic losses by enabling timely interventions.</li>
              <li>Preserves essential blue carbon habitats from avoidable degradation.</li>
              <li>Supports sustainable coastal management and community resilience.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-800">
              Key Features
            </h2>
            <p className="text-lg text-cyan-800 max-w-2xl mx-auto">
              The platform integrates multi-source data, leverages AI/ML for threat detection, and delivers timely alerts to protect coastal communities and habitats.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`bg-white border border-blue-100 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-slide-up`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-blue-600 group-hover:text-cyan-500 transition-colors duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-blue-700 group-hover:text-cyan-700 transition-colors duration-300">{feature.title}</h3>
                  </div>
                  <p className="text-cyan-700 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-3xl mx-auto animate-scale-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Get Started
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Empower your organization or community with real-time coastal threat alerts and actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" variant="secondary" size="lg" className="bg-white px-4 py-2 rounded text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-blue-100 border-t">
        <div className="container mx-auto px-6">
          <div className="text-center animate-fade-in">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Coastal Threat Alert System</h3>
            <p className="text-blue-700 text-sm mb-4">
              Protecting coastal communities and habitats with real-time intelligence and alerts.
            </p>
            {/* <div className="flex justify-center space-x-6 text-sm">
              {["Documentation", "API Reference", "Support", "Status"].map((link, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="text-blue-600 hover:text-blue-800 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link}
                </a>
              ))}
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default page;