import React, { useEffect, useState, useRef } from "react";

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorSize, setCursorSize] = useState(20); // Initial size (small)
  const [isHovered, setIsHovered] = useState(false);
  const prevPosition = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const handleMouseMove = (event) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime.current;

      // Calculate the distance between current and previous position
      const distX = event.clientX - prevPosition.current.x;
      const distY = event.clientY - prevPosition.current.y;
      const distance = Math.sqrt(distX * distX + distY * distY);

      // Speed is distance/time
      const speed = distance / timeDiff;

      // Change the cursor size based on speed
      const newSize = Math.min(Math.max(20 + speed * 5, 20), 100); // Size range between 20 and 100

      setCursorSize(newSize);

      setPosition({ x: event.clientX, y: event.clientY });
      prevPosition.current = { x: event.clientX, y: event.clientY };
      lastTime.current = currentTime;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`fixed pointer-events-none z-[99] transform transition-all duration-100 ease-out ${
        isHovered
          ? `bg-red-500 ${cursorSize > 40 ? "rounded-lg" : "rounded-full"}`
          : `bg-[#155a9e] rounded-full`
      }`}
      style={{
        top: position.y,
        left: position.x,
        width: `${cursorSize}px`,
        height: `${cursorSize}px`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

export default CursorFollower;
