import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage';

function App() {
  return (
    <div className="App" id='wrapper'>
      <Routes>
        <Route path="/" Component={Homepage}></Route>
        <Route path="/dashboard" Component={Dashboard}></Route>

      </Routes>
    </div>
  );
}
export default App;
