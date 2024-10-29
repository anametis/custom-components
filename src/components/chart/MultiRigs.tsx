"use client";
import React, { useEffect, useState } from "react";
import Tooltip from "@/components/tooltips/Tooltip";

type RingData = {
  startColor?: string;
  endColor?: string;
  color: string;
  value: number;
};

type MultiRingsProps = {
  data?: RingData[];
  centerText?: string;
  className?: string;
  gap?: number;
  baseSize?: number;
  ringWidth?: number;
};

const MultiRings: React.FC<MultiRingsProps> = ({
  data = [],
  centerText = "",
  gap = 50,
  baseSize = 600,
  ringWidth = 5,
  className = "",
}) => {
  const [animated, setAnimated] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate ring dimensions
  const calculateRing = (index: number) => {
    const size = baseSize - index * (ringWidth + gap);
    return {
      size,
      radius: size / 2 - ringWidth,
      circumference: (size - ringWidth) * Math.PI,
      strokeWidth: ringWidth,
    };
  };

  return (
    <div
      className={`relative w-[800px] h-[800px] bg-transparent rounded-full ${className}`}
    >
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <span className="text-1xl font-bold text-gray-800">{centerText}</span>
        </div>
      </div>

      {/* Gradients definitions */}
      <svg width="0" height="0">
        <defs>
          {data.map((item, index) => (
            <linearGradient key={`gradient-${index}`} id={`gradient-${index}`}>
              <stop offset="0%" stopColor={item.startColor || item.color} />
              <stop offset="100%" stopColor={item.endColor || item.color} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {/* Rings */}
      <div className="absolute inset-0" style={{ transform: "rotate(-90deg)" }}>
        {data.map((dataItem, index) => {
          const { size, radius, circumference, strokeWidth } =
            calculateRing(index);
          const progress = animated ? dataItem.value : 0;
          const dashOffset = circumference - (progress / 100) * circumference;

          return (
            <div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="absolute"
              >
                {/* Background circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  className="stroke-gray-50"
                  fill="none"
                  strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                {/* <Tooltip text={`testing`}> */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{
                      stroke: `url(#gradient-${index})`,
                      strokeDasharray: circumference,
                      strokeDashoffset: dashOffset,
                    }}
                  />
                {/* </Tooltip> */}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiRings;
