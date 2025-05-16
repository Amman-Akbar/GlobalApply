import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import {
  faUser,
  faLightbulb,
  faPaperPlane,
  faComments,
  faArrowLeft,
  faSignOutAlt,
  faHeart,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo/LOGO_WHITE.png';

const Sidebar = ({
  onScrollToProfile,
  onScrollToApplications,
  onScrollToRecommendations,
  onScrollToCounseling,
  onScrollToWishlist
}) => {
  const navigate = useNavigate();
  const { user, role, setUser, setRole } = useUser();
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1D5EC7] text-white p-2 rounded-md"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
      </button>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1D5EC7] shadow-lg transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex flex-col h-full p-6 space-y-6">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-32" />
          </div>
          <nav className="flex-1 space-y-2">
            {[
              { icon: faUser, text: 'Profile Management', onClick: onScrollToProfile },
              { icon: faPaperPlane, text: 'Applications', onClick: onScrollToApplications },
              { icon: faLightbulb, text: 'Recommendations', onClick: onScrollToRecommendations },
              { icon: faComments, text: 'Counseling', onClick: onScrollToCounseling },
              { icon: faHeart, text: 'Wishlist', onClick: onScrollToWishlist },
            ].map((item, index) => (
              <button
                key={index}
                className="w-full text-left text-white hover:bg-white/10 py-2 px-4 rounded-md transition-colors duration-200"
                onClick={item.onClick}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3 h-4 w-4" />
                {item.text}
              </button>
            ))}
          </nav>
          <div className="space-y-2">
            <button
              className="w-full text-left text-white hover:bg-white/10 py-2 px-4 rounded-md transition-colors duration-200"
              onClick={handleBack}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-3 h-4 w-4" />
              Back
            </button>
            <button
              className="w-full text-left text-white hover:bg-white/10 py-2 px-4 rounded-md transition-colors duration-200"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
