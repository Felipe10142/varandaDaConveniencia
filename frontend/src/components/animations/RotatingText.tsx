import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface RotatingTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}

const RotatingText: React.FC<RotatingTextProps> = ({
  text,
  className = "",
  duration = 10,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const chars = container.querySelectorAll(".char");

    chars.forEach((char, index) => {
      const angle = (360 / chars.length) * index;
      const radius = 100;
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;

      (char as HTMLElement).style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
    });
  }, [text]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: "200px", height: "200px" }}
      animate={{ rotate: 360 }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="char absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            transformOrigin: "0 0",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </motion.div>
  );
};

export default RotatingText;
