import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}
const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const animationRef = useRef<ScrollTrigger[]>([]);
  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return <span className="inline-block word" key={index}>
          {word}
        </span>;
    });
  }, [children]);
  useEffect(() => {
    const el = containerRef.current;
    if (typeof window === 'undefined' || !el) return;
    const scroller = scrollContainerRef?.current || window;
    const animations: ScrollTrigger[] = [];
    try {
      // Rotation animation
      const rotationTween = gsap.fromTo(el, {
        transformOrigin: '0% 50%',
        rotate: baseRotation
      }, {
        ease: 'none',
        rotate: 0,
        paused: true
      });
      animations.push(ScrollTrigger.create({
        trigger: el,
        scroller,
        start: 'top bottom',
        end: rotationEnd,
        scrub: true,
        animation: rotationTween
      }));
      // Word animations
      const wordElements = el.querySelectorAll<HTMLElement>('.word');
      const wordsTween = gsap.fromTo(wordElements, {
        opacity: baseOpacity,
        filter: enableBlur ? `blur(${blurStrength}px)` : 'none'
      }, {
        ease: 'none',
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.05,
        paused: true
      });
      animations.push(ScrollTrigger.create({
        trigger: el,
        scroller,
        start: 'top bottom-=20%',
        end: wordAnimationEnd,
        scrub: true,
        animation: wordsTween
      }));
      animationRef.current = animations;
    } catch (error) {
      console.error('ScrollTrigger initialization error:', error);
    }
    return () => {
      animationRef.current.forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);
  return <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold ${textClassName}`}>
        {splitText}
      </p>
    </h2>;
};
export default ScrollReveal;