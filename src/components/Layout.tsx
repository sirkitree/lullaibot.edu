import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            </ul>
          </nav>
          
          <div className="auth-nav">
            {user ? (
              <div className="flex items-center gap-sm" ref={menuRef}>
                <div 
                  className="user-greeting flex items-center cursor-pointer position-relative" 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="mr-2">Hello, {user.name}</span>
                  <span className="dropdown-arrow">▼</span>
                  
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <ul>
                        <li>
                          <Link 
                            to="/profile" 
                            className={`dropdown-item ${isActiveRoute('/profile') ? 'active' : ''}`}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/account-settings" 
                            className={`dropdown-item ${isActiveRoute('/account-settings') ? 'active' : ''}`}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Account Settings
                          </Link>
                        </li>
                        {user.role === 'admin' && (
                          <li>
                            <Link 
                              to="/admin" 
                              className={`dropdown-item ${isActiveRoute('/admin') ? 'active' : ''}`}
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Admin Dashboard
                            </Link>
                          </li>
                        )}
                        <li className="dropdown-divider"></li>
                        <li>
                          <button 
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="dropdown-item text-danger"
                          >
                            Log Out
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
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