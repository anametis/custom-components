"use client";
import React, { useState, useRef, useEffect } from "react";

type Props = {
  text: string;
  maxLines?: number;
  className?: string;
};

const ClampText: React.FC<Props> = ({ 
  text, 
  maxLines = 3, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const contentRef = useRef<HTMLParagraphElement>(null);

  // Measure content height on mount and when text changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [text]);

  return (
    <div className={`relative ${className}`}>
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen 
            ? `${contentHeight}px` 
            : `${(maxLines * 1.5 * 16)}px` // Approximate line height calculation
        }}
      >
        <p 
          ref={contentRef}
          className={`
            break-words 
            text-base 
            leading-relaxed
          `}
        >
          {text}
        </p>
      </div>

      {text.length > 150 && ( // Simple heuristic to determine if "Read More" is needed
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-2 text-blue-500 hover:underline focus:outline-none"
          aria-label={isOpen ? "Collapse text" : "Expand text"}
        >
          {isOpen ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default ClampText;