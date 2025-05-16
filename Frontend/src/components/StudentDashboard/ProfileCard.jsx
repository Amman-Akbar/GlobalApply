import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const ProfileCard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
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
    result10th: '',
    result12th: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    disability: ''
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStudentProfile();
  }, [user, navigate]);

  const fetchStudentProfile = async () => {
    if (!user?.id) {
      setError('User data not available. Please log in again.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/api/v1/students/${user.id}`);
      if (response.data.success) {
        const profile = response.data.data;
        setStudentData(profile);
        setFormData(prevData => ({
          ...prevData,
          ...profile,
          email: user.email || ''
        }));

        // Check if profile is complete
        const isComplete = 
          profile.firstName &&
          profile.lastName &&
          profile.gender &&
          profile.dateOfBirth &&
          profile.nationality &&
          profile.email &&
          profile.phone &&
          profile.address &&
          profile.college &&
          profile.graduationYear &&
          profile.result10th &&
          profile.result12th &&
          profile.parentName &&
          profile.parentEmail &&
          profile.parentPhone &&
          profile.emergencyContactName &&
          profile.emergencyContactPhone;

        setIsProfileComplete(isComplete);
        setIsEditing(!isComplete); // If profile is incomplete, show edit mode
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      if (error.response?.status === 404) {
        // If profile doesn't exist, show edit mode
        setIsProfileComplete(false);
        setIsEditing(true);
      } else {
        setError('Failed to load profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setError('User data not available. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataToSend = {
        ...formData,
        userId: user.id,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined
      };

      console.log('Sending data:', dataToSend);

      const response = await axios.put(
        `http://localhost:3000/api/v1/students/${user.id}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setStudentData(response.data.data);
        setFormData(prevData => ({
          ...prevData,
          ...response.data.data
        }));
        setIsProfileComplete(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(prevStep => prevStep + 1);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setStep(prevStep => prevStep - 1);
  };

  const progressPercentage = step === 1 ? 0 : ((step - 1) / 2) * 100;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show read-only view if profile is complete and not editing
  if (isProfileComplete && !isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Student Profile</h2>
            <p className="text-gray-600 mt-1">View and manage your profile information</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Profile
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Details Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">Personal Details</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Name:</span>
                <span className="text-gray-800">{studentData.firstName} {studentData.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Gender:</span>
                <span className="text-gray-800">{studentData.gender}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Date of Birth:</span>
                <span className="text-gray-800">{new Date(studentData.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Nationality:</span>
                <span className="text-gray-800">{studentData.nationality}</span>
              </div>
            </div>
          </div>

          {/* Education Details Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">Education Details</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">College:</span>
                <span className="text-gray-800">{studentData.college}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Graduation Year:</span>
                <span className="text-gray-800">{studentData.graduationYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">10th Result:</span>
                <span className="text-gray-800">{studentData.result10th}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">12th Result:</span>
                <span className="text-gray-800">{studentData.result12th}</span>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Email:</span>
                <span className="text-gray-800">{studentData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Phone:</span>
                <span className="text-gray-800">{studentData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Address:</span>
                <span className="text-gray-800">{studentData.address}</span>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">Parent/Guardian Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Parent Name:</span>
                <span className="text-gray-800">{studentData.parentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Parent Email:</span>
                <span className="text-gray-800">{studentData.parentEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Parent Phone:</span>
                <span className="text-gray-800">{studentData.parentPhone}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">Emergency Contact</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Contact Name:</span>
                <span className="text-gray-800">{studentData.emergencyContactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 min-w-[120px]">Contact Phone:</span>
                <span className="text-gray-800">{studentData.emergencyContactPhone}</span>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          {studentData.disability && (
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Additional Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600 min-w-[120px]">Disability:</span>
                  <span className="text-gray-800">{studentData.disability}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show form if profile is incomplete or user is editing
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Step {step} of 3</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Education Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">College/School</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">10th Result</label>
                <input
                  type="text"
                  name="result10th"
                  value={formData.result10th}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your 10th result"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">12th Result</label>
                <input
                  type="text"
                  name="result12th"
                  value={formData.result12th}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your 12th result"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                <input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Previous
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileCard; 