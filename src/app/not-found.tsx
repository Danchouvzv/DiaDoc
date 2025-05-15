"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";

export default function NotFound() {
  const { theme } = useTheme();
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

  // Animation for the orbiting particles
  const orbitAnimation = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity
      }
    }
  };
  
  // Animation for the floating elements
  const floatAnimation = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden ${
      isLightTheme ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50' : 'bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Abstract shapes */}
        <motion.div 
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full ${
            isLightTheme 
              ? 'bg-gradient-to-br from-indigo-200/30 to-purple-200/30' 
              : 'bg-gradient-to-br from-indigo-800/10 to-purple-800/10'
          } blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full ${
            isLightTheme 
              ? 'bg-gradient-to-br from-blue-200/30 to-indigo-200/30' 
              : 'bg-gradient-to-br from-blue-800/10 to-indigo-800/10'
          } blur-3xl`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Grid pattern */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhNDlkZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NGgwdjJoNHYtNGgydi0yaC00em0wLTMwVjBINHY0SDB2Mmg0djRoMlY2aDRWNEg2eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')] ${
          isLightTheme ? 'opacity-30' : 'opacity-10'
        } pointer-events-none`} />
      </div>
      
      {/* 404 orbit animation */}
      <div className="relative w-64 h-64 mb-8">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity
          }}
          className="absolute inset-0"
        >
          <motion.div 
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full ${
              isLightTheme ? 'bg-purple-400' : 'bg-purple-500'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0.8, 1] }}
            transition={{ duration: 2 }}
          />
          
          <motion.div 
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full ${
              isLightTheme ? 'bg-indigo-400' : 'bg-indigo-500'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0.8, 1] }}
            transition={{ duration: 2, delay: 0.3 }}
          />
          
          <motion.div 
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${
              isLightTheme ? 'bg-blue-400' : 'bg-blue-500'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0.8, 1] }}
            transition={{ duration: 2, delay: 0.6 }}
          />
          
          <motion.div 
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${
              isLightTheme ? 'bg-pink-400' : 'bg-pink-500'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0.8, 1] }}
            transition={{ duration: 2, delay: 0.9 }}
          />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3
            }}
            className={`text-9xl font-bold ${
              isLightTheme ? 'text-indigo-600' : 'text-indigo-400'
            }`}
          >
            404
          </motion.div>
        </div>
      </div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`text-3xl font-bold mb-4 text-center ${
          isLightTheme ? 'text-gray-800' : 'text-white'
        }`}
      >
        Page Not Found
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`text-center max-w-md mb-8 ${
          isLightTheme ? 'text-gray-600' : 'text-gray-300'
        }`}
      >
        The page you're looking for doesn't exist or has been moved.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center px-6 py-3 rounded-lg shadow-lg ${
              isLightTheme
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            } transition-colors font-medium min-w-[180px]`}
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Dashboard
          </motion.button>
        </Link>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.history.back()}
          className={`flex items-center justify-center px-6 py-3 rounded-lg shadow-lg ${
            isLightTheme
              ? 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200' 
              : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
          } transition-colors font-medium min-w-[180px]`}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Go Back
        </motion.button>
      </motion.div>
      
      {/* Floating elements */}
      <motion.div 
        className="absolute bottom-[10%] left-[10%] w-12 h-12 opacity-70"
        variants={floatAnimation}
        animate="animate"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" className={isLightTheme ? 'fill-indigo-200' : 'fill-indigo-900'} />
          <path d="M15 9L9 15" stroke={isLightTheme ? '#4F46E5' : '#818CF8'} strokeWidth="2" strokeLinecap="round" />
          <path d="M9 9L15 15" stroke={isLightTheme ? '#4F46E5' : '#818CF8'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute top-[15%] right-[15%] w-16 h-16 opacity-70"
        variants={floatAnimation}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" className={isLightTheme ? 'fill-purple-200' : 'fill-purple-900'} />
          <path d="M12 8V16" stroke={isLightTheme ? '#7C3AED' : '#A78BFA'} strokeWidth="2" strokeLinecap="round" />
          <path d="M8 12H16" stroke={isLightTheme ? '#7C3AED' : '#A78BFA'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute top-[40%] right-[5%] w-10 h-10 opacity-70"
        variants={floatAnimation}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="4" className={isLightTheme ? 'fill-blue-200' : 'fill-blue-900'} />
          <path d="M8 12H16" stroke={isLightTheme ? '#2563EB' : '#93C5FD'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
} 