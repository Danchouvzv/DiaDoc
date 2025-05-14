import React from "react";
import { motion, Variants } from "framer-motion";

interface GlassmorphicContainerProps {
  children: React.ReactNode;
  className?: string;
  isError?: boolean;
}

// Animation variants for shake effect
const shakeVariants: Variants = {
  idle: { x: 0 },
  error: { x: [0, -8, 8, -8, 8, 0] }
};

// Animation variants for container
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  }
};

export function GlassmorphicContainer({ 
  children, 
  className = "",
  isError = false
}: GlassmorphicContainerProps) {
  return (
    <motion.div
      className={`relative max-w-md w-full p-8 rounded-2xl bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] shadow-glow ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Separate motion div for shake animation */}
      <motion.div 
        className="relative w-full h-full"
        variants={shakeVariants}
        animate={isError ? "error" : "idle"}
        transition={{ 
          duration: 0.4,
          type: "spring",
          damping: 10
        }}
      >
        {/* Glass reflection effect */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Additional glass shine effect */}
        <div className="absolute -top-1 -left-1 -right-1 h-16 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-t-2xl transform rotate-2 scale-105 opacity-50 pointer-events-none overflow-hidden" />
      </motion.div>
    </motion.div>
  );
} 