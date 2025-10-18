import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          Number Communication
        </div>
        
        <div className="auth-section">
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.username}!</span>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" onClick={onLoginClick}>
                Login
              </button>
              <button className="btn btn-primary" onClick={onRegisterClick}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
