import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const gtoken = localStorage.getItem("Gtoken");
      
      if (token || gtoken) {
        setHasToken(true);
        
        // Fetch user data if we have a token
        if (token) {
          try {
            const response = await fetch("http://localhost:5000/api/auth/me", {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              credentials: "include"
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else if (gtoken) {
          // For Google OAuth, try to get user data from localStorage first, then backend
          const storedUserData = localStorage.getItem("googleUserData");
          
          if (storedUserData) {
            try {
              const userData = JSON.parse(storedUserData);
              setUser(userData);
            } catch (error) {
              console.error("Error parsing stored Google user data:", error);
            }
          } else {
            // Fetch real user data from backend
            try {
              const googleResponse = await fetch("http://localhost:5000/api/auth/google/status", {
                credentials: "include"
              });
              
              if (googleResponse.ok) {
                const googleData = await googleResponse.json();
                if (googleData.authenticated && googleData.user) {
                  setUser(googleData.user);
                  // Store for future use
                  localStorage.setItem("googleUserData", JSON.stringify(googleData.user));
                } else {
                  // Fallback to basic user info if backend doesn't return user data
                  setUser({ name: "Google User", email: "google@user.com" });
                }
              } else {
                // Fallback to basic user info if request fails
                setUser({ name: "Google User", email: "google@user.com" });
              }
            } catch (error) {
              console.error("Error fetching Google user data:", error);
              // Fallback to basic user info if request fails
              setUser({ name: "Google User", email: "google@user.com" });
            }
          }
        }
      } else {
        setHasToken(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setHasToken(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const logoutResponse = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const res = await logoutResponse.json();
      if (res.message === "Logged out successfully") {
        localStorage.removeItem("token");
        localStorage.removeItem("Gtoken");
        localStorage.removeItem("googleUserData");
        setHasToken(false);
        setUser(null);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("Gtoken");
      localStorage.removeItem("googleUserData");
      setHasToken(false);
      setUser(null);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Listen for storage changes (when tokens are added/removed)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    // Check for URL parameters that might indicate OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'google') {
      // This is a Google OAuth redirect, check auth immediately
      setTimeout(() => checkAuth(), 100);
    }
    
    // Check if Google OAuth was in progress
    if (sessionStorage.getItem('googleOAuthInProgress') === 'true') {
      sessionStorage.removeItem('googleOAuthInProgress');
      // Check auth state after a short delay
      setTimeout(() => checkAuth(), 500);
    }
    
    // Listen for custom auth state change events
    const handleAuthStateChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', checkAuth); // Check auth when window gains focus
    window.addEventListener('authStateChanged', handleAuthStateChange);
    
    // Set up a polling mechanism for immediate auth state changes
    const authCheckInterval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      const currentGtoken = localStorage.getItem("Gtoken");
      
      if ((currentToken || currentGtoken) && !hasToken) {
        checkAuth();
      } else if (!currentToken && !currentGtoken && hasToken) {
        checkAuth();
      }
    }, 1000); // Check every second
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkAuth);
      window.removeEventListener('authStateChanged', handleAuthStateChange);
      clearInterval(authCheckInterval);
    };
  }, [hasToken]);

  return {
    hasToken,
    user,
    loading,
    logout,
    checkAuth
  };
};
