
"use client";
import { Logo } from "@/components/navigation/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center animated-gradient-bg p-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "circOut" }}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10"
      >
        <Logo />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full max-w-md z-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
