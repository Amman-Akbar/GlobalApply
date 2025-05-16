import React, { useState } from 'react';

const Applications = () => {
  const [applications] = useState([
    { name: "National University of Sciences and Technology (NUST)", status: "Pending", progress: 45, details: "Application is under review, awaiting approval." },
    { name: "Lahore University of Management Sciences (LUMS)", status: "Completed", progress: 100, details: "Application completed successfully. Waiting for final decision." },
    { name: "Quaid-e-Azam University", status: "In Review", progress: 70, details: "Application is in review, checking eligibility." },
  ]);

  const [selectedApp, setSelectedApp] = useState(null);

  const handleViewDetails = (app) => {
    setSelectedApp(app);
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Applications</h2>
      <div className="space-y-6">
        {applications.map((app, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{app.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Status: <span className={`font-medium ${app.status === "Completed" ? 'text-green-600' : app.status === "Pending" ? 'text-yellow-600' : 'text-blue-600'}`}>{app.status}</span></p>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#1D5EC7] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${app.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Progress</span>
                <span>{app.progress}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => handleViewDetails(app)}
                className="text-[#1D5EC7] hover:underline font-medium"
              >
                View Details
              </button>
              <div className="space-x-4">
                {app.status !== "Completed" && (
                  <button className="text-red-600 hover:text-red-800 font-medium">Withdraw Application</button>
                )}
                <button className="text-[#1D5EC7] hover:underline font-medium">Contact Support</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedApp.name}</h3>
            <p className="text-sm text-gray-600 mb-6">{selectedApp.details}</p>
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

