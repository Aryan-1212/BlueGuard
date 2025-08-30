"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import AuthRedirect from "../../components/AuthRedirect";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  
  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const gtoken = localStorage.getItem("Gtoken");
        
        if (token || gtoken) {
          router.push("/dashboard");
        }
      }
    };
    
    checkAuth();
    
    // Check if this is a redirect from Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'google') {
      // This is a Google OAuth redirect, set the flag and trigger auth update
      localStorage.setItem("Gtoken", "google_authenticated");
      
      // Fetch real Google user data
      const fetchGoogleUserData = async () => {
        try {
          const googleResponse = await fetch("http://localhost:5000/api/auth/google/status", {
            credentials: "include"
          });
          
          if (googleResponse.ok) {
            const googleData = await googleResponse.json();
            if (googleData.authenticated && googleData.user) {
              // Store user data in localStorage for immediate access
              localStorage.setItem("googleUserData", JSON.stringify(googleData.user));
            }
          }
        } catch (error) {
          console.error("Error fetching Google user data:", error);
        }
      };
      
      fetchGoogleUserData();
      
      // Dispatch a custom event to notify other components about auth change
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { type: 'google', authenticated: true }
      }));
      
      // Small delay to ensure localStorage is set before redirect
      setTimeout(() => {
        router.push("/dashboard2");
      }, 100);
    }
  }, [router]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    alert(data.message || "Logged in!");
    if (data.token){
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard2";
    } 
  };

  return (
    <AuthRedirect>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex items-center border rounded-lg px-3">
            <FiMail className="text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="flex-1 p-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center border rounded-lg px-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="flex-1 p-3 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={() => {
              // Store a flag to indicate Google OAuth is in progress
              sessionStorage.setItem('googleOAuthInProgress', 'true');
              window.location.href = "http://localhost:5000/api/auth/google";
            }}
            className="flex items-center justify-center gap-2 w-full p-3 border rounded-lg hover:bg-gray-50 transition"
          >
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </button>
          <div className="text-center mt-4 text-blue-500 underline">
            <Link href={"/signup"}>
              register as a new user?
            </Link>
          </div>
        </div>
      </div>
    </div>
    </AuthRedirect>
  );
}
