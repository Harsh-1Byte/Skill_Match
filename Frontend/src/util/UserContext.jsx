import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      console.log("=== USER CONTEXT INITIALIZATION ===");
      try {
        setIsLoading(true);
        
        // Check if user is authenticated via backend
        const authResponse = await axios.get("/auth/check");
        console.log("Auth check in UserContext:", authResponse.data);
        
        if (authResponse.data.data.authenticated) {
          // User is authenticated, fetch user details
          const { data } = await axios.get("/user/registered/getDetails");
          console.log("User details fetched in UserContext:", data.data);
          setUser(data.data);
          localStorage.setItem("userInfo", JSON.stringify(data.data));
        } else {
          // User not authenticated, check localStorage for cached data
          const userInfoString = localStorage.getItem("userInfo");
          if (userInfoString) {
            try {
              const userInfo = JSON.parse(userInfoString);
              console.log("Found cached user info in localStorage");
              setUser(userInfo);
            } catch (error) {
              console.error("Error parsing cached userInfo:", error);
              localStorage.removeItem("userInfo");
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error in UserContext initialization:", error);
        // On error, check localStorage for cached data
        const userInfoString = localStorage.getItem("userInfo");
        if (userInfoString) {
          try {
            const userInfo = JSON.parse(userInfoString);
            setUser(userInfo);
          } catch (error) {
            console.error("Error parsing cached userInfo:", error);
            localStorage.removeItem("userInfo");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log("=== USER CONTEXT INITIALIZATION COMPLETE ===");
      }
    };

    if (!isInitialized) {
      initializeUser();
    }
  }, [isInitialized]);

  useEffect(() => {
    const handleUrlChange = () => {
      console.log("URL has changed:", window.location.href);
    };
    
    window.addEventListener("popstate", handleUrlChange);
    
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isInitialized, 
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

export { UserContextProvider, useUser };
