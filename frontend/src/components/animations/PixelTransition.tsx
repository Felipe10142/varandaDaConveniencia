import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  delay?: number;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 8,
  className = "",
  style = {},
  duration = 1,
  delay = 0,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowSecond(true);
        setIsTransitioning(false);
      }, duration * 1000);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  const pixels = Array.from({ length: gridSize * gridSize }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* First Content */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: showSecond ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {firstContent}
      </motion.div>

      {/* Second Content */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSecond ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {secondContent}
      </motion.div>

      {/* Pixel Grid Overlay */}
      {isTransitioning && (
        <div
          className="absolute inset-0 z-10"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {pixels.map((pixel) => (
            <motion.div
              key={pixel}
              className="bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.1,
                delay: (pixel / pixels.length) * duration,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PixelTransition;
