import React from 'react';
import logo from '../assets/logo/LOGO_PURPLE.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-300 text-black py-8 mt-16">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Section - Logo */}
          <div className="mb-6 md:mb-0 flex justify-center md:justify-start">
            <img src={logo} alt="GlobalApply Logo" className="w-36" />
          </div>

          {/* Middle Section - Links */}
          <div className="flex flex-col md:flex-row justify-center md:justify-start text-center md:text-left mb-6 md:mb-0">
            <div className="flex flex-col mb-4 md:mb-0 md:mr-10">
              <h5 className="text-lg font-bold mb-3 text-[#1d5ec7]">About Us</h5>
              <Link to="/about" className="text-black hover:text-[#1d5ec7] mb-2">Our Story</Link>
              <Link to="/features" className="text-black hover:text-[#1d5ec7] mb-2">Features</Link>
              <Link to="/pricing" className="text-black hover:text-[#1d5ec7] mb-2">Pricing</Link>
            </div>
            <div className="flex flex-col mb-4 md:mb-0 md:mr-10">
              <h5 className="text-lg font-bold mb-3 text-[#1d5ec7]">Institutes</h5>
              <Link to="/institutes" className="text-black hover:text-[#1d5ec7] mb-2">Browse Institutes</Link>
              <Link to="/register-institute" className="text-black hover:text-[#1d5ec7] mb-2">Register as an Institute</Link>
            </div>
            <div className="flex flex-col mb-4 md:mb-0">
              <h5 className="text-lg font-bold mb-3 text-[#1d5ec7]">Support</h5>
              <a href="/terms" className="text-black hover:text-[#1d5ec7] mb-2">Terms & Conditions</a>
              <a href="/privacy" className="text-black hover:text-[#1d5ec7] mb-2">Privacy Policy</a>
            </div>
          </div>

          {/* Right Section - Social Links and Other Links */}
          <div className="text-center md:text-left">
            <h5 className="text-lg font-bold mb-3 text-[#1d5ec7]">Stay Connected</h5>
            <div className="flex justify-center md:justify-start mb-6">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="mx-3 text-black hover:text-[#8C52FF]">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="mx-3 text-black hover:text-[#8C52FF]">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="mx-3 text-black hover:text-[#8C52FF]">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <p className="text-sm font-medium text-center md:text-left">© 2025 GlobalApply. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
