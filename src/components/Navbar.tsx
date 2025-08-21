import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          Music Lyrics Translations
        </Link>

        {/* Mobile menu button */}
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
        </button>

        {/* Navigation menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {user ? (
            // Logged in user menu
            <>
              <Link to="/translation/new" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Translate Lyrics
              </Link>
              <div className="navbar-user">
                <span className="navbar-username">Hello, {user.username}!</span>
                <button onClick={handleLogout} className="navbar-logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            // Guest user menu
            <>
              <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
