"use client";
import Link from "next/link";
import "./globals.css";
import { useAuth } from "./hooks/useAuth";

export default function RootLayout({ children }) {
  const { hasToken, user, loading, logout } = useAuth();

  // Don't render navigation while loading to prevent flashing
  if (loading) {
    return (
      <html lang="en">
        <body>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow-sm border-b">
          <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold">🚀 BlueGuard</h1>
            </div>
            
            {/* Centered Navigation Items */}
            <div className="flex items-center justify-center flex-1">
              <div className="flex gap-6 text-sm font-medium">
                {!hasToken && (
                  <Link href="/home" className="hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                )}
                {hasToken && (
                  <Link href="/dashboard2" className="hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                )}
                {hasToken && (
                  <Link href="/ai" className="hover:text-blue-600 transition-colors">
                    AI Assistant
                  </Link>
                )}
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About
                </Link>
              </div>
            </div>
            
            {/* Right side - User info and auth buttons */}
            <div className="flex items-center space-x-4">
              {hasToken && user && (
                <div className="text-sm text-gray-600">
                  {/* Welcome, {user.name || user.email} */}
                </div>
              )}
              
              {!hasToken ? (
                <div className="flex gap-4">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  onClick={logout}
                  className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
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
