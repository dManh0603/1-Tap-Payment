import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from '@chakra-ui/react'
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
    toast({
      title: 'Logout succesfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    })
    navigate('/')
  }

  useEffect(() => {

    const storedToken = localStorage.getItem('userToken');

    if (!storedToken) {
      navigate('/');
      return
    }

    const fetchUser = async (token) => {
      try {
        const response = await axios.get("/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(response.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchUser(storedToken);

  }, [navigate])

  const userContextValue = {
    user,
    setUser,
    logout
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
