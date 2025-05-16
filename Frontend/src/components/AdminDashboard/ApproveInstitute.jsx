import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck, faTimes, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ApproveInstitute = () => {
  const [step, setStep] = useState(1);
  const [pendingInstitutes, setPendingInstitutes] = useState([]);
  const [approvedInstitutes, setApprovedInstitutes] = useState([]);
  const [rejectedInstitutes, setRejectedInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleEdit = () => setIsEditing(true);

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/institute/${selectedInstitute._id}`,
        selectedInstitute
      );
      setSelectedInstitute(response.data.data);
      setIsEditing(false);
      alert("Changes Saved!");
      
      // Refresh the institutes list
      fetchInstitutes();
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error("Error saving changes:", err);
    }
  };

  const handleDepartmentChange = (deptIndex, key, value) => {
    const updatedInstitute = { ...selectedInstitute };
    updatedInstitute.departments[deptIndex][key] = value;
    setSelectedInstitute(updatedInstitute);
  };

  const handleProgramChange = (deptIndex, progIndex, key, value) => {
    const updatedInstitute = { ...selectedInstitute };
    updatedInstitute.departments[deptIndex].programs[progIndex][key] = value;
    setSelectedInstitute(updatedInstitute);
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
              disabled={!isEditing}
              onChange={(e) => setSelectedInstitute({ ...selectedInstitute, location: e.target.value })}
              className={`w-full p-2 border rounded-md ${isEditing ? "border-blue-500" : "bg-gray-200"}`}
            />
          </div>

          <h4 className="text-lg font-semibold mb-2">Departments & Programs</h4>
          {selectedInstitute.departments.map((dept, deptIndex) => (
            <div key={deptIndex} className="mb-4 p-4 border rounded-md">
              <label className="block text-gray-700 font-semibold">Department Name:</label>
              <input
                type="text"
                value={dept.name}
                disabled={!isEditing}
                onChange={(e) => handleDepartmentChange(deptIndex, "name", e.target.value)}
                className={`w-full p-2 border rounded-md mb-4 ${isEditing ? "border-blue-500" : "bg-gray-200"}`}
              />

              <h5 className="text-md font-semibold mb-2">Programs</h5>
              {dept.programs.map((program, progIndex) => (
                <div key={progIndex} className="mb-4 p-3 border rounded-md">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="w-32 font-semibold">Name:</label>
                    <input
                      type="text"
                      value={program.name}
                      disabled={!isEditing}
                      onChange={(e) => handleProgramChange(deptIndex, progIndex, "name", e.target.value)}
                      className={`flex-1 p-2 border rounded-md ${isEditing ? "border-blue-500" : "bg-gray-200"}`}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                    <label className="w-32 font-semibold">Semester Fee:</label>
                    <input
                      type="text"
                      value={program.semesterFee}
                      disabled={!isEditing}
                      onChange={(e) => handleProgramChange(deptIndex, progIndex, "semesterFee", e.target.value)}
                      className={`flex-1 p-2 border rounded-md ${isEditing ? "border-blue-500" : "bg-gray-200"}`}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                    <label className="w-32 font-semibold">Deadline:</label>
                    <input
                      type="text"
                      value={program.deadline}
                      disabled={!isEditing}
                      onChange={(e) => handleProgramChange(deptIndex, progIndex, "deadline", e.target.value)}
                      className={`flex-1 p-2 border rounded-md ${isEditing ? "border-blue-500" : "bg-gray-200"}`}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                    <label className="w-32 font-semibold">Level:</label>
                    <input
                      type="text"
                      value={program.levelofProgram}
                      disabled={!isEditing}
                      onChange={(e) => handleProgramChange(deptIndex, progIndex, "levelofProgram", e.target.value)}
                      className={`flex-1 p-2 border rounded-md ${isEditing ? "border-blue-500" : "bg-gray-200"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="flex gap-4 mt-6">
            {selectedInstitute.status === "pending" && (
              <>
                <button onClick={handleEdit} className="flex-1 bg-yellow-500 text-white py-2 rounded-md">
                  <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit
                </button>
                <button onClick={handleSaveEdit} className="flex-1 bg-green-600 text-white py-2 rounded-md">
                  <FontAwesomeIcon icon={faSave} className="mr-2" /> Save Changes
                </button>
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
