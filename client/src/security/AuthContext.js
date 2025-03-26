// this AuthConext.js under security folder
import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
          credentials: "include",
        });

        console.log("Response status:", res.status);
        if (res.ok) {
          const data = await res.json();
          console.log("User data fetched:", data);
          setIsAuthenticated(true);
          setUser(data);
        } else {
          console.warn("Failed to fetch user data, setting as not authenticated");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const userData = await res.json();
        console.log("Login successful, user data:", userData);
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        console.warn("Login failed");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        console.log("Logout successful");
        setIsAuthenticated(false);
        setUser(null);
      } else {
        console.warn("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (res.ok) {
        const userData = await res.json();
        console.log("Registration successful, user data:", userData);
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        console.warn("Registration failed");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthUser = () => useContext(AuthContext);
