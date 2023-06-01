import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);


  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/user/", {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchUser();
    }
  }, []);

  const userContextValue = {
    user,
    setUser,
    userToken,
    fetchUser,
    setUserToken
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const UserState = () => {
  const context = useContext(UserContext);
  return context;
};

export default UserProvider;
