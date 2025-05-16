import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context
const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://localhost:3000/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { user: userData } = response.data;
      setUser(userData);
      setRole(userData.role.toLowerCase());
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Clear invalid token and user data
      localStorage.removeItem('token');
      setUser(null);
      setRole(null);
      return false;
    }
  };

  // Fetch user data from the backend using the JWT token
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { user: userData } = response.data;
      setUser(userData);
      setRole(userData.role.toLowerCase());
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If token is expired or invalid, clear it
      localStorage.removeItem('token');
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Try to refresh the token
          const success = await refreshToken();
          if (success) {
            // Retry the original request with the new token
            const token = localStorage.getItem('token');
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Initial fetch of user data
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, role, setRole, loading, setLoading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};