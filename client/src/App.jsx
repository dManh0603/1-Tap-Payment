import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage'
import Mepage from './pages/Mepage'
import Depositpage from './pages/Depositpage';
import './App.css';
import Transactionpage from './pages/Transactionpage';
import { useEffect, useState } from 'react';
import { UserState } from './contexts/UserProvider';
import { ChatState } from './contexts/ChatProvider';
import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:3000';
let socket, selectedChatCompare;
socket = io(ENDPOINT);

function App() {

  const { user } = UserState();
  const [socketConennected, setSocketConennected] = useState(false)
  const { notification, setNotification } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    console.log(user)
    if (user) {
      console.log('app setup');
      socket.emit('setup', user);
      socket.on('connected', () => setSocketConennected(true));
    }
  }, [user])

  useEffect(() => {
    if (!socketConennected) return;
    socket.on('message received', (newMessage) => {
      console.log('message received')
      if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
        if (!notification.includes(newMessage)) {
          setNotification([newMessage, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
    })
  }, [socketConennected])

  return (
    <div className="App">
      <Routes>
        <Route path="/me/deposit" Component={Depositpage}></Route>
        <Route path="/me/transactions" Component={Transactionpage}></Route>
        <Route path="/me/chat" Component={Transactionpage}></Route>
        <Route path="/me" Component={Mepage}></Route>
        <Route path="/" Component={Homepage}></Route>
      </Routes>
    </div>
  );
}
export default App;
