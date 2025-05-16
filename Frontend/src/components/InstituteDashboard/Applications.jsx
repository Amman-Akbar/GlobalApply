import React, { useState } from 'react';

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

const Applications = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      studentName: "Ahmed Khan",
      program: "Computer Science",
      status: "Pending",
      progress: 50,
      submissionDate: "2024-12-01",
      reviewDate: "2024-12-10",
    },
    {
      id: 2,
      studentName: "Sara Ali",
      program: "Business Administration",
      status: "Reviewed",
      progress: 100,
      submissionDate: "2024-11-15",
      reviewDate: "2024-11-25",
    },
    {
      id: 3,
      studentName: "Ali Raza",
      program: "Mechanical Engineering",
      status: "Under Review",
      progress: 75,
      submissionDate: "2024-11-20",
      reviewDate: "2024-12-05",
    },
    {
      id: 4,
      studentName: "Fatima Nasir",
      program: "Electrical Engineering",
      status: "Rejected",
      progress: 30,
      submissionDate: "2024-10-05",
      reviewDate: "2024-10-15",
    },
    {
      id: 5,
      studentName: "Zainab Shah",
      program: "Pharmacy",
      status: "Pending",
      progress: 60,
      submissionDate: "2024-11-30",
      reviewDate: "2024-12-10",
    },
  ]);
  

  const [editingApp, setEditingApp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appToConfirm, setAppToConfirm] = useState(null);

  const handleEdit = (app) => {
    setEditingApp(app);
    setShowEditModal(true);
  };

  const handleSaveApplication = (updatedApp) => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === updatedApp.id ? { ...app, ...updatedApp } : app
      )
    );
  };

  const handleReview = (app) => {
    setConfirmationMessage(`Are you sure you want to review the application of ${app.studentName}?`);
    setAppToConfirm({ ...app, status: 'Under Review' }); // Set the status to 'Under Review'
    setShowConfirmModal(true);
  };
  
  const handleAccept = (app) => {
    setConfirmationMessage(`Are you sure you want to accept the application of ${app.studentName}?`);
    setAppToConfirm({ ...app, status: 'Accepted' }); // Set the status to 'Accepted'
    setShowConfirmModal(true);
  };
  
  const handleReject = (app) => {
    setConfirmationMessage(`Are you sure you want to reject the application of ${app.studentName}?`);
    setAppToConfirm({ ...app, status: 'Rejected' }); // Set the status to 'Rejected'
    setShowConfirmModal(true);
  };
  

  const confirmAction = () => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === appToConfirm.id
          ? {
              ...app,
              status: appToConfirm.status, // Set the status to the chosen action
              progress: appToConfirm.status === 'Accepted' ? 100 : app.progress, // If accepted, set progress to 100
            }
          : app
      )
    );
    setShowConfirmModal(false);
    setAppToConfirm(null);
  };
  

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="font-semibold text-xl text-gray-700">Student Applications</h3>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-[#1D5EC7] text-white">
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Program</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Progress</th>
              <th className="px-4 py-2">Submission Date</th>
              <th className="px-4 py-2">Review Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t border-gray-200 hover:bg-gray-50 transition duration-300">
                <td className="px-4 py-2 text-gray-800">{app.studentName}</td>
                <td className="px-4 py-2 text-gray-600">{app.program}</td>
                <td className="px-4 py-2 text-gray-700">{app.status}</td>
                <td className="px-4 py-2">
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-[#1D5EC7] h-2 rounded-full"
                      style={{ width: `${app.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>{app.progress}%</span>
                    <span>Progress</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-gray-600">{app.submissionDate}</td>
                <td className="px-4 py-2 text-gray-600">{app.reviewDate}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="text-[#1D5EC7] hover:text-[#306fd6] transition duration-300"
                    onClick={() => handleEdit(app)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-[#1D5EC7] hover:text-[#306fd6] transition duration-300"
                    onClick={() => handleReview(app)}
                  >
                    Review
                  </button>
                  <button
                    className="text-[#1D5EC7] hover:text-[#306fd6] transition duration-300"
                    onClick={() => handleAccept(app)}
                  >
                    Accept
                  </button>
                  <button
                    className="text-[#1D5EC7] hover:text-[#306fd6] transition duration-300"
                    onClick={() => handleReject(app)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <EditApplicationModal application={editingApp} onSave={handleSaveApplication} onClose={() => setShowEditModal(false)} />
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-gray-700">{confirmationMessage}</h3>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 p-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="bg-[#1D5EC7] text-white p-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
