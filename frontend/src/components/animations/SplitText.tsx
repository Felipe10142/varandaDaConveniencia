import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  from?: Record<string, any>;
  to?: Record<string, any>;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 0.8,
  ease = "power3.out",
  from = { opacity: 0, y: 50 },
  to = { opacity: 1, y: 0 },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const chars = container.querySelectorAll(".char");

    gsap.set(chars, from);

    gsap.to(chars, {
      ...to,
      duration,
      delay,
      stagger: 0.05,
      ease,
    });
  }, [text, delay, duration, ease, from, to]);

  return (
    <div ref={containerRef} className={className}>
      {text.split("").map((char, index) => (
        <span key={index} className="char inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};

export default SplitText;
