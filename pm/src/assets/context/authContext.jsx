import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const userContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
            headers: {
              "Authorization": `Bearer ${token}`
            },
          });



          if (response.data.success) {
            setUser(response.data.user);

          } else {

            setUser(null);
            setLoading(false)
          }
        }

      } catch (error) {
        if (error.response && !error.response.data.error) {
          setUser(null);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const login = (user) => {
    setUser(user);

  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");

  };

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
export default AuthContext;
