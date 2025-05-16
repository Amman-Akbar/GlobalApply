import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/InstituteDashboard/Sidebar';
import ProfileCard from '../components/InstituteDashboard/ProfileCard';
import Applications from '../components/InstituteDashboard/Applications';
import StudentManagement from '../components/InstituteDashboard/StudentManagement';
import SubscriptionManagement from '../components/InstituteDashboard/SubscriptionManagement';
import VirtualTour from '../components/InstituteDashboard/VirtualTour';
import Wishlist from '../components/Wishlist';

function InstituteDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // References for sections
  const dashboardRef = useRef(null);
  const applicationsRef = useRef(null);
  const studentManagementRef = useRef(null);
  const subscriptionManagementRef = useRef(null);
  const virtualToursRef = useRef(null);
  const wishlistRef = useRef(null);

  useEffect(() => {
    fetchInstituteData();
  }, []);

  const fetchInstituteData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login first.');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // First get the user data to get the user ID
      const userResponse = await axios.get("http://localhost:3000/api/v1/auth/me", { headers });
      const userId = userResponse.data.user.id;

      if (!userId) {
        setError('No user ID found. Please login first.');
        setLoading(false);
        return;
      }

      // Then get the institute data using the user ID
      const response = await axios.get(
        `http://localhost:3000/api/v1/institute/user/${userId}`,
        { headers }
      );

      if (response.data.success) {
        setInstitute(response.data.data);
      } else {
        setError('Failed to load institute data. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching institute data:', err);
      setError(err.response?.data?.message || 'Failed to load institute data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInstitute = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.put(
        `http://localhost:3000/api/v1/institute/${institute._id}`,
        updatedData,
        { headers }
      );

      if (response.data.success) {
        setInstitute(response.data.data);
        alert('Institute information updated successfully!');
      } else {
        setError('Failed to update institute information. Please try again.');
      }
    } catch (err) {
      console.error('Error updating institute:', err);
      setError(err.response?.data?.message || 'Failed to update institute information. Please try again.');
    }
  };

  const handleDeleteInstitute = async () => {
    if (window.confirm('Are you sure you want to delete this institute? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const response = await axios.delete(
          `http://localhost:3000/api/v1/institute/${institute._id}`,
          { headers }
        );

        if (response.data.success) {
          localStorage.removeItem('token');
          alert('Institute deleted successfully!');
          navigate('/login');
        } else {
          setError('Failed to delete institute. Please try again.');
        }
      } catch (err) {
        console.error('Error deleting institute:', err);
        setError(err.response?.data?.message || 'Failed to delete institute. Please try again.');
      }
    }
  };

  const handleNavigate = (section) => {
    // Scroll to the specific section
    if (section === 'dashboard' && dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'applications' && applicationsRef.current) {
      applicationsRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'studentManagement' && studentManagementRef.current) {
      studentManagementRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'subscriptionManagement' && subscriptionManagementRef.current) {
      subscriptionManagementRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'virtualTours' && virtualToursRef.current) {
      virtualToursRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'wishlist' && wishlistRef.current) {
      wishlistRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Close the sidebar on smaller screens
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-700">
          No institute found. Please register an institute first.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hamburger Menu for Small Screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#8C52FF] text-white p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      {isSidebarOpen || window.innerWidth >= 1024 ? (
        <Sidebar onNavigate={handleNavigate} />
      ) : null}

      {/* Right Panel */}
      <div
        className={`${
          isSidebarOpen ? 'ml-0' : 'lg:ml-72'
        } flex-1 overflow-y-auto p-4 sm:p-6 space-y-6`}
      >
        {/* Dashboard Section */}
        <div ref={dashboardRef} className="bg-white shadow-lg p-4 sm:p-6 rounded-lg">
          <h2 className="text-xl pl-10 font-semibold text-gray-700">Institute Dashboard</h2>
          <ProfileCard 
            institute={institute} 
            onUpdate={handleUpdateInstitute}
            onDelete={handleDeleteInstitute}
          />
        </div>

        {/* Applications Section */}
        <div ref={applicationsRef} className="bg-white shadow-lg p-4 sm:p-6 rounded-lg">
          <Applications instituteId={institute._id} />
        </div>

        {/* Student Management Section */}
        <div ref={studentManagementRef} className="bg-white shadow-lg p-4 sm:p-6 rounded-lg">
          <StudentManagement instituteId={institute._id} />
        </div>

        {/* Subscription Management Section */}
        <div ref={subscriptionManagementRef} className="bg-white shadow-lg p-4 sm:p-6 rounded-lg">
          <SubscriptionManagement 
            instituteId={institute._id}
            subscription={institute.subscription}
            onUpdate={handleUpdateInstitute}
          />
        </div>

        {/* Virtual Tours Section */}
        <div ref={virtualToursRef} className="bg-white shadow-lg p-4 sm:p-6 rounded-lg">
          <VirtualTour 
            instituteId={institute._id}
            onUpdate={handleUpdateInstitute}
          />
        </div>

        {/* Wishlist Section */}
        <div ref={wishlistRef} className="bg-white shadow-lg p-4 sm:p-6 rounded-lg">
          <Wishlist />
        </div>
      </div>
    </div>
  );
}

export default InstituteDashboard;
