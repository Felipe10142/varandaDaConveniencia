import { motion } from "framer-motion";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
  delay?: number;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = "",
  colors = ["#D62828", "#F77F00", "#F4A261"],
  duration = 3,
  delay = 0,
}) => {
  const gradientColors = colors.join(", ");
  
  return (
    <motion.span
      className={className}
      style={{
        background: `linear-gradient(45deg, ${gradientColors})`,
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
};

export default GradientText;
