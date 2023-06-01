import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/user/", {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      console.log(response.data);
      setUser(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('userprovider')
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      console.log(storedToken)
      setUserToken(storedToken);
    }

  }, []);

  useEffect(() => {
    if (userToken !== null) {
      fetchUser();
    }
  }, [userToken]);

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
