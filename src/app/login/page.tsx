"use client";

import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginFormData } from "@/lib/schemas";
import { useAuth } from "@/providers/auth-provider";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingInput } from "@/components/ui/floating-input";
import { GlassmorphicSubmitButton } from "@/components/ui/glassmorphic-submit-button";
import { GlassmorphicContainer } from "@/components/ui/glassmorphic-container";
import { LockKeyhole, LogIn, Sparkles, Key, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const GoogleIcon = () => <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.03v2.74h5.39c-.24 1.69-1.64 3.29-3.55 3.29-2.26 0-4.1-1.84-4.1-4.1s1.84-4.1 4.1-4.1c1.08 0 2.06.42 2.82 1.1l2.03-2.03C17.01 6.66 15.13 6 12.96 6c-3.7 0-6.71 3.01-6.71 6.71s3.01 6.71 6.71 6.71c3.46 0 6.42-2.68 6.71-6.08h.01z"></path></svg>;
const AppleIcon = () => <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.22 6.53c-.31.02-.6.04-.89.07-.82.03-1.67.13-2.55.33-.81.2-1.6.49-2.35.87-.77.4-1.52.91-2.21 1.55-.65.58-1.21 1.26-1.68 2.03-.47.79-.78 1.64-.92 2.56-.14.9-.09 1.81.11 2.71.21.89.59 1.76 1.12 2.58.52.78 1.18 1.52 1.94 2.13.72.58 1.52 1.07 2.38 1.45.8.35 1.62.59 2.48.71.42.04.84.06 1.26.06.42 0 .83-.02 1.25-.06.9-.12 1.78-.42 2.59-.89.79-.47 1.49-1.08 2.05-1.81.52-.68.9-1.46 1.12-2.31.21-.86.25-1.74.11-2.62-.13-.85-.45-1.67-.93-2.41-.5-.76-1.13-1.43-1.89-1.98-.73-.53-1.55-.93-2.43-1.19-.87-.26-1.78-.39-2.7-.39zm.97-2.18c.3-.38.57-.79.79-1.23.23-.45.4-.92.51-1.41.04-.2.07-.4.09-.61-.07.01-.13.01-.2.01-.72 0-1.44-.12-2.14-.35-.74-.24-1.45-.58-2.08-1.03-.55-.4-.99-.83-1.32-1.28-.06-.08-.11-.16-.15-.25-.01.08-.02.17-.02.25 0 .68.11 1.34.33 1.98.22.66.54 1.29.95 1.87.41.58.91 1.11 1.49 1.57.58.45 1.23.82 1.94 1.1.33.13.67.23 1.01.31.27.05.53.08.8.08.09 0 .17-.01.26-.02z"></path></svg>;

// Staggered animation variants for child elements
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Background animation variants
const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.5 } }
};

// Floating animation for decorative elements
const floatingAnimation = {
  initial: { y: 0 },
  animate: { 
    y: [0, -15, 0],
    transition: { 
      repeat: Infinity, 
      duration: 6, 
      ease: "easeInOut" 
    } 
  }
};

