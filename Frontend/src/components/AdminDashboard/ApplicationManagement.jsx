import React, { useState, useEffect } from 'react';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch applications from API or backend
  useEffect(() => {
    const fetchApplications = async () => {
      // Simulated API response (replace with actual API call)
      const applicationResponse = [
      {
        id: 1,
        studentName: 'Ali Hassan',
        program: 'Computer Science',
        university: 'Lahore University of Management Sciences (LUMS)',
        status: 'Pending',
        date: '2025-01-10',
      },
      {
        id: 2,
        studentName: 'Anas Waheed',
        program: 'Business Administration',
        university: 'Iqra University, Karachi',
        status: 'Accepted',
        date: '2025-01-08',
      },
      {
        id: 3,
        studentName: 'Kazim Raza',
        program: 'Engineering',
        university: 'National University of Sciences and Technology (NUST)',
        status: 'Rejected',
        date: '2025-01-07',
      },
    ];


      setApplications(applicationResponse);
    };

    fetchApplications();
  }, []);

  // Filter applications based on search term and status
  const filteredApplications = applications.filter((application) => {
    const matchesSearch = application.studentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Update application status
  const updateApplicationStatus = (id, newStatus) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    setSelectedApplication(null);
  };

  // Delete application
  const deleteApplication = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app.id !== id)
      );
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Filters */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Search & Filter Applications</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            className="border rounded p-2 w-full md:w-1/3"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border rounded p-2 w-full md:w-1/4"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Applications</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Student Name</th>
                <th className="border border-gray-300 p-2">Program</th>
                <th className="border border-gray-300 p-2">University</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <tr key={application.id} className="text-center">
                    <td className="border border-gray-300 p-2">
                      {application.studentName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {application.program}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {application.university}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {application.status}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {application.date}
                    </td>
                    <td className="border border-gray-300 p-2 flex justify-center gap-2">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteApplication(application.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="border border-gray-300 p-4 text-center text-gray-500"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Application Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              Update Application Status
            </h3>
            <p className="mb-4">
              <strong>Student:</strong> {selectedApplication.studentName}
              <br />
              <strong>Program:</strong> {selectedApplication.program}
              <br />
              <strong>University:</strong> {selectedApplication.university}
            </p>
            <select
              className="border rounded p-2 w-full mb-4"
              value={selectedApplication.status}
              onChange={(e) =>
                setSelectedApplication({
                  ...selectedApplication,
                  status: e.target.value,
                })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  updateApplicationStatus(
                    selectedApplication.id,
                    selectedApplication.status
                  )
                }
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setSelectedApplication(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
