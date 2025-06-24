import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3000/api/v1/applications');
        
        // Normalize the data structure
        const data = response.data.data || response.data;
        
        // Ensure all applications have required fields with defaults
        const normalizedApplications = Array.isArray(data) ? data.map(app => ({
          id: app._id || app.id,
          studentName: app.student?.username || 'Unknown',
          studentEmail: app.student?.email || '',
          instituteName: app.institute?.name || 'Not specified',
          instituteEmail: app.institute?.email || '',
          program: app.program || 'Not specified',
          status: app.status || 'pending',
          date: new Date(app.createdAt || new Date()).toLocaleDateString(),
          additionalInfo: app.additionalInfo || ''
        })) : [];
        
        setApplications(normalizedApplications);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filter applications based on search term and status
  const filteredApplications = applications.filter((application) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      application.studentName.toLowerCase().includes(searchTermLower) ||
      application.program.toLowerCase().includes(searchTermLower) ||
      application.instituteName.toLowerCase().includes(searchTermLower);
    
    const matchesStatus =
      statusFilter === 'All' || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Update application status
  const updateApplicationStatus = async (id, newStatus) => {
    try {
      // Optimistic UI update
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      
      // API call to update on server
      await axios.patch(`http://localhost:3000/api/v1/applications/${id}`, {
        status: newStatus
      });
      
      setSelectedApplication(null);
    } catch (err) {
      console.error('Error updating application:', err);
      // Revert if API call fails
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === id ? { ...app, status: selectedApplication.status } : app
        )
      );
      alert('Failed to update application. Please try again.');
    }
  };

  // Delete application
  const deleteApplication = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        // Optimistic UI update
        setApplications(prevApplications =>
          prevApplications.filter(app => app.id !== id)
        );
        
        // API call to delete on server
        await axios.delete(`http://localhost:3000/api/v1/applications/${id}`);
      } catch (err) {
        console.error('Error deleting application:', err);
        alert('Failed to delete application. Please try again.');
        // Refresh data if deletion fails
        const response = await axios.get('http://localhost:3000/api/v1/applications');
        const data = response.data.data || response.data;
        setApplications(data);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Search & Filter Applications</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            className="border rounded p-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search by student, program, or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border rounded p-2 w-full md:w-1/4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Applications</h3>
          <div className="text-gray-500">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b p-3 text-left">Student</th>
                <th className="border-b p-3 text-left">Program</th>
                <th className="border-b p-3 text-left">Institute</th>
                <th className="border-b p-3 text-left">Status</th>
                <th className="border-b p-3 text-left">Date</th>
                <th className="border-b p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="border-b p-3">
                      <div className="font-medium">{application.studentName}</div>
                      <div className="text-sm text-gray-500">{application.studentEmail}</div>
                    </td>
                    <td className="border-b p-3">{application.program}</td>
                    <td className="border-b p-3">
                      <div className="font-medium">{application.instituteName}</div>
                      <div className="text-sm text-gray-500">{application.instituteEmail}</div>
                    </td>
                    <td className="border-b p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="border-b p-3">{application.date}</td>
                    <td className="border-b p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteApplication(application.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="border-b p-4 text-center text-gray-500"
                  >
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Application Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Application Status</h3>
              <button 
                onClick={() => setSelectedApplication(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 space-y-2">
              <p><strong>Student:</strong> {selectedApplication.studentName}</p>
              <p><strong>Program:</strong> {selectedApplication.program}</p>
              <p><strong>Institute:</strong> {selectedApplication.instituteName}</p>
              <p><strong>Current Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedApplication.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  selectedApplication.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedApplication.status}
                </span>
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedApplication.status}
                onChange={(e) =>
                  setSelectedApplication({
                    ...selectedApplication,
                    status: e.target.value,
                  })
                }
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() =>
                  updateApplicationStatus(
                    selectedApplication.id,
                    selectedApplication.status
                  )
                }
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex-1"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedApplication(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;