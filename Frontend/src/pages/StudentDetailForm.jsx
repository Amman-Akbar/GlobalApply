import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDetailForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    email: '',
    phone: '',
    address: '',
    college: '',
    graduationYear: '',
    grade: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    disability: '',
    cnicImage: null,
    fatherCnicImage: null,
    ResultImage12th: null,
    ResultImage10th: null,
    EntryTestImage: null,
  });

  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    navigate('/student-dashboard');
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <>
    <div className="bg-[#538be6] py-14">
      </div>
    <div className="max-w-6xl mx-auto p-6 py-10">
      <h1 className="text-3xl font-semibold text-[#1D5EC7] mb-6">Student Admission Form</h1>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-[#1D5EC7] h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-medium mb-4">Personal Details</h2>
            <div className="flex flex-col">
              <label htmlFor="firstName" className="text-lg font-medium text-gray-800 mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="lastName" className="text-lg font-medium text-gray-800 mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="gender" className="text-lg font-medium text-gray-800 mb-2">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="dateOfBirth" className="text-lg font-medium text-gray-800 mb-2">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-medium mb-4">Education Details</h2>
            <div className="flex flex-col">
              <label htmlFor="college" className="text-lg font-medium text-gray-800 mb-2">FA/FSC/ICS Marks</label>
              <input
                type="text"
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="graduationYear" className="text-lg font-medium text-gray-800 mb-2">Passing Year</label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="grade" className="text-lg font-medium text-gray-800 mb-2">10th Marks/Percentage</label>
              <input
                type="text"
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-medium mb-4">Contact Information</h2>
            <div className="flex flex-col">
              <label htmlFor="parentName" className="text-lg font-medium text-gray-800 mb-2">Parent/Guardian Name</label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="parentPhone" className="text-lg font-medium text-gray-800 mb-2">Parent/Guardian Phone Number</label>
              <input
                type="tel"
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="emergencyContactName" className="text-lg font-medium text-gray-800 mb-2">Emergency Contact Name</label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="emergencyContactPhone" className="text-lg font-medium text-gray-800 mb-2">Emergency Contact Phone</label>
              <input
                type="tel"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-medium mb-4">Upload Images</h2>
            <div className="flex flex-col">
              <label htmlFor="cnicImage" className="text-lg font-medium text-gray-800 mb-2">CNIC Image</label>
              <input
                type="file"
                id="cnicImage"
                name="cnicImage"
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="fatherCnicImage" className="text-lg font-medium text-gray-800 mb-2">Father CNIC Image</label>
              <input
                type="file"
                id="fatherCnicImage"
                name="fatherCnicImage"
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="ResultImage12th" className="text-lg font-medium text-gray-800 mb-2">12th Result Image</label>
              <input
                type="file"
                id="ResultImage12th"
                name="ResultImage12th"
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="ResultImage10th" className="text-lg font-medium text-gray-800 mb-2">10th Result Image</label>
              <input
                type="file"
                id="ResultImage10th"
                name="ResultImage10th"
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="EntryTestImage" className="text-lg font-medium text-gray-800 mb-2">Entry Test Image</label>
              <input
                type="file"
                id="EntryTestImage"
                name="EntryTestImage"
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-300 text-gray-800 p-3 rounded-lg"
            >
              Previous
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-[#1D5EC7] text-white p-3 rounded-lg"
            >
              Next
            </button>
          ) : (
            <button type="submit" className="bg-green-500 text-white p-3 rounded-lg">
              Submit Application
            </button>
          )}
        </div>
      </form>
    </div>
    </>
  );
};

export default StudentDetailForm;
