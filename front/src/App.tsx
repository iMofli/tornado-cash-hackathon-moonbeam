import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Withdraw from './pages/Withdraw';
import Deposit from './pages/Deposit';
import { useAccount} from 'wagmi';
import Home from './pages/Home';

const App: React.FC = () => {
  const { address, status } = useAccount();

  return (
    <div>
      <Header status={status} address={address} />
      <div className="mainWindow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deposit" element={<Deposit status={status} address={address}/>} />
          <Route path="/withdraw" element={<Withdraw />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
