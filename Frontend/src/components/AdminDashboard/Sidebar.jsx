import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/LOGO_WHITE.png';
import { useUser } from '../../context/UserContext';
import {
  faUsers,
  faFileAlt,
  faCreditCard,
  faHeart,
  faChartLine,
  faArrowLeft,
  faSignOutAlt,
  faBars,
  faTimes,
  faMessage,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({
  onScrollToUserManagement,
  onScrollToApplicationManagement,
  onScrollToSubscriptionManagement,
  onScrollToAnalytics,
  onScrollToWishlist,
  onScrollToChatbot,
  onScrollToApproveInstitutes
}) => {
  const navigate = useNavigate();
  const { user, role, setUser, setRole } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      setRole(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#1D5EC7] shadow-lg p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center text-white mb-8">
          <img src={logo} alt="Logo" className="w-32" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          <button
            onClick={onScrollToAnalytics}
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2 px-4 rounded-md"
          >
            <FontAwesomeIcon icon={faChartLine} className="mr-3" />
            Analytics
          </button>

          <button
            onClick={onScrollToUserManagement}
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2 px-4 rounded-md"
          >
            <FontAwesomeIcon icon={faUsers} className="mr-3" />
            User & Role
          </button>

          <button
            onClick={onScrollToChatbot}
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2 px-4 rounded-md"
          >
            <FontAwesomeIcon icon={faMessage} className="mr-3" />
            Fee Chat Bot
          </button>

          {/* New Button: Approve Institutes and Programs */}
          <button
            onClick={onScrollToApproveInstitutes}
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2 px-4 rounded-md"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="mr-3" />
            Approve Institutes
          </button>

          <button
            onClick={onScrollToApplicationManagement}
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2 px-4 rounded-md"
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-3" />
            Application
          </button>

          <button
            onClick={onScrollToSubscriptionManagement}
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2 px-4 rounded-md"
          >
            <FontAwesomeIcon icon={faCreditCard} className="mr-3" />
            Subscription
          </button>

          <button
            onClick={onScrollToWishlist}
            className="flex items-center text-white hover:text-[#3b1d5c] transition py-2 px-4 rounded-md"
          >
            <FontAwesomeIcon icon={faHeart} className="mr-3" />
            Wishlist
          </button>
        </nav>

        {/* Back and Logout Buttons */}
        <div className="space-y-4 mt-auto">
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

      {/* Overlay (for mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Hamburger Menu */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-[#8C52FF] text-white rounded-full lg:hidden"
      >
        <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} className="text-xl" />
      </button>
    </div>
  );
};

export default Sidebar;
