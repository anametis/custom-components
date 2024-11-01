'use client';
import React, { useState } from "react";

type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    // Use pageX and pageY for more accurate positioning
    setPosition({ x: event.pageX, y: event.pageY-230 });
    // console.log(event.pageX, event.pageY);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {visible && (
        <div
          className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded shadow-lg transition-all duration-500"
          style={{
            top: position.y + 20,
            left: position.x + 10,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
