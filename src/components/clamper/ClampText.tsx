"use client";
import React, { useState, useEffect, useRef } from "react";

type Props = {
  text: string;
  maxLines?: number;
  className?: string;
  lineHeight?: number;
};

const ClampText: React.FC<Props> = ({ 
  text, 
  maxLines = 3, 
  className = "", 
  lineHeight = 1.5 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Memoized style to avoid unnecessary re-renders
  // const clampStyle = useMemo(() => ({
  //   WebkitLineClamp: maxLines,
  //   WebkitBoxOrient: "vertical",
  //   overflow: "hidden",
  //   display: "-webkit-box",
  //   lineHeight: `${lineHeight}`,
  // }), [maxLines, lineHeight]);

  // Improved effect with cleanup and more robust checking
  useEffect(() => {
    const checkTextOverflow = () => {
      if (textRef.current) {
        // Calculate the expected height based on max lines
        const expectedHeight = textRef.current.style.lineHeight 
          ? parseFloat(textRef.current.style.lineHeight) * maxLines * 16 // Approximate px conversion
          : maxLines * 24; // Fallback line height

        // Check if actual content exceeds expected height
        setShouldShowReadMore(
          textRef.current.scrollHeight > expectedHeight
        );
      }
    };

    // Check on mount and add resize listener
    checkTextOverflow();
    window.addEventListener('resize', checkTextOverflow);

    // Cleanup listener
    return () => {
      window.removeEventListener('resize', checkTextOverflow);
    };
  }, [text, maxLines]);

  // Toggle handler with optional animation
  const toggleText = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`relative ${className}`}>
      <p
        ref={textRef}
        style={!isOpen ? {
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: "vertical" as const,
          overflow: "hidden",
          display: "-webkit-box",
          lineHeight: `${lineHeight}`,
        } : undefined}
        aria-expanded={isOpen}
        className="break-words"
      >
        {text}
      </p>

      {shouldShowReadMore && (
        <button
          onClick={toggleText}
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