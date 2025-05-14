import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";

// Animation variants for different password strengths
const strengthVariants: Variants = {
  empty: { width: "0%", backgroundColor: "rgba(255, 255, 255, 0.1)" },
  weak: { width: "33%", backgroundColor: "#EF4444" },
  medium: { width: "66%", backgroundColor: "#F59E0B" },
  strong: { width: "100%", backgroundColor: "#22C55E" },
};

export interface PasswordStrengthBarProps {
  password: string;
  className?: string;
}

// Simple password strength calculation function
const calculatePasswordStrength = (password: string): "empty" | "weak" | "medium" | "strong" => {
  if (!password) return "empty";
  
  // Calculate password strength based on complexity
  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  const score = [hasLength, hasUppercase, hasLowercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
  
  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
};

export function PasswordStrengthBar({ password, className }: PasswordStrengthBarProps) {
  // Calculate strength only when password changes
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  
  // Get display text based on strength
  const getStrengthText = () => {
    if (strength === "empty") return "";
    if (strength === "weak") return "Weak";
    if (strength === "medium") return "Medium";
    return "Strong";
  };
  
  return (
    <div className={`space-y-1 ${className || ""}`}>
      <div className="h-1 rounded-full mt-1 bg-[rgba(255,255,255,0.1)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          variants={strengthVariants}
          initial="empty"
          animate={strength}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      {password && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-xs flex justify-end"
        >
          <span className={`
            ${strength === "weak" ? "text-red-400" : ""}
            ${strength === "medium" ? "text-amber-400" : ""}
            ${strength === "strong" ? "text-green-400" : ""}
          `}>
            {getStrengthText()}
          </span>
        </motion.div>
      )}
    </div>
  );
} 