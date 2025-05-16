import React, { useState } from 'react';

const StudentManagement = () => {
  // Sample student data
  const [students, setStudents] = useState([
    { id: 1, name: 'Ahmed Khan', program: 'Computer Science', status: 'Accepted', progress: 95 },
    { id: 2, name: 'Sara Ali', program: 'Business Administration', status: 'Pending', progress: 50 },
    { id: 3, name: 'Ali Raza', program: 'Mechanical Engineering', status: 'In Review', progress: 85 },
    { id: 4, name: 'Fatima Nasir', program: 'Electrical Engineering', status: 'Rejected', progress: 30 },
    { id: 5, name: 'Zainab Shah', program: 'Pharmacy', status: 'Pending', progress: 60 },
  ]);
  

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filter students based on the search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle student selection
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };

  // Handle updating student status
  const handleStatusChange = (status) => {
    if (selectedStudent) {
      // Update the status in the student list and selected student
      const updatedStudents = students.map((student) =>
        student.id === selectedStudent.id ? { ...student, status } : student
      );
      setStudents(updatedStudents);
      setSelectedStudent({ ...selectedStudent, status });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-xl font-semibold text-gray-700 flex-grow">Student Management</h3>
        <div className="flex items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D5EC7] w-full sm:w-60"
          />
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white shadow-md p-6 rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left text-gray-600">Name</th>
              <th className="py-3 px-4 text-left text-gray-600">Program</th>
              <th className="py-3 px-4 text-left text-gray-600">Status</th>
              <th className="py-3 px-4 text-left text-gray-600">Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="border-b cursor-pointer hover:bg-gray-50"
                onClick={() => handleSelectStudent(student)}
              >
                <td className="py-3 px-4 text-gray-700">{student.name}</td>
                <td className="py-3 px-4 text-gray-700">{student.program}</td>
                <td className="py-3 px-4 text-gray-700">{student.status}</td>
                <td className="py-3 px-4 text-gray-700">{student.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Details Section */}
      {selectedStudent && (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-gray-700">Student Details</h4>
          <div className="mt-4 space-y-4">
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Program:</strong> {selectedStudent.program}</p>
            <p><strong>Status:</strong> {selectedStudent.status}</p>
            <p><strong>Application Progress:</strong> {selectedStudent.progress}%</p>

            {/* Update Status */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusChange('Accepted')}
                className="mr-4 bg-[#1D5EC7] text-white py-2 px-4 rounded-lg hover:bg-[#306fd6] transition duration-300"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusChange('Rejected')}
                className="mr-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400 transition duration-300"
              >
                Reject
              </button>
              <button
                onClick={() => handleStatusChange('In Review')}
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-400 transition duration-300"
              >
                Move to Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
