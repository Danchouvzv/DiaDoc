import React, { useState, forwardRef } from "react";
import { motion, Variants } from "framer-motion";
import { Input } from "./input";

// Animation variants for the floating label
const labelVariants: Variants = {
  rest: { top: "50%", fontSize: "1rem", color: "rgba(160, 177, 188, 1)" },
  float: { top: "0.25rem", fontSize: "0.75rem", color: "rgba(0, 221, 255, 1)" }
};

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [isFocused, setFocused] = useState(false);
    const hasValue = Boolean(props.value);
    
    return (
      <div className="relative">
        <motion.label
          htmlFor={props.name}
          className="absolute left-4 transform -translate-y-1/2 px-1 pointer-events-none z-10"
          variants={labelVariants}
          initial="rest"
          animate={isFocused || hasValue ? "float" : "rest"}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {label}
        </motion.label>
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
          className={`w-full pt-6 pb-2 px-4 bg-transparent border-b ${
            error 
              ? "border-destructive" 
              : "border-[rgba(255,255,255,0.3)] focus:border-accent"
          } outline-none transition-colors duration-200 ${className || ""}`}
        />
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput }; 