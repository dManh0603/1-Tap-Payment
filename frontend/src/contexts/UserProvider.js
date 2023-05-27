import axios from "axios";
import { useNavigate } from "react-router-dom";

const { createContext, useState, useEffect, useContext } = require("react")

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const userToken = JSON.parse(localStorage.getItem('userToken'));

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response)
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('user provider')
    if (!userToken) {
      return navigate('/')
    }
    fetchUser(userToken)
  }, [])

  return (
    <UserContext.Provider value={{
      user, setUser
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const UserState = () => {

  return useContext(UserContext)
}


export default UserProvider;