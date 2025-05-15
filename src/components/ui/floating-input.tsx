import React, { useState, forwardRef } from "react";
import { motion, Variants } from "framer-motion";

// Animation variants for the floating label
const darkLabelVariants: Variants = {
  rest: { top: "50%", fontSize: "1rem", color: "rgba(160, 177, 188, 1)" },
  float: { top: "0.25rem", fontSize: "0.75rem", color: "rgba(0, 221, 255, 1)" }
};

// Animation variants for light theme
const lightLabelVariants: Variants = {
  rest: { top: "50%", fontSize: "1rem", color: "rgba(100, 116, 139, 1)" },
  float: { top: "0.25rem", fontSize: "0.75rem", color: "rgba(99, 102, 241, 1)" }
};

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
  isLight?: boolean; // New prop to control light/dark theme
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, className, isLight = false, ...props }, ref) => {
    const [isFocused, setFocused] = useState(false);
    const hasValue = Boolean(props.value);

    // Select the appropriate variants based on theme
    const labelVariants = isLight ? lightLabelVariants : darkLabelVariants;
    
    return (
      <div className="relative">
        <motion.label
          htmlFor={props.name}
          className={`absolute left-4 transform -translate-y-1/2 px-1 pointer-events-none z-10 ${
            isLight ? "bg-gradient-to-r bg-clip-text" : ""
          }`}
          variants={labelVariants}
          initial="rest"
          animate={isFocused || hasValue ? "float" : "rest"}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={isLight && (isFocused || hasValue) ? {
            // Apply gradient text color for light theme when focused/has value
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          } : undefined}
        >
          {label}
        </motion.label>
        
        {/* Animated underline for light theme */}
        {isLight && (
          <motion.div 
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600"
            initial={{ width: "0%" }}
            animate={{ width: isFocused ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        <input
          {...props}
          ref={ref}
          id={props.name}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={`w-full pt-6 pb-2 px-4 ${
            isLight 
              ? "bg-transparent border-b border-gray-300 focus:border-gray-300 text-gray-800" 
              : "bg-transparent border-b border-[rgba(255,255,255,0.3)] focus:border-accent text-white"
          } ${
            error 
              ? isLight ? "border-red-500" : "border-destructive" 
              : ""
          } outline-none transition-colors duration-200 ${className || ""}`}
        />
        
        {/* Shimmer effect for light theme */}
        {isLight && isFocused && (
          <motion.div 
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-20"
              animate={{ 
                x: ["0%", "100%"],
              }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "loop", 
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput }; 