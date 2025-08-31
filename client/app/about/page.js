"use client";
import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { 
  Shield, 
  Users, 
  Globe, 
  Target, 
  Award, 
  Lightbulb, 
  Heart, 
  Zap,
  CheckCircle,
  ArrowRight,
  MapPin,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const mission = {
    title: "Our Mission",
    description: "To protect coastal communities and ecosystems through intelligent, real-time threat detection and early warning systems, leveraging cutting-edge AI/ML technology to create a safer, more resilient coastal environment.",
    icon: <Shield className="h-8 w-8 text-blue-600" />
  };

  const vision = {
    title: "Our Vision",
    description: "A world where coastal communities are protected from environmental threats through proactive, intelligent monitoring systems that enable timely response and minimize damage to both human life and natural habitats.",
    icon: <Globe className="h-8 w-8 text-cyan-600" />
  };

  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Community First",
      description: "We prioritize the safety and well-being of coastal communities above all else."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible with AI/ML technology."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Reliability",
      description: "We maintain the highest standards of accuracy and dependability in our systems."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaboration",
      description: "We work closely with governments, NGOs, and local communities to achieve our goals."
    }
  ];

  const team = [
    {
      name: "Krish Shah",
      role: "Web Developer",
      expertise: "Frontend development, React, Next.js",
      avatar: "💻"
    },
    {
      name: "Aryan parvani",
      role: "Web Developer",
      expertise: "Frontend development, UI/UX design",
      avatar: "💻"
    },
    {
      name: "Arjun jani",
      role: "AI Engineer",
      expertise: "Machine learning, data science, AI model deployment",
      avatar: "🤖"
    },
    {
      name: "Tirth vyas",
      role: "AI/Web Developer",
      expertise: "Full-stack development, AI integration, cloud platforms",
      avatar: "👨‍💻"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Project Inception",
      description: "Initial research and development of coastal threat detection algorithms"
    },
    {
      year: "2024",
      title: "First Prototype",
      description: "Successfully deployed first working prototype in coastal community"
    },
    {
      year: "2025",
      title: "Full Deployment",
      description: "Complete system deployment across multiple coastal regions"
    },
    {
      year: "2026",
      title: "Global Expansion",
      description: "Expanding to international coastal communities and regions"
    }
  ];

  const technologies = [
    {
      category: "Artificial Intelligence",
      items: ["Machine Learning Models", "Deep Learning Algorithms", "Predictive Analytics", "Anomaly Detection"]
    },
    {
      category: "Data Processing",
      items: ["Real-time Stream Processing", "Big Data Analytics", "IoT Integration", "Satellite Data Processing"]
    },
    {
      category: "Infrastructure",
      items: ["Cloud Computing", "Edge Computing", "Microservices Architecture", "Real-time APIs"]
    },
    {
      category: "Environmental Monitoring",
      items: ["Sensor Networks", "Satellite Imagery", "Weather Data Integration", "Oceanographic Models"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-6 py-20 lg:py-28">
          <div className={`flex flex-col items-center justify-center mb-8 transition-all duration-1000 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl lg:text-6xl font-bold text-blue-700 drop-shadow-lg mb-4 text-center">
              About BlueGuard
            </h1>
            <p className="text-xl text-cyan-700 text-center mb-6 max-w-3xl">
              Pioneering the future of coastal protection through intelligent monitoring, 
              AI-powered threat detection, and community-focused early warning systems.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard2">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  Try Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/home">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className={`animate-slide-up ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  {mission.icon}
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-4">{mission.title}</h3>
                <p className="text-cyan-700 leading-relaxed">{mission.description}</p>
              </CardContent>
            </Card>
            
            <Card className={`animate-slide-up ${isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  {vision.icon}
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-4">{vision.title}</h3>
                <p className="text-cyan-700 leading-relaxed">{vision.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-800">
              Our Core Values
            </h2>
            <p className="text-lg text-cyan-800 max-w-2xl mx-auto">
              The principles that guide our mission and shape our approach to coastal protection.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className={`group animate-slide-up`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CardContent className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="text-blue-600 group-hover:text-cyan-500 transition-colors duration-300 group-hover:scale-110">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-700 group-hover:text-cyan-700 transition-colors duration-300 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-cyan-700 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-800">
              Meet Our Team
            </h2>
            <p className="text-lg text-cyan-800 max-w-2xl mx-auto">
              Dedicated experts working together to revolutionize coastal protection through technology and innovation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className={`group animate-slide-up`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CardContent className="text-center">
                  <div className="text-4xl mb-3">{member.avatar}</div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-1">{member.name}</h3>
                  <p className="text-sm font-medium text-cyan-600 mb-2">{member.role}</p>
                  <p className="text-xs text-cyan-700 leading-relaxed">{member.expertise}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-800">
              Technology Stack
            </h2>
            <p className="text-lg text-cyan-800 max-w-2xl mx-auto">
              Cutting-edge technologies powering our coastal protection platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {technologies.map((tech, index) => (
              <Card 
                key={index} 
                className={`group animate-slide-up`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CardContent>
                  <h3 className="text-lg font-semibold text-blue-700 mb-3 text-center">{tech.category}</h3>
                  <ul className="space-y-2">
                    {tech.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-sm text-cyan-700">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
     

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-3xl mx-auto animate-scale-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Join Us in Protecting Our Coasts
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Whether you're a coastal community, government agency, or environmental organization, 
              we're here to help you build a safer, more resilient future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard2">
                <Button variant="secondary" size="lg" className="bg-white px-6 py-3 rounded-lg text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  Explore Dashboard
                </Button>
              </Link>
              <Link href="/ai">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700 px-6 py-3 rounded-lg transition-all duration-300">
                  Try AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-blue-100 border-t">
        <div className="container mx-auto px-6">
          <div className="text-center animate-fade-in">
            <h3 className="text-xl font-bold text-blue-700 mb-2">BlueGuard</h3>
            <p className="text-blue-700 text-sm mb-4">
              Protecting coastal communities through intelligent monitoring and early warning systems.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/home" className="text-blue-600 hover:text-blue-800 transition-all duration-300 hover:scale-105">
                Home
              </Link>
              <Link href="/dashboard2" className="text-blue-600 hover:text-blue-800 transition-all duration-300 hover:scale-105">
                Dashboard
              </Link>
              <Link href="/ai" className="text-blue-600 hover:text-blue-800 transition-all duration-300 hover:scale-105">
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;