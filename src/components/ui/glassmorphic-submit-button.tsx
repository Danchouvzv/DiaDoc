import React from "react";
import { motion } from "framer-motion";

interface GlassmorphicSubmitButtonProps {
  text: string;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  isLight?: boolean;
}

export function GlassmorphicSubmitButton({
  text,
  loading = false,
  type = "submit",
  onClick,
  className = "",
  isLight = false,
}: GlassmorphicSubmitButtonProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-full ${isLight ? "shadow-lg" : "shadow-glow"} ${className}`}
      animate={isLight ? { 
        scale: [1, 0.99, 1],
        boxShadow: [
          '0 10px 25px -5px rgba(80, 70, 230, 0.3)', 
          '0 8px 20px -5px rgba(80, 70, 230, 0.2)', 
          '0 10px 25px -5px rgba(80, 70, 230, 0.3)'
        ] 
      } : { 
        scale: [1, 0.98, 1], 
        boxShadow: [
          '0 0 12px rgba(0,221,255,0.2)', 
          '0 0 8px rgba(0,221,255,0.1)', 
          '0 0 12px rgba(0,221,255,0.2)'
        ] 
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 2, 
        ease: "easeInOut" 
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        type={type}
        disabled={loading}
        onClick={onClick}
        className={`w-full py-3 px-4 text-lg font-semibold ${
          isLight 
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500" 
            : "bg-[rgba(0,163,255,0.8)] text-white"
        } transition-colors duration-200 relative overflow-hidden z-10 rounded-full`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          <span className="relative z-10 flex items-center justify-center">
            {text}
            {isLight && (
              <motion.span 
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            )}
          </span>
        )}
      </button>
      
      {/* Liquid gradient hover effect - enhanced for light theme */}
      <span 
        className={`absolute top-0 left-0 w-full h-full pointer-events-none ${
          isLight 
            ? "bg-gradient-to-r from-transparent via-white/40 to-transparent" 
            : "bg-gradient-to-r from-transparent via-white/20 to-transparent"
        } -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-0`}
      />
      
      {/* Subtle inner glow - enhanced for light theme */}
      <span 
        className={`absolute inset-0 w-full h-full ${
          isLight 
            ? "bg-gradient-to-tr from-pink-400/20 to-transparent" 
            : "bg-gradient-to-tr from-accent/10 to-transparent"
        } rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Animated particles for light theme */}
      {isLight && !loading && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.span
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full bg-white opacity-50"
              style={{
                x: `${70 + i * 10}%`,
                y: "50%",
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                x: [`${70 + i * 10}%`, `${80 + i * 15}%`],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                repeatDelay: 0.2
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
} 