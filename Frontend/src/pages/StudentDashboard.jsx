import React, { useRef } from 'react';
import Sidebar from '../components/StudentDashboard/Sidebar';
import ProfileCard from '../components/StudentDashboard/ProfileCard';
import Applications from '../components/StudentDashboard/Applications';
import Counseling from '../components/StudentDashboard/Counseling';
import Recommendations from '../components/StudentDashboard/Recommendations';
import Wishlist from '../components/StudentDashboard/Wishlist';

const StudentDashboard = () => {
  // References for sections
  const profilecardRef = useRef(null);
  const applicationsRef = useRef(null);
  const recommendationsRef = useRef(null);
  const counselingRef = useRef(null);
  const wishlistRef = useRef(null);

  // Function to handle scrolling
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5 gap-6 bg-gray-100">
      {/* Sidebar */}
      <div>
        <Sidebar
          onScrollToProfile={() => scrollToSection(profilecardRef)}
          onScrollToApplications={() => scrollToSection(applicationsRef)}
          onScrollToRecommendations={() => scrollToSection(recommendationsRef)}
          onScrollToCounseling={() => scrollToSection(counselingRef)}
          onScrollToWishlist={() => scrollToSection(wishlistRef)}
        />
      </div>

      {/* Right Panel */}
      <div className="col-span-4 flex flex-col h-full space-y-6 p-6">
        {/* Header Section */}
        <div ref={profilecardRef} className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-start justify-between">
          <h2 className="text-2xl  font-semibold text-gray-700">Student Dashboard</h2>
          <ProfileCard />
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex-1 space-y-6">
          {/* Applications Section */}
          <div ref={applicationsRef}>
            <Applications />
          </div>

          {/* Recommendations Section */}
          <div ref={recommendationsRef}>
            <Recommendations />
          </div>

          {/* Counseling Section */}
          <div ref={counselingRef}>
            <Counseling />
          </div>
          
          {/* Wishlist Section */}
          <div ref={wishlistRef}>
            <Wishlist />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
