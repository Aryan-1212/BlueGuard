// "use client";
// import {useState, useEffect} from 'react';
// import { Button } from './components/ui/button';
// import { Card, CardContent } from './components/ui/card';
// import { ArrowRight, Activity, Shield, AlertTriangle, TrendingUp, Waves, MapPin } from 'lucide-react';
// import Link from 'next/link';

// const page = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);
//   const features = [
//     {
//       icon: <Activity className="h-6 w-6" />,
//       title: "Sensor Data Integration",
//       description: "Collects data from tide gauges, weather stations, satellite feeds, and historical records."
//     },
//     {
//       icon: <TrendingUp className="h-6 w-6" />,
//       title: "AI/ML Threat Detection",
//       description: "Analyses trends and detects anomalies or patterns indicating threats like rising sea levels, algal blooms, illegal dumping, or cyclonic activity."
//     },
//     {
//       icon: <AlertTriangle className="h-6 w-6" />,
//       title: "Early Warning & Alerts",
//       description: "Disseminates actionable alerts via SMS, app notifications, and web dashboards to authorities and communities."
//     },
//     {
//       icon: <Shield className="h-6 w-6" />,
//       title: "Blue Carbon Protection",
//       description: "Preserves essential blue carbon habitats from avoidable degradation."
//     },
//     {
//       icon: <MapPin className="h-6 w-6" />,
//       title: "User-Focused Design",
//       description: "Built for disaster management, city governments, NGOs, fisherfolk, and civil defence teams."
//     }
//   ];

//   const stats = [
//     { number: "24/7", label: "Live Monitoring", status: "success" },
//     { number: "100+", label: "Sensors Integrated", status: "success" },
//     { number: "5+", label: "Threat Types Detected", status: "success" },
//     { number: "10+", label: "Communities Protected", status: "success" }
//   ];

//   return (
//   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-100 overflow-hidden">
//       {/* Hero & Stats Section */}
//       <section className="relative">
//         <div className="container mx-auto px-6 py-20 lg:py-28">
//           <div className={`flex flex-col items-center justify-center mb-8 transition-all duration-1000 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
//             <h1 className="text-4xl lg:text-6xl font-bold text-blue-700 drop-shadow-lg mb-2">
//               Coastal Threat Alert System
//             </h1>
//             <p className="text-lg text-cyan-700 text-center mb-4 max-w-2xl">
//               Comprehensive early warning and alerting platform for coastal areas, integrating sensor and satellite data, powered by AI/ML for threat detection and actionable alerts.
//             </p>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
//             {stats.map((stat, index) => (
//               <Card 
//                 key={index} 
//                 className={`bg-white border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-float ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
//                 style={{ 
//                   animationDelay: `${600 + index * 150}ms`,
//                   animationFillMode: 'both'
//                 }}
//               >
//                 <CardContent className="p-4 text-center">
//                   <div className="flex items-center justify-center gap-2 mb-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-glow"></div>
//                     <div className="text-xl font-bold text-blue-700">{stat.number}</div>
//                   </div>
//                   <div className="text-sm text-cyan-700">{stat.label}</div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Impact Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-6">
//           <div className="max-w-4xl mx-auto text-center animate-fade-in">
//             <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-800">
//               Impact & Benefits
//             </h2>
//             <ul className="text-lg text-cyan-800 max-w-2xl mx-auto list-disc list-inside space-y-4">
//               <li>Protects human lives and reduces economic losses by enabling timely interventions.</li>
//               <li>Preserves essential blue carbon habitats from avoidable degradation.</li>
//               <li>Supports sustainable coastal management and community resilience.</li>
//             </ul>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-blue-50">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-12 animate-fade-in">
//             <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-800">
//               Key Features
//             </h2>
//             <p className="text-lg text-cyan-800 max-w-2xl mx-auto">
//               The platform integrates multi-source data, leverages AI/ML for threat detection, and delivers timely alerts to protect coastal communities and habitats.
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
//             {features.map((feature, index) => (
//               <Card 
//                 key={index} 
//                 className={`bg-white border border-blue-100 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-slide-up`}
//                 style={{ 
//                   animationDelay: `${index * 100}ms`,
//                   animationFillMode: 'both'
//                 }}
//               >
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="text-blue-600 group-hover:text-cyan-500 transition-colors duration-300 group-hover:scale-110">
//                       {feature.icon}
//                     </div>
//                     <h3 className="text-lg font-semibold text-blue-700 group-hover:text-cyan-700 transition-colors duration-300">{feature.title}</h3>
//                   </div>
//                   <p className="text-cyan-700 text-sm leading-relaxed">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Call to Action Section */}
//       <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
//         <div className="container mx-auto px-6 text-center relative">
//           <div className="max-w-3xl mx-auto animate-scale-in">
//             <h2 className="text-3xl lg:text-4xl font-bold mb-4">
//               Get Started
//             </h2>
//             <p className="text-lg mb-8 opacity-90">
//               Empower your organization or community with real-time coastal threat alerts and actionable insights.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/login" variant="secondary" size="lg" className="bg-white px-4 py-2 rounded text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all duration-300 hover:shadow-lg">
//                 Start Now
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-8 bg-blue-100 border-t">
//         <div className="container mx-auto px-6">
//           <div className="text-center animate-fade-in">
//             <h3 className="text-xl font-bold text-blue-700 mb-2">Coastal Threat Alert System</h3>
//             <p className="text-blue-700 text-sm mb-4">
//               Protecting coastal communities and habitats with real-time intelligence and alerts.
//             </p>
//             {/* <div className="flex justify-center space-x-6 text-sm">
//               {["Documentation", "API Reference", "Support", "Status"].map((link, index) => (
//                 <a 
//                   key={index}
//                   href="#" 
//                   className="text-blue-600 hover:text-blue-800 transition-all duration-300 hover:scale-105"
//                   style={{ animationDelay: `${index * 50}ms` }}
//                 >
//                   {link}
//                 </a>
//               ))}
//             </div> */}
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default page;



