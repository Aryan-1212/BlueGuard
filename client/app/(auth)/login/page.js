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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const gtoken = localStorage.getItem("Gtoken");

        if (token || gtoken) {
          router.push("/dashboard2");
        }
      }
    };

    checkAuth();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("auth") === "google") {
      localStorage.setItem("Gtoken", "google_authenticated");

      const fetchGoogleUserData = async () => {
        try {
          const googleResponse = await fetch(
            "http://localhost:5000/api/auth/google/status",
            {
              credentials: "include",
            }
          );

          if (googleResponse.ok) {
            const googleData = await googleResponse.json();
            if (googleData.authenticated && googleData.user) {
              localStorage.setItem(
                "googleUserData",
                JSON.stringify(googleData.user)
              );
            }
          }
        } catch (error) {
          console.error("Error fetching Google user data:", error);
        }
      };

      fetchGoogleUserData();

      window.dispatchEvent(
        new CustomEvent("authStateChanged", {
          detail: { type: "google", authenticated: true },
        })
      );

      setTimeout(() => {
        router.push("/dashboard2");
      }, 100);
    }
  }, [router]);

  // ✅ Email format regex
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const validationErrors = {};

    if (!email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!password.trim()) {
      validationErrors.password = "Password is required.";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      // alert(data.message || "Logged in!");
      setMessage(data.message || "Logged in!");

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard2";
      } else {
        // alert(data.error || "Login failed.");
        setMessage(data.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      // alert("An error occurred during login.");
      setMessage("An error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthRedirect>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200">
        
          {message && <div className="text-blue-500 font-semibold text-center mb-4">{message}</div>}
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
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
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
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
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`p-3 text-white rounded-lg transition ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={() => {
                sessionStorage.setItem("googleOAuthInProgress", "true");
                window.location.href = "http://localhost:5000/api/auth/google";
              }}
              className="flex items-center justify-center gap-2 w-full p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <FcGoogle className="text-xl" />
              <span>Continue with Google</span>
            </button>

            <div className="text-center mt-4 text-blue-500 underline">
              <Link href={"/signup"}>register as a new user?</Link>
            </div>
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
}
