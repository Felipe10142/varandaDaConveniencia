import React, { useEffect, useRef } from "react";
interface RibbonsProps {
  colors?: string[];
  baseThickness?: number;
  speedMultiplier?: number;
  maxAge?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
}
const Ribbons: React.FC<RibbonsProps> = ({
  colors = ["#ff9346", "#7cff67", "#ffee51", "#5227FF"],
  baseThickness = 30,
  speedMultiplier = 0.6,
  maxAge = 500,
  enableFade = false,
  enableShaderEffect = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // No WebGL implementation needed - we'll use CSS gradients instead
  }, [
    colors,
    baseThickness,
    speedMultiplier,
    maxAge,
    enableFade,
    enableShaderEffect,
  ]);
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden ribbons-container"
      style={{
        background: `linear-gradient(125deg, ${colors.join(", ")})`,
        backgroundSize: "400% 400%",
      }}
    >
      <style>
        {`
        .ribbons-container {
          animation: gradientAnimation 15s ease infinite;
        }
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}
      </style>
    </div>
  );
};
export default Ribbons;
