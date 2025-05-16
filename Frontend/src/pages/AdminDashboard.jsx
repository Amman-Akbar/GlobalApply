import React, { useRef } from 'react';
import Sidebar from '../components/AdminDashboard/Sidebar';
import UserManagement from '../components/AdminDashboard/UserManagement';
import ApplicationManagement from '../components/AdminDashboard/ApplicationManagement';
import SubscriptionManagement from '../components/AdminDashboard/SubscriptionManagement';
import Analytics from '../components/AdminDashboard/Analytics';
import Wishlist from '../components/Wishlist';
import UniversityFee from '../components/AdminDashboard/UniversityFee';
import ApproveInstitute from '../components/AdminDashboard/ApproveInstitute';

const AdminDashboard = () => {
  // Refs for scrolling to sections
  const userManagementRef = useRef(null);
  const applicationManagementRef = useRef(null);
  const subscriptionManagementRef = useRef(null);
  const analyticsRef = useRef(null);
  const wishlistRef = useRef(null);
  const chatbotRef = useRef(null);
  const ApproveInstituteRef = useRef(null);

  // Scroll to section handler
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5 bg-gray-100">
      {/* Sidebar */}
      <div>
        <Sidebar
          onScrollToUserManagement={() => scrollToSection(userManagementRef)}
          onScrollToApplicationManagement={() => scrollToSection(applicationManagementRef)}
          onScrollToSubscriptionManagement={() => scrollToSection(subscriptionManagementRef)}
          onScrollToAnalytics={() => scrollToSection(analyticsRef)}
          onScrollToWishlist={() => scrollToSection(wishlistRef)}
          onScrollToChatbot={() => scrollToSection(chatbotRef)}
          onScrollToApproveInstitutes={() => scrollToSection(ApproveInstituteRef)}
        />
      </div>

      {/* Main Content Area */}
      <div className="col-span-4 flex flex-col h-full space-y-6 p-6">

        {/* Analytics Section */}
        <div ref={analyticsRef} className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Analytics</h2>
          <Analytics />
        </div>

        {/* User and Role Management Section */}
        <div ref={userManagementRef} className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">User & Role Management</h2>
          <UserManagement />
        </div>
        
        {/* University ChatBot Section */}
        <div ref={chatbotRef} className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">University Fee Chat Bot</h2>
          <UniversityFee />
        </div>

        {/* Approve Institute Section */}
        <div ref={ApproveInstituteRef} className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Approve Institute</h2>
          <ApproveInstitute />
        </div>

        {/* Application Management Section */}
        <div ref={applicationManagementRef} className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Application Management</h2>
          <ApplicationManagement />
        </div>

        {/* Subscription Management Section */}
        <div ref={subscriptionManagementRef} className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Subscription Management</h2>
          <SubscriptionManagement />
        </div>
        
        {/* Wishlist Section */}
        <div ref={wishlistRef} className="bg-white shadow-lg p-6 rounded-lg">
          {/* <h2 className="text-2xl font-semibold text-gray-700 mb-4">Wishlist</h2> */}
          <Wishlist />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
