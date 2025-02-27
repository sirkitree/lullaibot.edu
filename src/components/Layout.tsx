import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container flex justify-between items-center">
          <Link to="/" className="app-logo">
            <h1>LullAIbot</h1>
          </Link>
          <nav className="app-nav">
            <ul className="flex gap-md">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className={`nav-link ${isActiveRoute('/resources') ? 'active' : ''}`}
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/add-resource"
                  className={`nav-link ${isActiveRoute('/add-resource') ? 'active' : ''}`}
                >
                  Add Resource
                </Link>
              </li>
              <li>
                <Link
                  to="/achievements"
                  className={`nav-link ${isActiveRoute('/achievements') ? 'active' : ''}`}
                >
                  Achievements
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className={`nav-link ${isActiveRoute('/leaderboard') ? 'active' : ''}`}
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="auth-nav">
            {user ? (
              <div className="flex items-center gap-sm">
                <span className="user-greeting">Hello, {user.name}</span>
                <button 
                  onClick={() => logout()} 
                  className="button button-outline-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-sm">
                <Link 
                  to="/login" 
                  className={`button button-outline-primary ${isActiveRoute('/login') ? 'active' : ''}`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`button button-primary ${isActiveRoute('/register') ? 'active' : ''}`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <div className="flex justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Lullabot. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/" className="footer-link">Privacy Policy</Link>
              <Link to="/" className="footer-link">Terms of Service</Link>
              <a href="https://lullabot.com" className="footer-link" target="_blank" rel="noopener noreferrer">
                Lullabot Website
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 