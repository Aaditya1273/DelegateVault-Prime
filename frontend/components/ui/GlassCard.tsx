'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  const Component = hover ? motion.div : 'div';

  return (
    <Component
      className={`glass rounded-2xl ${hover ? 'glass-hover' : ''} ${className}`}
      {...(hover && {
        whileHover: { scale: 1.02 },
        transition: { duration: 0.2 }
      })}
    >
      {children}
    </Component>
  );
}
