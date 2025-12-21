import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

interface MotionRevealProps {
  children: React.ReactNode;
  delayIndex: number;
  shouldAnimate: boolean;
  className?: string;
  as?: React.ElementType;
  onReveal?: (el: HTMLElement) => void;
}

export const MotionReveal = ({ 
  children, 
  delayIndex: _delayIndex, 
  shouldAnimate, 
  className = '', 
  as = 'div',
  onReveal
}: MotionRevealProps) => {
  const Component = useMemo(() => motion(as as any), [as]);

  if (!shouldAnimate) {
    const StaticComponent = as;
    return (
      <StaticComponent className={className}>
        {children}
      </StaticComponent>
    );
  }

  return (
    <Component
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut",
        delay: 0
      }}
      className={className}
      onAnimationStart={() => {}}
      onAnimationComplete={() => {}}
      ref={(el: HTMLElement | null) => {
          if (el && onReveal) {
          }
      }}
    >
      {children}
    </Component>
  );
};
