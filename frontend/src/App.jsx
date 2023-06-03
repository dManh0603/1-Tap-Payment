import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage'
import Mepage from './pages/Mepage'
import Depositpage from './pages/Depositpage';
import './App.css';
import Transactionpage from './pages/Transactionpage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/me/deposit" Component={Depositpage}></Route>
        <Route path="/me/transactions" Component={Transactionpage}></Route>
        <Route path="/me" Component={Mepage}></Route>
        <Route path="/" Component={Homepage}></Route>
      </Routes>
    </div>
  );
}
export default App;
