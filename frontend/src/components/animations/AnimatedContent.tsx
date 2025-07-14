import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  ease?: string | ((progress: number) => number);
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  onComplete?: () => void;
}
const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ScrollTrigger | null>(null);
  useEffect(() => {
    // Ensure we're in the browser and the element exists
    if (typeof window === 'undefined' || !ref.current) return;
    const el = ref.current;
    const axis = direction === 'horizontal' ? 'x' : 'y';
    const offset = reverse ? -distance : distance;
    const startPct = (1 - threshold) * 100;
    // Set initial state
    gsap.set(el, {
      [axis]: offset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1
    });
    // Create animation with safety checks
    const animation = gsap.to(el, {
      [axis]: 0,
      scale: 1,
      opacity: 1,
      duration,
      ease,
      delay,
      onComplete,
      paused: true // Start paused to avoid potential timing issues
    });
    // Create ScrollTrigger with error handling
    try {
      animationRef.current = ScrollTrigger.create({
        trigger: el,
        start: `top ${startPct}%`,
        onEnter: () => animation.play(),
        once: true
      });
    } catch (error) {
      console.error('ScrollTrigger initialization error:', error);
      // Fallback animation if ScrollTrigger fails
      animation.play();
    }
    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      animation.kill();
    };
  }, [distance, direction, reverse, duration, ease, initialOpacity, animateOpacity, scale, threshold, delay, onComplete]);
  return <div ref={ref}>{children}</div>;
};
export default AnimatedContent;