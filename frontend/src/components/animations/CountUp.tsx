import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountUpProps {
  from: number;
  to: number;
  duration?: number;
  separator?: string;
  decimals?: number;
  className?: string;
}

const CountUp: React.FC<CountUpProps> = ({
  from,
  to,
  duration = 2,
  separator = "",
  decimals = 0,
  className = "",
}) => {
  const [count, setCount] = useState(from);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    const difference = to - from;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      const currentCount = from + difference * progress;
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    animate();
  }, [from, to, duration, isAnimating]);

  const formatNumber = (num: number) => {
    const formatted = num.toFixed(decimals);
    if (separator) {
      return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }
    return formatted;
  };

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {formatNumber(count)}
    </motion.span>
  );
};

export default CountUp;
