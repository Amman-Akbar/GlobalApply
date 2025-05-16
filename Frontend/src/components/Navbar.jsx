import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo/LOGO_WHITE.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const location = useLocation();
  const { user, role } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyles = (path) =>
    location.pathname === path
      ? 'text-black border-b-2 border-gray-900'
      : 'hover:text-purple-800 hover:scale-105 transition duration-300';

  const getDashboardPath = () => {
    if (role === 'student') return '/student-dashboard';
    if (role === 'institute') return '/institute-dashboard';
    if (role === 'admin') return '/admin';
    return '/login';
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="flex h-24 justify-between items-center px-10 bg-transparent absolute w-full z-50">
      <Link to="/">
        <img src={logo} alt="Logo" className="w-36 pt-3" />
      </Link>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center justify-center gap-24 text-xl font-regular">
        <Link to="/" className={`${linkStyles('/')}`}>Home</Link>
        <Link to="/institutes" className={`${linkStyles('/institutes')}`}>Institutes</Link>
        <Link to="/features" className={`${linkStyles('/features')}`}>Features</Link>
        <Link to="/pricing" className={`${linkStyles('/pricing')}`}>Pricing</Link>
        <Link to="/about" className={`${linkStyles('/about')}`}>About</Link>
      </div>
      {/* Profile Button */}
      <div className="hidden md:block">
        <Link
          to={getDashboardPath()}
          className="bg-[#1d5ec7] text-white rounded-3xl px-5 py-2.5 text-xl hover:bg-[#306fd6]"
        >
          Profile
        </Link>
      </div>
      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button onClick={toggleMenu} aria-label="Menu">
          <FontAwesomeIcon icon={faBars} className="text-2xl text-black" />
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-0 right-0 w-3/4 h-full bg-white opacity-90  shadow-lg z-50 flex flex-col items-start p-5">
          <button onClick={toggleMenu} aria-label="Close Menu" className="self-end text-2xl mb-5">
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <Link
            to="/"
            className={`${linkStyles('/')} mb-5 text-lg`}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/institutes"
            className={`${linkStyles('/institutes')} mb-5 text-lg`}
            onClick={toggleMenu}
          >
            Institutes
          </Link>
          <Link
            to="/features"
            className={`${linkStyles('/features')} mb-5 text-lg`}
            onClick={toggleMenu}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className={`${linkStyles('/pricing')} mb-5 text-lg`}
            onClick={toggleMenu}
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className={`${linkStyles('/about')} mb-5 text-lg`}
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to={getDashboardPath()}
            className="bg-[#1d5ec7] text-white rounded-3xl px-5 py-2.5 text-lg hover:bg-[#306fd6] mt-auto"
            onClick={toggleMenu}
          >
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
