import React, { useEffect, useRef, createElement } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}
const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = {
    opacity: 0,
    y: 40
  },
  to = {
    opacity: 1,
    y: 0
  },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animationCompletedRef = useRef(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current || !text) return;
    const el = ref.current;
    animationCompletedRef.current = false;
    // Split text into individual elements
    const chars = text.split('');
    const elements: HTMLSpanElement[] = [];
    // Clear the container
    el.innerHTML = '';
    // Create spans for each character
    chars.forEach(char => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      span.style.willChange = 'transform, opacity';
      span.style.display = 'inline-block';
      el.appendChild(span);
      elements.push(span);
    });
    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: `top ${(1 - threshold) * 100}%${rootMargin}`,
        toggleActions: 'play none none none',
        once: true,
        onToggle: self => {
          scrollTriggerRef.current = self;
        }
      },
      smoothChildTiming: true,
      onComplete: () => {
        animationCompletedRef.current = true;
        gsap.set(elements, {
          ...to,
          clearProps: 'willChange',
          immediateRender: true
        });
        onLetterAnimationComplete?.();
      }
    });
    // Set initial state
    tl.set(elements, {
      ...from,
      immediateRender: false,
      force3D: true
    });
    // Animate each character
    tl.to(elements, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      force3D: true
    });
    return () => {
      tl.kill();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      gsap.killTweensOf(elements);
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, rootMargin, onLetterAnimationComplete]);
  return <p ref={ref} className={`split-parent overflow-hidden inline-block whitespace-normal ${className}`} style={{
    textAlign,
    wordWrap: 'break-word'
  }}>
      {text}
    </p>;
};
export default SplitText;