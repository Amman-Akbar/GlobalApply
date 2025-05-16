import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faMapMarkerAlt, faGlobe, faPhone, faTimes } from '@fortawesome/free-solid-svg-icons';
import BasicInfoForm from './BasicInfoForm';
import DepartmentsForm from './DepartmentsForm';
import FacilitiesForm from './FacilitiesForm';

const ProfileCard = ({ onUpdate, onDelete }) => {
  const { user } = useUser();
  const [institute, setInstitute] = useState(null);
  const [showMultiStepForm, setShowMultiStepForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    location: '',
    website: '',
    registrationNumber: '',
    description: '',
    feeRange: '',
    logo: '',
    image: '',
    departments: [],
    facilities: [],
  });

  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const response = await axios.get(
          `http://localhost:3000/api/v1/institute/user/${user.id}`,
          { headers }
        );
        
        if (response.data?.success) {
          setInstitute(response.data.data);
          setFormData(response.data.data);
        } else {
          setError('No institute found');
          setInstitute(null);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.response?.data?.message || 'Failed to fetch institute data');
        setInstitute(null);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && user?.role === 'institute') {
      fetchInstitute();
    } else {
      setError('User not logged in or not an institute');
      setInstitute(null);
      setLoading(false);
    }
  }, [user?.id, user?.role]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.put(
        `http://localhost:3000/api/v1/institute/${institute._id}`,
        formData,
        { headers }
      );

      if (response.data.success) {
        setInstitute(response.data.data);
        setShowMultiStepForm(false);
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        alert('Institute information updated successfully!');
      } else {
        setError('Failed to update institute information');
      }
    } catch (error) {
      console.error('Error updating institute:', error);
      setError(error.response?.data?.message || 'Failed to update institute information');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this institute? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const response = await axios.delete(
          `http://localhost:3000/api/v1/institute/${institute._id}`,
          { headers }
        );

        if (response.data.success) {
          if (onDelete) {
            onDelete();
          }
          alert('Institute deleted successfully!');
        } else {
          setError('Failed to delete institute');
        }
      } catch (error) {
        console.error('Error deleting institute:', error);
        setError(error.response?.data?.message || 'Failed to delete institute');
      }
    }
  };

  const calculateCompletion = () => {
    const fields = ['name', 'email', 'contact', 'location', 'website', 'registrationNumber', 'description', 'feeRange', 'logo', 'image'];
    const filled = fields.filter(field => institute?.[field]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleFormChange = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const closeMultiStepForm = () => {
    setShowMultiStepForm(false);
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoForm formData={formData} onChange={handleFormChange} />;
      case 1:
        return <DepartmentsForm formData={formData} onChange={handleFormChange} />;
      case 2:
        return <FacilitiesForm formData={formData} onChange={handleFormChange} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!institute) {
    return <div className="text-center py-10">No institute found. Please register an institute first.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-600 h-40 flex items-end justify-between p-6">
          <h1 className="text-3xl font-bold text-white">{institute.name}</h1>
          <div className="bg-white rounded-full p-2">
            <img
              src={institute.logo || 'https://via.placeholder.com/100'}
              alt="Institute logo"
              className="w-24 h-24 rounded-full"
            />
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">{institute.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 mr-2" />
              <span>{institute.location}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faGlobe} className="text-blue-600 mr-2" />
              <a href={institute.website} className="text-blue-600 hover:underline">{institute.website}</a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPhone} className="text-blue-600 mr-2" />
              <span>{institute.contact}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faGraduationCap} className="text-blue-600 mr-2" />
              <span>{institute.feeRange}</span>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-gray-600">{calculateCompletion()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2"
                style={{ width: `${calculateCompletion()}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            {!showMultiStepForm && (
              <button
                onClick={() => setShowMultiStepForm(true)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Complete Profile
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
            >
              Delete Institute
            </button>
          </div>
        </div>
      </div>

      {showMultiStepForm && (
        <div className="mt-8 bg-white shadow-xl rounded-lg p-6 relative">
          <button
            onClick={closeMultiStepForm}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
          <h3 className="text-2xl font-semibold mb-6">Complete Your Profile</h3>
          {renderFormStep()}
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Previous
              </button>
            )}
            {currentStep < 2 ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
