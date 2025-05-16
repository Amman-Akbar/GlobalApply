import React, { useState } from "react";
import ReactPannellum from "react-pannellum";

const PannellumViewer = () => {
  const [currentScene, setCurrentScene] = useState("first"); // Manage the current scene

  const config = {
    autoLoad: true,
    sceneFadeDuration: 1000,
    showControls: true,
  };

  const scenes = {
    first: {
      type: "equirectangular",
      panorama: "/assets/VT/first.jpg",
    },
    second: {
      type: "equirectangular",
      panorama: "/assets/VT/second.jpg",
    },
    third: {
      type: "equirectangular",
      panorama: "/assets/VT/third.jpg",
    },
  };

  // Handle thumbnail click to change the scene
  const handleThumbnailClick = (sceneId) => {
    setCurrentScene(sceneId); // Update the sceneId based on the clicked thumbnail
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <ReactPannellum
        key={currentScene} // Use currentScene as the key to force remount on scene change
        id="pano"
        sceneId={currentScene}
        imageSource={scenes[currentScene].panorama} // Ensure image updates based on currentScene
        config={config}
        style={{ width: "90%", height: "90%" }}
      />

      {/* Thumbnail gallery */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
        }}
      >
        {Object.keys(scenes).map((sceneId) => (
          <img
            key={sceneId}
            src={scenes[sceneId].panorama}
            alt={sceneId}
            style={{
              width: "100px",
              height: "auto",
              cursor: "pointer",
              border: sceneId === currentScene ? "2px solid red" : "none", // Highlight the current scene
            }}
            onClick={() => handleThumbnailClick(sceneId)} // Update currentScene when thumbnail clicked
          />
        ))}
      </div>
    </div>
  );
};

export default PannellumViewer;
