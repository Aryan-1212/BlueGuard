"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if user has JWT token
        const token = localStorage.getItem("token");
        
        if (token) {
          // Try JWT authentication
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
        
        // If JWT fails, check Google OAuth session
        const googleResponse = await fetch("http://localhost:5000/api/auth/google/status", {
          credentials: "include",
        });
        
        if (googleResponse.ok) {
          const googleData = await googleResponse.json();
          if (googleData.authenticated && googleData.user) {
            setUser(googleData.user);
            // Store a flag for Google OAuth user
            localStorage.setItem("Gtoken", "google_authenticated");
            setLoading(false);
            return;
          }
        }
        
        // If both fail, redirect to login
        router.push("/login");
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">Redirecting to login...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user.displayName || user.name || user.email} 👋
      </h1>

      <p className="text-gray-600 mb-10">Here's a quick overview of your account.</p>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-lg font-semibold mb-3">Profile</h2>
          <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
          {localStorage.getItem("Gtoken") && (
            <p className="text-gray-700"><strong>Login Method:</strong> Google OAuth</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <ul className="space-y-2">
            <li><Link href="/ai" className="text-blue-600 hover:underline">🤖 Open AI Chat</Link></li>
            <li><Link href="/contact" className="text-blue-600 hover:underline">📩 Contact Support</Link></li>
            <li><Link href="/" className="text-blue-600 hover:underline">🏠 Back to Home</Link></li>
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <ul className="text-gray-700 text-sm space-y-2">
            <li>✅ Logged in successfully</li>
            <li>🤖 Tried AI Chatbot</li>
            <li>📧 Updated profile info</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
