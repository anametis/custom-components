'use client'
import React, { useState } from "react";

type TooltipProps = {
  text: string;
  children: React.ReactNode;
  className?: string;
};

const Tooltip: React.FC<TooltipProps> = ({ text, children, className }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`relative flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="absolute mb-2 w-max px-2 py-1 text-sm text-white bg-red-500 rounded opacity-0 transition-opacity duration-300 fade-in"
          style={{
            animation: visible ? "fadeIn 0.3s forwards" : "fadeOut 0.3s forwards",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