"use client"

import React from "react"

import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Shield, Waves, AlertTriangle, Satellite, Map, Activity, Bell, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { cn } from "./components/lib/utils"


// Colors used (4 total):
// 1) Blue (primary)  2) Cyan (accent)  3) White (neutral)  4) Slate (neutral)

function SectionHeading(props) {
  const { eyebrow, title, align = "left" } = props;
  return (
    <div className={cn("mb-6", align === "center" && "text-center")}>
      {eyebrow ? (
        <p
          className={cn(
            "text-sm font-medium text-blue-600",
            align === "center" && "justify-center",
            "flex items-center gap-2",
          )}
        >
          <span className="inline-block h-1 w-8 rounded bg-cyan-500" aria-hidden />
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-2 text-pretty text-2xl font-semibold tracking-tight text-slate-900",
          align === "center" && "mx-auto max-w-xl",
        )}
      >
        {title}
      </h2>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <Card className="group border-white/30 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-md border border-white/40 bg-white/70 p-2 text-blue-600 shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="mt-0.5 text-lg font-semibold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}) {
  return (
    <Card className="group relative transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-1 rounded-t bg-cyan-500" aria-hidden />
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md border border-white/40 bg-white p-2 text-blue-600 shadow-sm">
            {icon}
          </div>
          <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-5 pt-0">
        <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
      </CardContent>
    </Card>
  )
}

function ImpactItem(props) {
  const { children } = props;
  return (
    <li className="flex items-start gap-3 rounded-lg border border-white/30 bg-white/60 p-4 leading-relaxed text-slate-700 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <span className="mt-0.5 text-blue-600" aria-hidden>
        <CheckCircle2 className="h-5 w-5" />
      </span>
      <span>{children}</span>
    </li>
  )
}

export default function Page() {
  return (
    <main className="bg-background">

      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-blue-600">Early warnings that save lives</p>
              <h1 className="mt-2 text-pretty text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Real-time alerts for coastal storms, surges, and floods
              </h1>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate-600">
                Monitor changing conditions, receive timely notifications, and coordinate responses with a single,
                easy-to-use dashboard designed for coastal communities and responders.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="shadow-sm">
                  <Link href="/login">Get started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-300 text-slate-800 hover:text-blue-700 bg-transparent"
                >
                  <Link href="#features">See features</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-6 -z-10 rounded-2xl border border-blue-100 shadow-sm"
                aria-hidden
              />
              <Card className="border-white/30 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    <Bell className="h-5 w-5 text-blue-600" aria-hidden />
                    Live Alert Panel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-md border border-white/40 bg-white p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-600" aria-hidden />
                      <span className="font-medium text-slate-900">Storm Surge Risk</span>
                    </div>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">High</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-white/40 bg-white p-3">
                    <div className="flex items-center gap-2">
                      <Waves className="h-4 w-4 text-blue-600" aria-hidden />
                      <span className="font-medium text-slate-900">Wave Height</span>
                    </div>
                    <span className="text-slate-700">3.4 m</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-white/40 bg-white p-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" aria-hidden />
                      <span className="font-medium text-slate-900">Wind Speed</span>
                    </div>
                    <span className="text-slate-700">52 km/h</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<Satellite />} label="Data sources" value="15+" />
            <StatCard icon={<Map />} label="Coastlines covered" value="2,400 km" />
            <StatCard icon={<Activity />} label="Avg. update interval" value="2 min" />
            <StatCard icon={<Bell />} label="Alerts delivered" value="120k+" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading eyebrow="Capabilities" title="Key features that accelerate response" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Satellite />}
              title="Multi-source ingestion"
              desc="Combine satellite feeds, buoys, and weather models into a single coherent picture of coastal conditions."
            />
            <FeatureCard
              icon={<AlertTriangle />}
              title="Smart alerting"
              desc="Get notified at the right time with thresholds tuned to local risk profiles and historical patterns."
            />
            <FeatureCard
              icon={<Map />}
              title="Risk mapping"
              desc="Visualize impacts at the neighborhood level to plan evacuations and resource staging."
            />
            <FeatureCard
              icon={<Waves />}
              title="Tide & surge"
              desc="Track tide cycles, storm surge potential, and wave energy in real time."
            />
            <FeatureCard
              icon={<Activity />}
              title="Wind & pressure"
              desc="Monitor rapid changes in wind and pressure to detect intensifying systems early."
            />
            <FeatureCard
              icon={<Shield />}
              title="Role-based access"
              desc="Keep sensitive operations secure with roles for public info, responders, and administrators."
            />
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading eyebrow="Outcomes" title="Impact and community benefits" />
          <ul className="grid gap-3 sm:grid-cols-2">
            <ImpactItem>Faster decision-making with a single, reliable source of truth.</ImpactItem>
            <ImpactItem>Reduced false alarms through locally tuned thresholds and validation.</ImpactItem>
            <ImpactItem>Better coordination across agencies and community stakeholders.</ImpactItem>
            <ImpactItem>Increased public trust via transparent, timely updates.</ImpactItem>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-blue-600">
        <div className="mx-auto max-w-6xl px-4 py-12 text-white">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-pretty text-xl font-semibold">Be ready before the next storm hits</h3>
              <p className="mt-1 text-sm text-blue-50">
                Set up notifications, onboard your team, and activate alerting in minutes.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
                <Link href="/login">Launch dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-blue-700 bg-transparent">
                <Link href="#features">Explore features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
          <p>© {new Date().getFullYear()} Coastal Threat Alert. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
