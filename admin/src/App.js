import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage';
import Transactions from './pages/Transactions';
import TransactionDetails from './pages/TransactionDetails';

function App() {
  return (
    <div className="App" id='wrapper'>
      <Routes>
        <Route path="/" Component={Homepage}></Route>
        <Route path="/dashboard" Component={Dashboard}></Route>
        <Route path="/transactions" Component={Transactions}></Route>
        <Route path="/transaction/:id" Component={TransactionDetails}></Route>

      </Routes>
    </div>
  );
}
export default App;
