import React from 'react'

const UniversityFee = () => {
  return (
    <div className="admin-component-container">
      <iframe
        src="http://localhost:8501"  // Replace with your Streamlit app's URL
        width="100%"
        height="400px"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
}

export default UniversityFee