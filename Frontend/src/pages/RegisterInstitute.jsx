import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterInstitute = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    location: '',
    website: '',
    registrationNumber: '',
    feeRange: '',
    description: '',
    facilities: [''],
    departments: [{
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
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFacilityChange = (index, value) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index] = value;
    setFormData({
      ...formData,
      facilities: newFacilities
    });
  };

  const addFacility = () => {
    setFormData({
      ...formData,
      facilities: [...formData.facilities, '']
    });
  };

  const removeFacility = (index) => {
    const newFacilities = formData.facilities.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      facilities: newFacilities
    });
  };

  const handleDepartmentChange = (index, field, value) => {
    const newDepartments = [...formData.departments];
    newDepartments[index] = {
      ...newDepartments[index],
      [field]: value
    };
    setFormData({
      ...formData,
      departments: newDepartments
    });
  };

  const addDepartment = () => {
    setFormData({
      ...formData,
      departments: [...formData.departments, {
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
    });
  };

  const removeDepartment = (index) => {
    const newDepartments = formData.departments.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      departments: newDepartments
    });
  };

  const handleProgramChange = (departmentIndex, programIndex, field, value) => {
    const newDepartments = [...formData.departments];
    newDepartments[departmentIndex].programs[programIndex] = {
      ...newDepartments[departmentIndex].programs[programIndex],
      [field]: value
    };
    setFormData({
      ...formData,
      departments: newDepartments
    });
  };

  const addProgram = (departmentIndex) => {
    const newDepartments = [...formData.departments];
    newDepartments[departmentIndex].programs.push({
      name: '',
      semesterFee: '',
      duration: '',
      levelofProgram: '',
      deadline: '',
      isActive: false
    });
    setFormData({
      ...formData,
      departments: newDepartments
    });
  };

  const removeProgram = (departmentIndex, programIndex) => {
    const newDepartments = [...formData.departments];
    newDepartments[departmentIndex].programs = newDepartments[departmentIndex].programs.filter((_, i) => i !== programIndex);
    setFormData({
      ...formData,
      departments: newDepartments
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // First, register the user account
      const userResponse = await axios.post("http://localhost:3000/api/v1/auth/register-institute", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contact: formData.contact,
        location: formData.location,
        website: formData.website,
        registrationNumber: formData.registrationNumber,
        description: formData.description,
        logo: formData.logo
      });

      if (userResponse.data.token) {
        // Store the token
        localStorage.setItem('token', userResponse.data.token);
        
        // Create the institute with the user ID
        const instituteData = {
          ...formData,
          userId: userResponse.data.user.id
        };

        const instituteResponse = await axios.post(
          "http://localhost:3000/api/v1/institute",
          instituteData,
          {
            headers: {
              'Authorization': `Bearer ${userResponse.data.token}`
            }
          }
        );

        if (instituteResponse.data.success) {
          // Store the institute ID in localStorage
          localStorage.setItem('instituteId', instituteResponse.data.data._id);
          alert("Institute registered successfully!");
          navigate("/institute-dashboard");
        } else {
          setError("Institute registration failed. Please try again.");
        }
      } else {
        setError("User registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.error("Error registering institute:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-28 px-6">
      <h2 className="text-3xl font-medium text-center mb-6">Register as an Institute</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl space-y-6"
      >
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Institute Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter institute name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              placeholder="Enter contact number"
              value={formData.contact}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <textarea
              id="location"
              name="location"
              placeholder="Enter institute location"
              value={formData.location}
              onChange={handleChange}
              rows="3"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              placeholder="Enter institute website"
              value={formData.website}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
              Registration Number
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              placeholder="Enter registration number"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="feeRange" className="block text-sm font-medium text-gray-700">
              Fee Range
            </label>
            <input
              type="text"
              id="feeRange"
              name="feeRange"
              placeholder="Enter fee range"
              value={formData.feeRange}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter institute description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        {/* Facilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facilities
          </label>
          {formData.facilities.map((facility, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={facility}
                onChange={(e) => handleFacilityChange(index, e.target.value)}
                placeholder="Enter facility"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeFacility(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFacility}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Facility
          </button>
        </div>

        {/* Departments and Programs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departments and Programs
          </label>
          {formData.departments.map((department, departmentIndex) => (
            <div key={departmentIndex} className="mb-6 p-4 border rounded-lg">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={department.name}
                  onChange={(e) => handleDepartmentChange(departmentIndex, 'name', e.target.value)}
                  placeholder="Department Name"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeDepartment(departmentIndex)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove Department
                </button>
              </div>

              {/* Programs */}
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Programs</h4>
                {department.programs.map((program, programIndex) => (
                  <div key={programIndex} className="mb-4 p-3 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={program.name}
                        onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'name', e.target.value)}
                        placeholder="Program Name"
                        className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        value={program.semesterFee}
                        onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'semesterFee', e.target.value)}
                        placeholder="Semester Fee"
                        className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        value={program.duration}
                        onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'duration', e.target.value)}
                        placeholder="Duration"
                        className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        value={program.levelofProgram}
                        onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'levelofProgram', e.target.value)}
                        placeholder="Level of Program"
                        className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="date"
                        value={program.deadline}
                        onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'deadline', e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={program.isActive}
                          onChange={(e) => handleProgramChange(departmentIndex, programIndex, 'isActive', e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Active Program</label>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProgram(departmentIndex, programIndex)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove Program
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addProgram(departmentIndex)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Program
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addDepartment}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Department
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register Institute'}
        </button>
      </form>
    </div>
  );
};

export default RegisterInstitute;