export default function LoginPage() {
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(true);

  // Once mounted on client, check theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update light/dark theme status when theme changes
  useEffect(() => {
    if (mounted) {
      setIsLightTheme(theme !== 'dark');
    }
  }, [theme, mounted]);

  // Track mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsSubmitting(true);
    setIsError(false);
    
    try {
    await signIn(data);
    } catch (error) {
      console.error("Login submission error:", error);
      setIsError(true);
      
      // Reset error state after shake animation completes
      setTimeout(() => setIsError(false), 500);
    } finally {
    setIsSubmitting(false); 
    }
  };

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${isLightTheme ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2 rounded-full z-20 ${
          isLightTheme 
            ? 'bg-white text-gray-700 hover:bg-gray-100 shadow-md' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
        } transition-colors`}
        aria-label="Toggle theme"
      >
        {isLightTheme ? (
          <Moon size={20} />
        ) : (
          <Sun size={20} />
        )}
      </button>

      {isLightTheme ? (
        // Light theme background and elements
        <>
          {/* Animated gradient background for light theme */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
          />
          
          {/* Decorative elements for light theme */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Abstract shapes */}
            <motion.div 
              className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-indigo-200 to-purple-100 opacity-40 blur-3xl"
              style={{ 
                translateX: mousePosition.x * -30,
                translateY: mousePosition.y * -30
              }}
            />
            <motion.div 
              className="absolute bottom-32 right-[15%] w-80 h-80 rounded-full bg-gradient-to-br from-pink-100 to-indigo-200 opacity-30 blur-3xl"
              style={{ 
                translateX: mousePosition.x * 30,
                translateY: mousePosition.y * 30
              }}
            />
            
            {/* Animated floating elements */}
            <motion.div 
              className="absolute top-[15%] right-[20%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-300 to-indigo-200 opacity-50 blur-md"
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
            />
            <motion.div 
              className="absolute bottom-[25%] left-[25%] w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-cyan-100 opacity-60 blur-md"
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
              transition={{ delay: 1.5 }}
            />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5ZmE4ZGEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NGgwdjJoNHYtNGgydi0yaC00em0wLTMwVjBINHY0SDB2Mmg0djRoMlY2aDRWNEg2eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')] opacity-40 pointer-events-none" />
          </div>
          
          {/* Animated sparkles effect */}
          <AnimatePresence>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0], 
                  opacity: [0, 0.8, 0] 
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  delay: i * 0.75,
                  repeatDelay: Math.random() * 3
                }}
              >
                <Sparkles className="text-indigo-400 h-4 w-4" />
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      ) : (
        // Dark theme background and elements
        <>
          {/* Animated gradient background for dark theme */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
          />
          
          {/* Decorative elements for dark theme */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Abstract shapes */}
            <motion.div 
              className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-indigo-900/30 to-purple-900/20 opacity-30 blur-3xl"
              style={{ 
                translateX: mousePosition.x * -30,
                translateY: mousePosition.y * -30
              }}
            />
            <motion.div 
              className="absolute bottom-32 right-[15%] w-80 h-80 rounded-full bg-gradient-to-br from-pink-900/30 to-indigo-900/20 opacity-30 blur-3xl"
              style={{ 
                translateX: mousePosition.x * 30,
                translateY: mousePosition.y * 30
              }}
            />
            
            {/* Animated floating elements */}
            <motion.div 
              className="absolute top-[15%] right-[20%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-800/20 to-indigo-700/20 opacity-40 blur-md"
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
            />
            <motion.div 
              className="absolute bottom-[25%] left-[25%] w-12 h-12 rounded-full bg-gradient-to-br from-blue-800/20 to-cyan-700/20 opacity-40 blur-md"
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
              transition={{ delay: 1.5 }}
            />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMDQwNTAiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0aDB2Mmg0di00aDJ2LTJoLTR6bTAtMzBWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] opacity-20 pointer-events-none" />
                      </div>
          
          {/* Animated stars effect for dark theme */}
          <AnimatePresence>
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={`star-${i}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, Math.random() * 0.8 + 0.2, 0], 
                  opacity: [0, Math.random() * 0.5 + 0.3, 0] 
                }}
                transition={{
                  repeat: Infinity,
                  duration: Math.random() * 3 + 2,
                  delay: i * 0.5,
                  repeatDelay: Math.random() * 4
                }}
              >
                <span className="text-white text-xs">✦</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      )}

      <GlassmorphicContainer isError={isError} isLight={isLightTheme} className="z-10">
        {/* Logo and Title */}
        <motion.div 
          className="flex flex-col items-center mb-8"
          variants={childVariants}
        >
          <div className={`h-20 w-20 rounded-full flex items-center justify-center mb-4 ${
            isLightTheme 
              ? 'bg-gradient-to-br from-indigo-100 to-indigo-200 border-4 border-white shadow-xl' 
              : 'bg-gradient-to-br from-primary/30 to-accent/30'
          }`}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Key className={`h-10 w-10 ${isLightTheme ? 'text-indigo-500' : 'text-accent'}`} />
            </motion.div>
          </div>
          <h1 className={`text-3xl font-bold bg-clip-text text-transparent ${
            isLightTheme 
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600' 
              : 'bg-gradient-to-r from-primary to-accent'
          }`}>
            Welcome Back
          </h1>
          <p className={`mt-2 text-center ${isLightTheme ? 'text-gray-600' : 'text-[rgba(255,255,255,0.6)]'}`}>
            Sign in to your DiaDoc account
          </p>
        </motion.div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div variants={childVariants}>
            <FloatingInput
              label="Email"
              type="email"
              {...form.register("email")}
              error={!!form.formState.errors.email}
              isLight={isLightTheme}
            />
            {form.formState.errors.email && (
              <p className={`text-xs mt-1 ml-1 ${isLightTheme ? 'text-red-500' : 'text-red-400'}`}>
                {form.formState.errors.email.message}
              </p>
            )}
          </motion.div>
          
          <motion.div variants={childVariants}>
            <FloatingInput
              label="Password"
              type="password"
              {...form.register("password")}
              error={!!form.formState.errors.password}
              isLight={isLightTheme}
            />
            {form.formState.errors.password && (
              <p className={`text-xs mt-1 ml-1 ${isLightTheme ? 'text-red-500' : 'text-red-400'}`}>
                {form.formState.errors.password.message}
              </p>
            )}
          </motion.div>
          
          <motion.div variants={childVariants} className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className={`text-sm ${
                isLightTheme 
                  ? 'text-indigo-600 hover:text-violet-600' 
                  : 'text-accent hover:text-primary'
              } transition-colors`}
            >
              Forgot password?
            </Link>
          </motion.div>
          
          <motion.div variants={childVariants}>
            <GlassmorphicSubmitButton
              text={isSubmitting ? "Signing In..." : "Sign In"}
              loading={isSubmitting}
              className="w-full mt-2"
              isLight={isLightTheme}
            />
          </motion.div>
          
          <motion.div 
            variants={childVariants}
            className="relative flex items-center gap-4 py-2"
          >
            <div className={`flex-grow h-px ${isLightTheme ? 'bg-gray-200' : 'bg-[rgba(255,255,255,0.1)]'}`}></div>
            <span className={`text-sm ${isLightTheme ? 'text-gray-400' : 'text-[rgba(255,255,255,0.4)]'}`}>or continue with</span>
            <div className={`flex-grow h-px ${isLightTheme ? 'bg-gray-200' : 'bg-[rgba(255,255,255,0.1)]'}`}></div>
          </motion.div>
          
          <motion.div variants={childVariants} className="grid grid-cols-2 gap-4">
            <motion.button
              type="button"
              className={`flex items-center justify-center py-2.5 px-4 rounded-lg transition-all duration-200 ${
                isLightTheme 
                  ? 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm' 
                  : 'border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.8)]'
              }`}
              whileHover={isLightTheme ? { y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : { scale: 1.03 }}
              whileTap={{ y: 0 }}
            >
              <GoogleIcon />
              Google
            </motion.button>
            <motion.button
              type="button"
              className={`flex items-center justify-center py-2.5 px-4 rounded-lg transition-all duration-200 ${
                isLightTheme 
                  ? 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm' 
                  : 'border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.8)]'
              }`}
              whileHover={isLightTheme ? { y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : { scale: 1.03 }}
              whileTap={{ y: 0 }}
            >
              <AppleIcon />
              Apple
            </motion.button>
          </motion.div>
          
          <motion.p variants={childVariants} className={`text-center text-sm mt-6 ${
            isLightTheme ? 'text-gray-600' : 'text-[rgba(255,255,255,0.6)]'
          }`}>
            Don't have an account?{" "}
            <Link 
              href="/register" 
              className={`${
                isLightTheme 
                  ? 'text-indigo-600 hover:text-violet-600 font-medium' 
                  : 'text-accent hover:text-primary'
              } transition-colors`}
            >
              Sign up
            </Link>
          </motion.p>
        </form>
      </GlassmorphicContainer>
    </div>
  );
}
