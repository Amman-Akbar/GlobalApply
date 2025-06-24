import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const Applications = () => {
  const { user } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/v1/applications/student/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(response.data.data || []);
      } catch (error) {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const handleViewDetails = (app) => {
    setSelectedApp(app);
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
  };

  if (loading) {
    return <div className="text-center py-10 text-lg text-gray-500">Loading applications...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Applications</h2>
      <div className="space-y-6">
        {applications.length === 0 ? (
          <div className="text-gray-500 text-center">No applications found.</div>
        ) : (
          applications.map((app, index) => (
            <div key={app._id || index} className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {app.institute?.name || 'Institute'} - {app.program}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Status: <span className={`font-medium ${app.status === "approved" ? 'text-green-600' : app.status === "pending" ? 'text-yellow-600' : 'text-red-600'}`}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
              </p>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#1D5EC7] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: app.status === 'approved' ? '100%' : app.status === 'pending' ? '50%' : '0%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Progress</span>
                  <span>{app.status === 'approved' ? '100' : app.status === 'pending' ? '50' : '0'}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleViewDetails(app)}
                  className="text-[#1D5EC7] hover:underline font-medium"
                >
                  View Details
                </button>
                {/* Withdraw and support buttons can be added here */}
              </div>
            </div>
          ))
        )}
      </div>
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedApp.institute?.name || 'Institute'} - {selectedApp.program}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Status: {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}<br/>
              Applied on: {new Date(selectedApp.createdAt).toLocaleDateString()}
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;

