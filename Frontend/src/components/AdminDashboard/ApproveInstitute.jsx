import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ApproveInstitute = () => {
  const [step, setStep] = useState(1);
  const [pendingInstitutes, setPendingInstitutes] = useState([]);
  const [approvedInstitutes, setApprovedInstitutes] = useState([]);
  const [rejectedInstitutes, setRejectedInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/v1/institute?status=pending");
      setPendingInstitutes(response.data.data);

      const approvedResponse = await axios.get("http://localhost:3000/api/v1/institute?status=approved");
      setApprovedInstitutes(approvedResponse.data.data);

      const rejectedResponse = await axios.get("http://localhost:3000/api/v1/institute?status=rejected");
      setRejectedInstitutes(rejectedResponse.data.data);
    } catch (err) {
      setError("Failed to fetch institutes. Please try again.");
      console.error("Error fetching institutes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/v1/institute/${id}/approve`);
      const approvedInstitute = response.data.data;
      
      setApprovedInstitutes([...approvedInstitutes, approvedInstitute]);
      setPendingInstitutes((prev) => prev.filter((inst) => inst._id !== id));
      alert("Institute Approved!");
      setStep(1);
    } catch (err) {
      setError("Failed to approve institute. Please try again.");
      console.error("Error approving institute:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/v1/institute/${id}/reject`);
      const rejectedInstitute = response.data.data;
      
      setRejectedInstitutes([...rejectedInstitutes, rejectedInstitute]);
      setPendingInstitutes((prev) => prev.filter((inst) => inst._id !== id));
      alert("Institute Rejected!");
      setStep(1);
    } catch (err) {
      setError("Failed to reject institute. Please try again.");
      console.error("Error rejecting institute:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Approve Pending Institutes</h2>

      {step === 1 && (
        <div>
          {/* Pending Institutes */}
          <h3 className="text-lg font-semibold mb-4">Pending Institutes</h3>
          {pendingInstitutes.length === 0 ? (
            <p className="text-center text-gray-500">No pending institutes.</p>
          ) : (
            <ul className="space-y-4">
              {pendingInstitutes.map((inst) => (
                <li key={inst._id} className="p-4 border rounded-md flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-medium">{inst.name}</h4>
                    <p className="text-sm text-gray-500">{inst.location}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedInstitute(inst);
                      setStep(2);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Review
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Approved Institutes */}
          {approvedInstitutes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Approved Institutes</h3>
              <ul className="space-y-4">
                {approvedInstitutes.map((inst) => (
                  <li key={inst._id} className="p-4 border rounded-md flex justify-between items-center bg-green-100">
                    <div>
                      <h4 className="text-lg font-medium">{inst.name}</h4>
                      <p className="text-sm text-gray-500">{inst.location}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedInstitute(inst);
                        setStep(2);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rejected Institutes */}
          {rejectedInstitutes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Rejected Institutes</h3>
              <ul className="space-y-4">
                {rejectedInstitutes.map((inst) => (
                  <li key={inst._id} className="p-4 border rounded-md flex justify-between items-center bg-red-100">
                    <div>
                      <h4 className="text-lg font-medium">{inst.name}</h4>
                      <p className="text-sm text-gray-500">{inst.location}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Review Institute */}
      {step === 2 && selectedInstitute && (
        <div>
          <button onClick={() => setStep(1)} className="mb-4 flex items-center text-gray-600 hover:text-gray-800">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back
          </button>

          <h3 className="text-lg font-semibold mb-4">{selectedInstitute.name}</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Location:</label>
            <input
              type="text"
              value={selectedInstitute.location}
              disabled
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="text"
              value={selectedInstitute.email}
              disabled
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contact:</label>
            <input
              type="text"
              value={selectedInstitute.contact}
              disabled
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Website:</label>
            <input
              type="text"
              value={selectedInstitute.website}
              disabled
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Registration Number:</label>
            <input
              type="text"
              value={selectedInstitute.registrationNumber}
              disabled
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Description:</label>
            <textarea
              value={selectedInstitute.description}
              disabled
              rows="4"
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          <div className="flex gap-4 mt-6">
            {selectedInstitute.status === "pending" && (
              <>
                <button onClick={() => handleApprove(selectedInstitute._id)} className="flex-1 bg-green-600 text-white py-2 rounded-md">
                  <FontAwesomeIcon icon={faCheck} className="mr-2" /> Approve
                </button>
                <button onClick={() => handleReject(selectedInstitute._id)} className="flex-1 bg-red-600 text-white py-2 rounded-md">
                  <FontAwesomeIcon icon={faTimes} className="mr-2" /> Reject
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveInstitute;
