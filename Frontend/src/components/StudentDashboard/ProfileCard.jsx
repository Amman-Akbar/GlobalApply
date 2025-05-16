import React, { useState, useEffect } from 'react';

const StudentProfile = () => {
  const [studentData, setStudentData] = useState({
    firstName: 'Sabih',
    lastName: 'Sabir',
    gender: 'Male',
    dateOfBirth: '2002-01-01',
    nationality: 'Pakistani',
    email: 'sabihSabir@gmail.com',
    phone: '+92 322 0987654',
    address: 'house 123 Street Awan Town, Lahore',
    college: 'Iqra High School',
    graduationYear: '2019',
    grade: '85%',
    parentName: 'Sabir Mehmood',
    parentEmail: '',
    parentPhone: '+92 322 0987654',
    emergencyContactName: 'Atta-Ur-Rehman',
    emergencyContactPhone: '+92 322 0987654',
    disability: 'Yes',
    profileImage: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    calculateProfileCompletion();
  }, [studentData]);

  const calculateProfileCompletion = () => {
    const totalFields = Object.keys(studentData).length;
    const filledFields = Object.values(studentData).filter(
      (value) => value && value.trim() !== ''
    ).length;
    const completionPercentage = Math.round((filledFields / totalFields) * 100);
    setProfileCompletion(completionPercentage);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(URL.createObjectURL(file));
      setStudentData({ ...studentData, profileImage: file });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Student Profile</h2>
        <button
          onClick={handleEditClick}
          className="bg-[#1D5EC7] text-white px-4 py-2 rounded-md hover:bg-[#306fd6] transition-colors duration-200"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="mb-6">
        <div className="text-lg font-medium mb-2">
          Profile Completion: {profileCompletion}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-[#1D5EC7] h-2.5 rounded-full"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
            <img
              src={newProfileImage || studentData.profileImage || 'https://media-hbe1-2.cdn.whatsapp.net/v/t61.24694-24/413995672_384671004096704_3795890438164732054_n.jpg?ccb=11-4&oh=01_Q5AaIBKq7q0SxpQCeKFuOROg6MFF4-9dtQkYHqnjc0-BIlbY&oe=679639BE&_nc_sid=5e03e0&_nc_cat=109'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <>
              <button
                className="bg-[#1D5EC7] text-white px-4 py-2 rounded-md hover:bg-[#306fd6] transition-colors duration-200"
                onClick={() => document.getElementById('imageInput').click()}
              >
                Change Profile Picture
              </button>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </>
          )}
        </div>

        {Object.entries(studentData).map(([key, value]) => {
          if (key !== 'profileImage') {
            return (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D5EC7]"
                  />
                ) : (
                  <span className="text-gray-800">{value}</span>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>

      {isEditing && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveChanges}
            className="bg-[#1D5EC7] text-white px-4 py-2 rounded-md hover:bg-[#306fd6] transition-colors duration-200"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
