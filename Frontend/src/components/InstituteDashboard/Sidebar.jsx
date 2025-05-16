import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/LOGO_WHITE.png';
import { useUser } from '../../context/UserContext';
import {
  faChalkboard,
  faUsers,
  faFileAlt,
  faClipboardList,
  faDoorOpen,
  faCreditCard,
  faHeart,
  faArrowLeft,
  faSignOutAlt,
  faBars, // Icon for the hamburger menu
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility
  const { user, role, setUser, setRole } = useUser();

  const handleBack = () => navigate('/');

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      setRole(null);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <>
      {/* Hamburger Menu for Small Screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-[#1D5EC7] p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <FontAwesomeIcon icon={faBars} className="text-2xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bottom-0 bg-[#1D5EC7] p-6 w-72 flex flex-col justify-between shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 z-40`}
      >
        {/* Logo */}
        <div className="flex items-center text-white mb-8">
          <img src={logo} alt="Institute Logo" className="w-32" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4 mb-auto">
          <button
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2"
            onClick={() => onNavigate('dashboard')}
          >
            <FontAwesomeIcon icon={faChalkboard} className="mr-3 text-lg" />
            Dashboard
          </button>
          <button
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2"
            onClick={() => onNavigate('applications')}
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-lg" />
            Application Management
          </button>
          <button
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2"
            onClick={() => onNavigate('studentManagement')}
          >
            <FontAwesomeIcon icon={faUsers} className="mr-3 text-lg" />
            Student Management
          </button>
          <button
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2"
            onClick={() => onNavigate('subscriptionManagement')}
          >
            <FontAwesomeIcon icon={faCreditCard} className="mr-3 text-lg" />
            Subscription Management
          </button>
          <button
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2"
            onClick={() => onNavigate('virtualTours')}
          >
            <FontAwesomeIcon icon={faDoorOpen} className="mr-3 text-lg" />
            Virtual Tours
          </button>
          <button
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2"
            onClick={() => onNavigate('wishlist')}
          >
            <FontAwesomeIcon icon={faHeart} className="mr-3 text-lg" />
            Wishlist
          </button>
        </nav>

        {/* Back and Logout Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleBack}
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2 px-4 rounded-md"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-3 text-lg" />
            Back
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2 px-4 rounded-md"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-lg" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for Small Screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
