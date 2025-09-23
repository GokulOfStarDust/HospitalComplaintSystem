import React, {createContext, useState, useEffect} from 'react'
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { BASE_URL } from '../Url';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAdmin, setIsAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = unknown, true/false = known
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axiosInstance.get(`${BASE_URL}api/auth/user/`); // backend returns 200 if access token cookie is valid
        setUser(response.data);
        setIsAuthenticated(true);
        setIsAdmin(response.data.role === 'Master Admin');
        console.log("User is authenticated");
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}api/auth/login/`,
            {username, password},
            { withCredentials: true } 
            )
        console.log("Login successful", response.data);
        setUser(response.data);
        setIsAdmin(response.data.role === 'Master Admin');
        setIsAuthenticated(true);

    } catch (err) {
      setIsAuthenticated(false);
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      await axiosInstance.post(`${BASE_URL}api/auth/logout/`);
      console.log("Logout successful");
      setUser(null);
      setIsAdmin(false);

    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, isAdmin, user }}>
      {children}
    </AuthContext.Provider>
  );
};