import React from "react";
import { motion, Variants } from "framer-motion";

interface GlassmorphicContainerProps {
  children: React.ReactNode;
  className?: string;
  isError?: boolean;
  isLight?: boolean;
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

// Floating bubbles animation
const bubblesVariants: Variants = {
  initial: { y: 0, opacity: 0.7 },
  animate: { y: -20, opacity: 0, transition: { duration: 2, repeat: Infinity, repeatType: "loop" } }
};

export function GlassmorphicContainer({ 
  children, 
  className = "",
  isError = false,
  isLight = false
}: GlassmorphicContainerProps) {
  return (
    <motion.div
      className={`relative max-w-md w-full p-8 rounded-2xl ${
        isLight 
          ? "bg-white/95 text-gray-800 backdrop-blur-xl border border-gray-200 shadow-xl" 
          : "bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] shadow-glow text-white"
      } ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative elements for light theme */}
      {isLight && (
        <>
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 opacity-70 blur-md" />
          <div className="absolute top-1/2 -left-6 w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 opacity-70 blur-md" />
          <div className="absolute -bottom-6 right-10 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-70 blur-md" />
          
          {/* Animated floating bubbles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`bubble-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 opacity-20"
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                left: `${Math.random() * 80 + 10}%`,
                bottom: `${Math.random() * 80}%`,
              }}
              variants={bubblesVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.8 }}
            />
          ))}
        </>
      )}

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
        {/* Glass reflection effect - different for light/dark modes */}
        {isLight ? (
          <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/80 to-transparent rounded-t-2xl pointer-events-none" />
        ) : (
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl pointer-events-none" />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Additional glass shine effect - different for light/dark modes */}
        {isLight ? (
          <div className="absolute -top-1 -left-1 -right-1 h-16 bg-gradient-to-br from-white/50 via-white/30 to-transparent rounded-t-2xl transform rotate-2 scale-105 opacity-70 pointer-events-none overflow-hidden" />
        ) : (
          <div className="absolute -top-1 -left-1 -right-1 h-16 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-t-2xl transform rotate-2 scale-105 opacity-50 pointer-events-none overflow-hidden" />
        )}
      </motion.div>
    </motion.div>
  );
} 