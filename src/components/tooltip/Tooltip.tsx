"use client";
import React, { useState } from "react";

type TooltipProps = {
  text: string;
  children: React.ReactNode;
  offset?: { x: number; y: number };
};

const Tooltip = ({
  text,
  children,
  offset = { x: 15, y: -15 }
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // Get cursor position relative to viewport
    const x = e.clientX + offset.x;
    const y = e.clientY + offset.y;
    
    // Get tooltip dimensions (approximating if not yet rendered)
    const tooltipWidth = 200; // approximate max width
    const tooltipHeight = 40; // approximate height
    
    // Adjust position if tooltip would go off screen
    const adjustedX = Math.min(x, window.innerWidth - tooltipWidth - 10);
    const adjustedY = Math.min(Math.max(10, y), window.innerHeight - tooltipHeight - 10);
    
    setPosition({ 
      x: adjustedX + window.scrollX,
      y: adjustedY + window.scrollY
    });
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      <div
        role="tooltip"
        className="fixed z-50 px-3 py-2 text-sm text-white rounded shadow-lg pointer-events-none transition-opacity duration-700 ease-in-out backdrop-blur-sm"
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? 1 : 0,
          visibility: isVisible ? "visible" : "hidden",
          maxWidth: 200
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;