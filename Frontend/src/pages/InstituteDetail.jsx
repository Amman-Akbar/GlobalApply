import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMapMarkerAlt, faRupeeSign, faGraduationCap, faBuilding, faStar, faVrCardboard, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../context/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InstituteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heartStates, setHeartStates] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedInstitute, setEditedInstitute] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();
  const [wishlistStatus, setWishlistStatus] = useState({});

  useEffect(() => {
    fetchInstituteData();
    checkUserRole();
    if (user) {
      fetchWishlistStatus();
    }
  }, [id, user]);

  const checkUserRole = () => {
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'admin');
  };

  const fetchInstituteData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/institute/${id}`);
      setInstitute(response.data.data);
      setEditedInstitute(response.data.data);
    } catch (err) {
      setError('Failed to load institute data. Please try again.');
      console.error('Error fetching institute:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistStatus = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`http://localhost:3000/api/v1/wishlist/check`, {
        params: {
          userId: user.id,
          instituteId: id
        }
      });

      if (response.data.success) {
        const status = {};
        institute?.departments.forEach((department, deptIndex) => {
          department.programs.forEach((_, progIndex) => {
            const key = `${deptIndex}-${progIndex}`;
            status[key] = response.data.data.isInWishlist;
          });
        });
        setWishlistStatus(status);
      }
    } catch (error) {
      console.error('Error fetching wishlist status:', error);
      toast.error('Failed to load wishlist status');
    }
  };

  const toggleHeart = async (departmentIndex, programIndex) => {
    if (!user) {
      toast.info('Please login to add programs to your wishlist');
      navigate('/login');
      return;
    }

    const key = `${departmentIndex}-${programIndex}`;
    const isInWishlist = wishlistStatus[key];
    const program = institute.departments[departmentIndex].programs[programIndex];

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete('http://localhost:3000/api/v1/wishlist/remove', {
          data: {
            userId: user.id,
            instituteId: id,
            programId: key
          }
        });
        toast.success(`${program.name} removed from wishlist`);
      } else {
        // Add to wishlist
        await axios.post('http://localhost:3000/api/v1/wishlist/add', {
          userId: user.id,
          instituteId: id,
          programId: key
        });
        toast.success(`${program.name} added to wishlist`);
      }

      // Update local state
      setWishlistStatus(prev => ({
        ...prev,
        [key]: !isInWishlist
      }));
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInstitute(institute);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedInstitute(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/institute/${id}`,
        editedInstitute
      );
      setInstitute(response.data.data);
      setIsEditing(false);
      alert('Institute information updated successfully!');
    } catch (err) {
      setError('Failed to update institute information. Please try again.');
      console.error('Error updating institute:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this institute? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/institute/${id}`);
        alert('Institute deleted successfully!');
        navigate('/institutes');
      } catch (err) {
        setError('Failed to delete institute. Please try again.');
        console.error('Error deleting institute:', err);
      }
    }
  };

  const handleDepartmentChange = (index, field, value) => {
    const newDepartments = [...editedInstitute.departments];
    newDepartments[index] = {
      ...newDepartments[index],
      [field]: value
    };
    setEditedInstitute(prev => ({
      ...prev,
      departments: newDepartments
    }));
  };

  const handleProgramChange = (departmentIndex, programIndex, field, value) => {
    const newDepartments = [...editedInstitute.departments];
    newDepartments[departmentIndex].programs[programIndex] = {
      ...newDepartments[departmentIndex].programs[programIndex],
      [field]: value
    };
    setEditedInstitute(prev => ({
      ...prev,
      departments: newDepartments
    }));
  };

  const handleFacilityChange = (index, value) => {
    const newFacilities = [...editedInstitute.facilities];
    newFacilities[index] = value;
    setEditedInstitute(prev => ({
      ...prev,
      facilities: newFacilities
    }));
  };

  const addFacility = () => {
    setEditedInstitute(prev => ({
      ...prev,
      facilities: [...prev.facilities, '']
    }));
  };

  const removeFacility = (index) => {
    const newFacilities = editedInstitute.facilities.filter((_, i) => i !== index);
    setEditedInstitute(prev => ({
      ...prev,
      facilities: newFacilities
    }));
  };

  const addDepartment = () => {
    setEditedInstitute(prev => ({
      ...prev,
      departments: [...prev.departments, {
        name: '',
        programs: [{
          name: '',
          semesterFee: '',
          duration: '',
          levelofProgram: '',
          deadline: '',
          isActive: false
        }]
      }]
    }));
  };

  const removeDepartment = (index) => {
    const newDepartments = editedInstitute.departments.filter((_, i) => i !== index);
    setEditedInstitute(prev => ({
      ...prev,
      departments: newDepartments
    }));
  };

  const addProgram = (departmentIndex) => {
    const newDepartments = [...editedInstitute.departments];
    newDepartments[departmentIndex].programs.push({
      name: '',
      semesterFee: '',
      duration: '',
      levelofProgram: '',
      deadline: '',
      isActive: false
    });
    setEditedInstitute(prev => ({
      ...prev,
      departments: newDepartments
    }));
  };

  const removeProgram = (departmentIndex, programIndex) => {
    const newDepartments = [...editedInstitute.departments];
    newDepartments[departmentIndex].programs = newDepartments[departmentIndex].programs.filter((_, i) => i !== programIndex);
    setEditedInstitute(prev => ({
      ...prev,
      departments: newDepartments
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error || !institute) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-600">{error || "Institute not found!"}</div>
      </div>
    );
  }

  const currentInstitute = isEditing ? editedInstitute : institute;

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="bg-[#538be6] py-14"></div>

      <div className="max-w-7xl mx-auto py-2">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Institute Banner */}
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
            <img src={currentInstitute.image} alt={currentInstitute.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <img src={currentInstitute.logo} alt={currentInstitute.name} className="w-20 h-20 rounded-full border-4 border-white" />
            </div>
          </div>

          <div className="p-6">
            {/* Institute Name & Rating */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={currentInstitute.name}
                    onChange={handleChange}
                    className="text-3xl font-bold text-gray-900 mb-2 w-full"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentInstitute.name}</h1>
                )}
                <p className="text-gray-600 flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={currentInstitute.location}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    currentInstitute.location
                  )}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center">
                <div className="mr-4">
                  <span className="text-2xl font-bold text-yellow-500">{currentInstitute.rating}</span>
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500 ml-1" />
                  <span className="text-gray-600 text-sm ml-1">({currentInstitute.totalReviews} reviews)</span>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleEdit}
                          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={handleDelete}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tabs for navigation */}
            <div className="flex border-b overflow-x-auto">
              {['overview', 'programs', 'facilities', 'virtual-tour'].map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === tab ? 'text-[#1d5ec7] border-b-2 border-[#1d5ec7]' : 'text-gray-600'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={currentInstitute.description}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      rows="4"
                    />
                  ) : (
                    <p className="text-gray-700 mb-4">{currentInstitute.description}</p>
                  )}
                  <p className="text-gray-700 flex items-center">
                    <FontAwesomeIcon icon={faRupeeSign} className="mr-2" />
                    Fee Range: {isEditing ? (
                      <input
                        type="text"
                        name="feeRange"
                        value={currentInstitute.feeRange}
                        onChange={handleChange}
                        className="ml-2"
                      />
                    ) : (
                      currentInstitute.feeRange
                    )}
                  </p>
                </div>
              )}

              {/* Programs Tab */}
              {activeTab === 'programs' && (
                <div>
                  {currentInstitute.departments.map((department, departmentIndex) => (
                    <div key={departmentIndex} className="mb-6">
                      {isEditing ? (
                        <input
                          type="text"
                          value={department.name}
                          onChange={(e) => handleDepartmentChange(departmentIndex, 'name', e.target.value)}
                          className="text-xl font-semibold text-gray-800 mb-3 w-full"
                        />
                      ) : (
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">{department.name}</h3>
                      )}
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {department.programs.map((program, programIndex) => {
                          const key = `${departmentIndex}-${programIndex}`;
                          return (
                            <div key={programIndex} className="bg-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
                              {isEditing ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={program.name}
                                    onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'name', e.target.value)}
                                    placeholder="Program Name"
                                    className="w-full"
                                  />
                                  <input
                                    type="text"
                                    value={program.semesterFee}
                                    onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'semesterFee', e.target.value)}
                                    placeholder="Semester Fee"
                                    className="w-full"
                                  />
                                  <input
                                    type="text"
                                    value={program.duration}
                                    onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'duration', e.target.value)}
                                    placeholder="Duration"
                                    className="w-full"
                                  />
                                  <input
                                    type="text"
                                    value={program.levelofProgram}
                                    onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'levelofProgram', e.target.value)}
                                    placeholder="Level of Program"
                                    className="w-full"
                                  />
                                  <input
                                    type="date"
                                    value={program.deadline}
                                    onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'deadline', e.target.value)}
                                    className="w-full"
                                  />
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={program.isActive}
                                      onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'isActive', e.target.checked)}
                                      className="mr-2"
                                    />
                                    <label>Active Program</label>
                                  </div>
                                  <button
                                    onClick={() => removeProgram(departmentIndex, programIndex)}
                                    className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                                  >
                                    Remove Program
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <h4 className="font-medium text-gray-900 mb-2">{program.name}</h4>
                                  <p className="text-gray-600 text-sm mb-1">
                                    <FontAwesomeIcon icon={faRupeeSign} className="mr-1" />
                                    {program.semesterFee}/semester
                                  </p>
                                  <p className="text-gray-600 text-sm mb-3">
                                    <FontAwesomeIcon icon={faGraduationCap} className="mr-1" />
                                    {program.duration}
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <button
                                      className="bg-[#1d5ec7] text-white px-3 py-1 rounded-full text-sm hover:bg-[#306fd6] transition duration-300"
                                      onClick={() => navigate('/apply')}
                                    >
                                      Apply Now
                                    </button>
                                    <button
                                      onClick={() => toggleHeart(departmentIndex, programIndex)}
                                      className="focus:outline-none"
                                    >
                                      <FontAwesomeIcon
                                        icon={faHeart}
                                        className={`text-xl cursor-pointer transform transition-all duration-300 ${
                                          wishlistStatus[key] 
                                            ? 'text-red-500 scale-110' 
                                            : 'text-gray-400 hover:text-red-500'
                                        }`}
                                      />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => addProgram(departmentIndex)}
                          className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                          Add Program
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={addDepartment}
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Add Department
                    </button>
                  )}
                </div>
              )}

              {/* Facilities Tab */}
              {activeTab === 'facilities' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Campus Facilities</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      {currentInstitute.facilities.map((facility, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={facility}
                            onChange={(e) => handleFacilityChange(index, e.target.value)}
                            className="flex-1"
                          />
                          <button
                            onClick={() => removeFacility(index)}
                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addFacility}
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                      >
                        Add Facility
                      </button>
                    </div>
                  ) : (
                    <ul className="grid gap-3 md:grid-cols-2">
                      {currentInstitute.facilities.map((facility, index) => (
                        <li key={index} className="flex items-center">
                          <FontAwesomeIcon icon={faBuilding} className="mr-2 text-[#1d5ec7]" />
                          <span>{facility}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Virtual Tour Tab */}
              {activeTab === 'virtual-tour' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Virtual Tour</h3>
                  <p className="text-gray-700 mb-4">Explore the campus virtually with our 360-degree interactive virtual tour.</p>
                  <a
                    href="http://localhost:5173/vt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1d5ec7] text-white px-4 py-2 rounded-full hover:bg-[#306fd6] transition duration-300"
                  >
                    Take the Virtual Tour
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteDetail;