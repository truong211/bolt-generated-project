import React, { createContext, useState, useContext, useEffect } from 'react';
    import axios from 'axios';

    const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [user, setUser] = useState(null);

      useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setIsAuthenticated(true);
          // Fetch user data here if needed
        }
      }, []);

      const login = async (credentials) => {
        try {
          const response = await axios.post('http://localhost:3000/auth/login', credentials);
          const { token } = response.data;
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setIsAuthenticated(true);
          // Fetch user data here if needed
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      };

      const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUser(null);
      };

      return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => useContext(AuthContext);
