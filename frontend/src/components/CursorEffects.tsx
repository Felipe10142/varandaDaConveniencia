import React, { useEffect, useState, useRef } from 'react';
import ClickSpark from './animations/ClickSpark';
const CursorEffects: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px)`;
    }
  }, [mousePosition]);
  return <ClickSpark sparkColor="#ffffff" sparkSize={10} sparkRadius={15} sparkCount={12} duration={500} easing="ease-out" extraScale={1.2}>
      <div ref={cursorRef} className="fixed top-0 left-0 w-5 h-5 rounded-full border-2 border-white pointer-events-none z-50 mix-blend-difference" style={{
      transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
      marginLeft: '-10px',
      marginTop: '-10px'
    }} />
    </ClickSpark>;
};
export default CursorEffects;