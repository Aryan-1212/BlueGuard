"use client";
import Link from "next/link";
import "./globals.css";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const gtoken = localStorage.getItem("Gtoken");
      if (token || gtoken) {
        setHasToken(true);
      }
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = async () => {
    try {
      const logout = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const res = await logout.json();
      if (res.message === "Logged out successfully") {
        localStorage.removeItem("token");
        localStorage.removeItem("Gtoken");
        setHasToken(false);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("Gtoken");
      setHasToken(false);
      window.location.href = "/login";
    }
  };

  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow-sm border-b">
          <nav className="max-w-5xl mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl font-bold">🚀 BlueGuard Starter</h1>
            <div className="flex gap-6 text-sm font-medium">
              <Link href="/home" className="hover:text-blue-600">
                Home
              </Link>
              {!hasToken && (
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
              )}
              
              <Link href="/about" className="hover:text-blue-600">
                About
              </Link>
              {hasToken && (
                <Link href="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
              )}
              {hasToken && (
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-600 bg-none border-none cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="bg-white border-t mt-8">
          <div className="max-w-5xl mx-auto text-center py-4 text-sm text-gray-500">
            © {new Date().getFullYear()} BlueGuard – All rights
            reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
