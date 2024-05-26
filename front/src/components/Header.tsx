import React from 'react';
import moonbeam_tornado_logo from '../assets/moonbeam-tornado-logo.png';
import { Link } from 'react-router-dom';
import { useConnect } from 'wagmi';

interface HeaderProps {
  address: string | undefined;
  status: string | undefined;
}

const Header: React.FC<HeaderProps> = ({ address, status }) => {
  const { connectors, connect } = useConnect();
  const availableConnector = connectors[0];

  return (
    <header className="flex justify-between items-center p-3">
      <div className="flex items-center gap-10">
        <Link to="/">
          <img src={moonbeam_tornado_logo} alt="moonbeam_tornado_logo" className="w-10 h-10" />
        </Link>
        <Link to="/" className="font-bold text-lg">
          <div className="headerItem">Home</div>
        </Link>
        <Link to="/deposit" className="font-bold text-lg">
          <div className="headerItem">Deposit</div>
        </Link>
        <Link to="/withdraw" className="font-bold text-lg">
          <div className="headerItem">Withdraw</div>
        </Link>
      </div>

      <div className="flex items-center gap-10">
        {availableConnector && (
          <button
            className="bg-gradient-to-r from-blue-500 to-red-600 hover:from-blue-600 hover:to-red-700 py-2.5 pr-5 pl-5 rounded-full font-bold transition duration-1000"
            onClick={() => connect({ connector: availableConnector })}
            type="button"
          >
            {status === 'connected' ? `${address?.slice(0, 4)}...${address?.slice(-4)}` : 'Connect'}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
