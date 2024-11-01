"use client";
import React, { useEffect, useState } from "react";
import Tooltip from "@/components/tooltip/Tooltip";

type RingData = {
  startColor?: string;
  endColor?: string;
  color: string;
  value: number;
};

type CircularRingsProps = {
  data?: RingData[];
  centerText?: string;
  gap?: number;
  baseSize?: number;
  ringWidth?: number;
};

const MultiRings: React.FC<CircularRingsProps> = ({
  data = [],
  centerText = "",
  gap = 40,
  baseSize = 700,
  ringWidth = 4,
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
    <div className="relative w-[400px] h-[400px] rounded-full transition-all">
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
      <div className="absolute ">
        {data.map((dataItem, index) => {
          const { size, radius, circumference, strokeWidth } =
            calculateRing(index);
          const progress = animated ? dataItem.value : 0;
          const dashOffset = circumference - (progress / 100) * circumference;

          return (
            <Tooltip key={index} text={`Value: ${dataItem.value}%`}>
              <div
                key={index}
                className="absolute inset-0 flex items-center justify-center "
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
                    className="stroke-gray-100 opacity-70 "
                    fill="none"
                    strokeWidth={strokeWidth}
                  />
                  {/* Progress circle */}
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
                </svg>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default MultiRings;
