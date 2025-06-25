import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

// Modal for editing application
const EditApplicationModal = ({ application, onSave, onClose }) => {
  const [studentName, setStudentName] = useState(application.studentName);
  const [program, setProgram] = useState(application.program);
  const [status, setStatus] = useState(application.status);
  const [progress, setProgress] = useState(application.progress);
  const [submissionDate, setSubmissionDate] = useState(application.submissionDate);
  const [reviewDate, setReviewDate] = useState(application.reviewDate);

  const handleSave = () => {
    onSave({
      ...application,
      studentName,
      program,
      status,
      progress,
      submissionDate,
      reviewDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-2xl font-semibold text-gray-700">Edit Application</h3>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
          <input
            type="text"
            placeholder="Program"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
          <input
            type="number"
            placeholder="Progress (%)"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
          <input
            type="date"
            placeholder="Submission Date"
            value={submissionDate}
            onChange={(e) => setSubmissionDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
          <input
            type="date"
            placeholder="Review Date"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-300 p-2 rounded-md">Cancel</button>
          <button onClick={handleSave} className="bg-[#1D5EC7] text-white p-2 rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

const Applications = ({ instituteId: propInstituteId }) => {
  const { user } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      const instituteId = propInstituteId || user?.id;
      if (!instituteId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/v1/applications/institute/${instituteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch applications.');
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user, propInstituteId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:3000/api/v1/applications/${appId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: response.data.data.status } : app
        )
      );
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-lg text-gray-500">Loading applications...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="font-semibold text-xl text-gray-700">Student Applications</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-[#1D5EC7] text-white">
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Program</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Applied On</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.filter(app => app.status === 'pending').length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6">No pending applications found.</td>
              </tr>
            ) : (
              applications.filter(app => app.status === 'pending').map((app) => (
                <tr key={app._id} className="border-t border-gray-200 hover:bg-gray-50 transition duration-300">
                  <td className="px-4 py-2 text-gray-800">{app.student?.username || 'Student'}</td>
                  <td className="px-4 py-2 text-gray-600">{app.program}</td>
                  <td className="px-4 py-2 text-gray-700 capitalize">{app.status}</td>
                  <td className="px-4 py-2 text-gray-600">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      className="text-green-600 hover:text-green-800 transition duration-300"
                      onClick={() => handleStatusChange(app._id, 'approved')}
                      disabled={app.status === 'approved'}
                    >
                      Approve
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition duration-300"
                      onClick={() => handleStatusChange(app._id, 'rejected')}
                      disabled={app.status === 'rejected'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;
