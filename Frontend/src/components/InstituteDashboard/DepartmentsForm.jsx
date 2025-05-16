import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faGraduationCap,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const DepartmentsForm = ({ formData, onChange }) => {
  const [newDepartment, setNewDepartment] = useState({ name: "", programs: [] });
  const [newProgram, setNewProgram] = useState({
    name: "",
    semesterFee: "",
    duration: "",
    levelofProgram: "",
    deadline: "",
  });
  const [expandedDepartments, setExpandedDepartments] = useState({});
  
  const toggleDepartment = (index) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const addDepartment = () => {
    if (newDepartment.name.trim()) {
      onChange({ departments: [...formData.departments, newDepartment] });
      setNewDepartment({ name: "", programs: [] });
    }
  };

  const addProgram = (departmentIndex) => {
    if (
      newProgram.name.trim() &&
      newProgram.semesterFee.trim() &&
      newProgram.duration.trim()
    ) {
      const updatedDepartments = [...formData.departments];
      updatedDepartments[departmentIndex].programs.push(newProgram);
      onChange({ departments: updatedDepartments });
      setNewProgram({
        name: "",
        semesterFee: "",
        duration: "",
        levelofProgram: "",
        deadline: "",
      });
    }
  };

  const deleteDepartment = (index) => {
    const updatedDepartments = formData.departments.filter((_, i) => i !== index);
    onChange({ departments: updatedDepartments });
  };

  const deleteProgram = (departmentIndex, programIndex) => {
    const updatedDepartments = [...formData.departments];
    updatedDepartments[departmentIndex].programs = updatedDepartments[departmentIndex].programs.filter((_, i) => i !== programIndex);
    onChange({ departments: updatedDepartments });
  };

  return (
    <div className="space-y-8">
      <h4 className="text-2xl font-bold text-gray-800">
        <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
        Departments and Programs
      </h4>

      {/* List of Departments */}
      {formData.departments.map((department, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleDepartment(index)}>
            <h5 className="font-semibold text-lg text-gray-700 flex items-center">
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-blue-600" />
              {department.name}
            </h5>
            <div className="flex items-center gap-4">
              <button onClick={() => deleteDepartment(index)} className="text-red-500 hover:text-red-700">
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <FontAwesomeIcon icon={expandedDepartments[index] ? faChevronUp : faChevronDown} className="text-gray-500" />
            </div>
          </div>

          {/* Programs Section - Dropdown */}
          {expandedDepartments[index] && (
            <div className="mt-4 space-y-4">
              <ul className="space-y-4">
                {department.programs.map((program, pIndex) => (
                  <li key={pIndex} className="bg-gray-50 p-4 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700">{program.name}</p>
                      <p className="text-sm text-gray-500">
                        Duration: {program.duration} | Fee: {program.semesterFee}
                      </p>
                      <p className="text-sm text-gray-500">
                        Level: {program.levelofProgram} | Deadline: {program.deadline}
                      </p>
                    </div>
                    <button onClick={() => deleteProgram(index, pIndex)} className="text-red-500 hover:text-red-700">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add Program Form */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Program Name"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Semester Fee"
                  value={newProgram.semesterFee}
                  onChange={(e) => setNewProgram({ ...newProgram, semesterFee: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={newProgram.duration}
                  onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newProgram.levelofProgram}
                  onChange={(e) => setNewProgram({ ...newProgram, levelofProgram: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Level</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="PhD">PhD</option>
                  <option value="Associate Degree">Associate Degree</option>
                </select>
                <input
                  type="date"
                  placeholder="Deadline"
                  value={newProgram.deadline}
                  onChange={(e) => setNewProgram({ ...newProgram, deadline: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => addProgram(index)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Program
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Department Form */}
      <div className="mt-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="New Department Name"
            value={newDepartment.name}
            onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addDepartment}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Department
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsForm;
