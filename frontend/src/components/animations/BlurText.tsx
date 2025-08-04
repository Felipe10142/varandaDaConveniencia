import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom" | "left" | "right";
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 0.8,
  animateBy = "words",
  direction = "bottom",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements = animateBy === "words" 
      ? container.querySelectorAll(".word") 
      : container.querySelectorAll(".char");

    gsap.set(elements, {
      opacity: 0,
      y: direction === "bottom" ? 50 : direction === "top" ? -50 : 0,
      x: direction === "right" ? 50 : direction === "left" ? -50 : 0,
      filter: "blur(10px)",
    });

    gsap.to(elements, {
      opacity: 1,
      y: 0,
      x: 0,
      filter: "blur(0px)",
      duration,
      delay,
      stagger: 0.05,
      ease: "power3.out",
    });
  }, [text, delay, duration, animateBy, direction]);

  const renderText = () => {
    if (animateBy === "words") {
      return text.split(" ").map((word, index) => (
        <span key={index} className="word inline-block mr-2">
          {word}
        </span>
      ));
    } else {
      return text.split("").map((char, index) => (
        <span key={index} className="char inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ));
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {renderText()}
    </motion.div>
  );
};

export default BlurText;
