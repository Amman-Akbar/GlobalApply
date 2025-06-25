import React, { useState, useEffect } from 'react';
import axios from 'axios';

const sensitiveFields = [
  'First Name', 'Last Name', 'Gender', 'Date of Birth', 'Nationality', 'College', 'Graduation Year',
  '10th Result', '12th Result', 'Phone', 'Address', 'Parent Name', 'Parent Email', 'Parent Phone',
  'Emergency Contact Name', 'Emergency Contact Phone'
];

const StudentManagement = ({ instituteId }) => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailsError, setDetailsError] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!instituteId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/v1/applications/institute/${instituteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Only keep approved or rejected applications
        const filtered = (response.data.data || []).filter(
          (app) => app.status === 'approved' || app.status === 'rejected'
        );
        setApplications(filtered);
        setError('');
      } catch (err) {
        setError('Failed to fetch students.');
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [instituteId]);

  // Fetch current subscription plan and status for the institute
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!instituteId) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/v1/institute/${instituteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const institute = response.data.data;
        if (institute && institute.subscription) {
          setSubscriptionStatus(institute.subscriptionStatus || null);
          // Fetch all subscriptions to get planName
          const subsRes = await axios.get('http://localhost:3000/api/v1/subscriptions', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const plan = subsRes.data.find(sub => sub._id === institute.subscription);
          setSubscriptionPlan(plan ? plan.planName : null);
        } else {
          setSubscriptionPlan(null);
          setSubscriptionStatus(institute?.subscriptionStatus || null);
        }
      } catch (err) {
        setSubscriptionPlan(null);
        setSubscriptionStatus(null);
      }
    };
    fetchSubscription();
  }, [instituteId]);

  // Filter applications based on the student's username
  const filteredApplications = applications.filter((app) =>
    app.student?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle application selection
  const handleSelectApplication = async (app) => {
    setSelectedApplication(app);
    setStudentDetails(null);
    setDetailsError('');
    if (!app.student?._id) return;
    setDetailsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/v1/students/${app.student._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentDetails(response.data.data);
    } catch (err) {
      setDetailsError('Failed to fetch student details.');
      setStudentDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Close the details modal
  const handleCloseModal = () => {
    setSelectedApplication(null);
    setStudentDetails(null);
    setDetailsError('');
  };

  if (loading) {
    return <div className="text-center py-10 text-lg text-gray-500">Loading students...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  // Helper to display a field if it exists, with strong blur and tooltip if blurred
  const renderField = (label, value, blur = false) => (
    value ? (
      <div className={blur ? 'relative group select-none' : ''}>
        <span className="font-semibold">{label}:</span>{' '}
        <span
          className={blur ? 'blur-sm pointer-events-none text-gray-400' : ''}
          style={blur ? { filter: 'blur(3px)', userSelect: 'none' } : {}}
        >
          {value}
        </span>
        {blur && (
          <span className="absolute left-0 top-full mt-1 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
            Hidden due to Free or Pending Plan
          </span>
        )}
      </div>
    ) : null
  );

  // Blur if no plan, free plan, or pending status
  const shouldBlur = !subscriptionPlan || (subscriptionPlan && subscriptionPlan.toLowerCase() === 'free') || subscriptionStatus === 'pending';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-xl font-semibold text-gray-700 flex-grow">Student Management</h3>
        <div className="flex items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by student username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D5EC7] w-full sm:w-60"
          />
        </div>
      </div>
      {/* Student List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center text-gray-500">No students found.</div>
        ) : (
          filteredApplications.map((app) => (
            <div key={app._id} className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold text-gray-700">{app.student?.username}</h4>
                <p className="text-sm text-gray-600">{app.student?.email}</p>
                <p className="text-sm text-gray-600">{app.program}</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-600">Status: {app.status}</p>
                <button
                  className="ml-4 text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => handleSelectApplication(app)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Student Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Student Details</h2>
            {detailsLoading ? (
              <div className="text-center py-4 text-gray-500">Loading details...</div>
            ) : detailsError ? (
              <div className="text-center py-4 text-red-600">{detailsError}</div>
            ) : (
              <div className="space-y-2">
                {/* Application details */}
                {renderField('Username', selectedApplication.student?.username)}
                {renderField('Email', selectedApplication.student?.email)}
                {renderField('Program', selectedApplication.program)}
                {renderField('Status', selectedApplication.status)}
                {renderField('Applied At', selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleString() : null)}
                {renderField('Last Updated', selectedApplication.updatedAt ? new Date(selectedApplication.updatedAt).toLocaleString() : null)}
                <hr className="my-2" />
                {/* Student model details */}
                {studentDetails && (
                  <>
                    {renderField('First Name', studentDetails.firstName, shouldBlur)}
                    {renderField('Last Name', studentDetails.lastName, shouldBlur)}
                    {renderField('Gender', studentDetails.gender, shouldBlur)}
                    {renderField('Date of Birth', studentDetails.dateOfBirth ? new Date(studentDetails.dateOfBirth).toLocaleDateString() : null, shouldBlur)}
                    {renderField('Nationality', studentDetails.nationality, shouldBlur)}
                    {renderField('College', studentDetails.college, shouldBlur)}
                    {renderField('Graduation Year', studentDetails.graduationYear, shouldBlur)}
                    {renderField('10th Result', studentDetails.result10th, shouldBlur)}
                    {renderField('12th Result', studentDetails.result12th, shouldBlur)}
                    {renderField('Phone', studentDetails.phone, shouldBlur)}
                    {renderField('Address', studentDetails.address, shouldBlur)}
                    {renderField('Parent Name', studentDetails.parentName, shouldBlur)}
                    {renderField('Parent Email', studentDetails.parentEmail, shouldBlur)}
                    {renderField('Parent Phone', studentDetails.parentPhone, shouldBlur)}
                    {renderField('Emergency Contact Name', studentDetails.emergencyContactName, shouldBlur)}
                    {renderField('Emergency Contact Phone', studentDetails.emergencyContactPhone, shouldBlur)}
                    {renderField('Disability', studentDetails.disability)}
                  </>
                )}
                {shouldBlur && (
                  <div className="mt-4 text-center text-xs text-gray-500 italic">Some details are hidden due to your current Free or Pending subscription plan.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;