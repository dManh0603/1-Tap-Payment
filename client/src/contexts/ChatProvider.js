const { createContext, useState, useContext, useEffect } = require("react")

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    console.log('chat provider')
  }, [])


  return (
    <ChatContext.Provider value={{
      selectedChat,
      setSelectedChat, chats, setChats,
      notification, setNotification
    }}>
      {children}
    </ChatContext.Provider>
  )

}

export const ChatState = () => {

  return useContext(ChatContext)
}


export default ChatProvider;