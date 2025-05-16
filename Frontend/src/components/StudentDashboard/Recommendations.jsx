import React from 'react';

const Recommendations = () => {
  const recommendations = [
    { title: "Computer Science - NUST", description: "Top program in AI & Data Science.", status: "Available" },
    { title: "Engineering - GIKI", description: "Renowned for robotics & AI programs.", status: "Available" },
    { title: "Biology - LUMS", description: "Leading research in biotechnology.", status: "Limited" },
  ];
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Recommended Institutes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{rec.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              rec.status === "Available" ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
            }`}>
              {rec.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
