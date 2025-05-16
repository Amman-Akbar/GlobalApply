import React, { useState } from 'react';

const Wishlist = () => {
  const [students] = useState([
    { id: 1, name: 'Ali Hassan', email: 'alihassan@gmail.com', phone: '0300-1234567' },
    { id: 2, name: 'Ayesha Khan', email: 'ayeshakhan@gmail.com', phone: '0333-9876543' },
    { id: 3, name: 'Usman Malik', email: 'usmanmalik@gmail.com', phone: '0312-5557890' },
    { id: 4, name: 'Fatima Ahmed', email: 'fatimaahmed@gmail.com', phone: '0321-9998888' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.phone}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Wishlist</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search students by name, email, or phone..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Display Table or No Results Message */}
      {filteredStudents.length === 0 ? (
        <p className="text-gray-500 text-center">No students match your search.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase font-medium">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b hover:bg-gray-50 text-sm text-gray-700"
                >
                  <td className="py-3 px-4">{student.name}</td>
                  <td className="py-3 px-4">{student.email}</td>
                  <td className="py-3 px-4">{student.phone}</td>
                  <td className="py-3 px-4">
                    <button className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-3 rounded text-sm">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
