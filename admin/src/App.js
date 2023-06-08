import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage';
import Transactions from './pages/Transactions';
import TransactionDetails from './pages/TransactionDetails';
import Chats from './pages/Chats';
import Sidebar from './components/miscellaneous/Sidebar';
import Topbar from './components/miscellaneous/Topbar';
import { UserState } from './contexts/UserProvider';
import { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { ChatState } from './contexts/ChatProvider';

const ENDPOINT = 'http://localhost:4000';

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
    <div className="App" id='wrapper'>
      {user && <Sidebar />}
      <div id="content-wrapper" className='d-flex flex-column'>
        {user && <Topbar />}
        <Routes>
          <Route path="/" Component={Homepage}></Route>
          <Route path="/dashboard" Component={Dashboard}></Route>
          <Route path="/transactions" Component={Transactions}></Route>
          <Route path="/transaction/:id" Component={TransactionDetails}></Route>
          <Route path="/chats" Component={Chats}></Route>

        </Routes>
      </div>
    </div>
  );
}
export default App;
