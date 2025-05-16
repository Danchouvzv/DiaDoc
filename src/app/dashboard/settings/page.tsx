"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { 
  User, Bell, Shield, Moon, Sun, Smartphone, Globe, 
  Palette, BarChart3, Volume2, Eye, Lock, LogOut, Save, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 }
  }
};

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [isMobile, setIsMobile] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [glucoseUnit, setGlucoseUnit] = useState("mg/dL");
  const [weightUnit, setWeightUnit] = useState("kg");
  
  // Дополнительные состояния для новых разделов
  const [selectedColorTheme, setSelectedColorTheme] = useState("blue");
  const [fontSize, setFontSize] = useState("Medium");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [carbUnit, setCarbUnit] = useState("grams");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [shareWithHealthcare, setShareWithHealthcare] = useState(true);
  const [shareForResearch, setShareForResearch] = useState(true);
  const [allowMarketing, setAllowMarketing] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  useEffect(() => {
    if (mounted) {
      setDarkMode(theme === "dark");
    }
  }, [theme, mounted]);
  
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
      setProfileImage(user.photoURL || "/default-avatar.png");
    }
  }, [user]);
  
  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setDarkMode(!darkMode);
  };
  
  const handleColorThemeChange = (color) => {
    setSelectedColorTheme(color);
    // В реальном приложении здесь бы менялась цветовая схема
  };
  
  const handleFontSizeChange = (size) => {
    setFontSize(size);
    // В реальном приложении здесь бы менялся размер шрифта
  };
  
  const toggleReduceMotion = () => {
    setReduceMotion(!reduceMotion);
    // В реальном приложении здесь бы менялись настройки анимаций
  };
  
  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // В реальном приложении здесь бы включалась/выключалась двухфакторная аутентификация
  };
  
  const handleSaveSettings = async () => {
    setSaving(true);
    // Mock save delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
  };
  
  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto"
      >
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="flex items-center text-primary hover:text-primary-600 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex-1 text-center">Settings</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar for larger screens */}
          <AnimatePresence mode="wait">
            {!isMobile && (
              <motion.div
                key="desktop-sidebar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-fit"
              >
                <motion.div 
                  className="flex flex-col items-center mb-6 relative"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
                >
                  <div className="relative">
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full border-4 border-primary object-cover"
                    />
                    <motion.div 
                      className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.div>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold dark:text-white">{name || "User"}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{email || "user@example.com"}</p>
                </motion.div>
                
                <motion.nav variants={containerVariants} initial="hidden" animate="visible">
                  {[
                    { id: "account", label: "Account Settings", icon: User },
                    { id: "notifications", label: "Notifications", icon: Bell },
                    { id: "appearance", label: "Appearance", icon: Palette },
                    { id: "units", label: "Units & Measurement", icon: BarChart3 },
                    { id: "privacy", label: "Privacy & Security", icon: Shield },
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      variants={itemVariants}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center w-full p-3 my-1 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-primary/10 text-primary dark:bg-primary/20"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${
                        activeTab === item.id ? "text-primary" : ""
                      }`} />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                  
                  <motion.hr variants={itemVariants} className="my-4 border-gray-200 dark:border-gray-700" />
                  
                  <motion.button
                    variants={itemVariants}
                    onClick={handleSignOut}
                    className="flex items-center w-full p-3 rounded-lg text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-medium">Sign Out</span>
                  </motion.button>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Mobile tabs */}
          <AnimatePresence mode="wait">
            {isMobile && (
              <motion.div
                key="mobile-tabs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex overflow-x-auto pb-3 mb-4 w-full"
              >
                {[
                  { id: "account", label: "Account", icon: User },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "appearance", label: "Appearance", icon: Palette },
                  { id: "units", label: "Units", icon: BarChart3 },
                  { id: "privacy", label: "Privacy", icon: Shield },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center justify-center p-3 mx-1 rounded-lg min-w-[80px] ${
                      activeTab === item.id
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className={`w-5 h-5 mb-1`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main content area */}
          <motion.div 
            layout
            className="col-span-1 lg:col-span-3 grid gap-6 auto-rows-auto"
          >
            {/* Content based on active tab */}
            <AnimatePresence mode="wait">
              {activeTab === "account" && (
                <motion.div
                  key="account"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Account Settings</h2>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants} className="grid gap-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                      <div className="flex items-center">
                        <img src={profileImage} alt="Profile" className="w-16 h-16 rounded-full object-cover mr-4" />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium"
                        >
                          Change Photo
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium text-left flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </motion.button>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveSettings}
                        className="w-full bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center justify-center font-medium"
                        disabled={saving}
                      >
                        {saving ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                          </motion.div>
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        {saving ? "Saving..." : "Save Changes"}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
              
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Notification Settings</h2>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium dark:text-white">Enable All Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive all notifications from the app</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          id="enableAll" 
                          checked={notificationsEnabled}
                          onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            notificationsEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            animate={{
                              x: notificationsEnabled ? 28 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.hr variants={itemVariants} className="border-gray-200 dark:border-gray-700" />
                    
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          id="emailNotifications" 
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                          disabled={!notificationsEnabled}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            emailNotifications && notificationsEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          } ${!notificationsEnabled ? "opacity-50" : ""}`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            animate={{
                              x: emailNotifications && notificationsEnabled ? 28 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium dark:text-white">Push Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications on your device</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          id="pushNotifications" 
                          checked={pushNotifications}
                          onChange={() => setPushNotifications(!pushNotifications)}
                          disabled={!notificationsEnabled}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            pushNotifications && notificationsEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          } ${!notificationsEnabled ? "opacity-50" : ""}`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            animate={{
                              x: pushNotifications && notificationsEnabled ? 28 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveSettings}
                        className="w-full bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center justify-center font-medium"
                        disabled={saving}
                      >
                        {saving ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                          </motion.div>
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        {saving ? "Saving..." : "Save Preferences"}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
              
              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Appearance Settings</h2>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium dark:text-white">Dark Mode</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          id="darkMode" 
                          checked={darkMode}
                          onChange={handleThemeChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            darkMode ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md flex items-center justify-center"
                            animate={{
                              x: darkMode ? 28 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            {darkMode ? <Moon className="w-3 h-3 text-primary" /> : <Sun className="w-3 h-3 text-amber-500" />}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.hr variants={itemVariants} className="border-gray-200 dark:border-gray-700" />
                    
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color Theme</label>
                      <div className="grid grid-cols-5 gap-3">
                        {['blue', 'green', 'purple', 'red', 'orange'].map((color) => (
                          <motion.button
                            key={color}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleColorThemeChange(color)}
                            className={`w-full h-10 rounded-lg ${
                              color === 'blue' ? 'bg-blue-500' :
                              color === 'green' ? 'bg-green-500' :
                              color === 'purple' ? 'bg-purple-500' :
                              color === 'red' ? 'bg-red-500' : 'bg-orange-500'
                            } ${color === selectedColorTheme ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''}`}
                            aria-label={`${color} theme`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Primary color theme for buttons and interactive elements
                      </p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Small', 'Medium', 'Large'].map((size) => (
                          <motion.button
                            key={size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleFontSizeChange(size)}
                            className={`px-4 py-2 rounded-lg border ${
                              size === fontSize 
                                ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20' 
                                : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Animation Settings</label>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Reduce Motion</span>
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            id="reduceMotion" 
                            checked={reduceMotion}
                            onChange={toggleReduceMotion}
                            className="sr-only"
                          />
                          <div
                            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                              reduceMotion ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          >
                            <motion.div 
                              layout
                              className="bg-white w-5 h-5 rounded-full shadow-md"
                              animate={{
                                x: reduceMotion ? 28 : 0
                              }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveSettings}
                        className="w-full bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center justify-center font-medium"
                        disabled={saving}
                      >
                        {saving ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                          </motion.div>
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        {saving ? "Saving..." : "Save Preferences"}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
              
              {activeTab === "units" && (
                <motion.div
                  key="units"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Units & Measurement Settings</h2>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Glucose Units</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setGlucoseUnit("mg/dL")}
                          className={`px-4 py-3 rounded-lg border flex items-center justify-center ${
                            glucoseUnit === "mg/dL" 
                              ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20' 
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="font-medium">mg/dL</span>
                          <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">(US, Default)</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setGlucoseUnit("mmol/L")}
                          className={`px-4 py-3 rounded-lg border flex items-center justify-center ${
                            glucoseUnit === "mmol/L" 
                              ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20' 
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="font-medium">mmol/L</span>
                          <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">(International)</span>
                        </motion.button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Units used for blood glucose readings throughout the app
                      </p>
                    </motion.div>
                    
                    <motion.hr variants={itemVariants} className="border-gray-200 dark:border-gray-700" />
                    
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight Units</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setWeightUnit("kg")}
                          className={`px-4 py-3 rounded-lg border flex items-center justify-center ${
                            weightUnit === "kg" 
                              ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20' 
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="font-medium">Kilograms (kg)</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setWeightUnit("lb")}
                          className={`px-4 py-3 rounded-lg border flex items-center justify-center ${
                            weightUnit === "lb" 
                              ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20' 
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="font-medium">Pounds (lb)</span>
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Carbohydrate Units</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCarbUnit("grams")}
                          className={`px-4 py-3 rounded-lg border flex items-center justify-center ${
                            carbUnit === "grams" 
                              ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20' 
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="font-medium">Grams (g)</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCarbUnit("exchanges")}
                          className={`px-4 py-3 rounded-lg border flex items-center justify-center ${
                            carbUnit === "exchanges" 
                              ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20' 
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="font-medium">Exchanges</span>
                        </motion.button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        How carbohydrates are measured in food entries
                      </p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Format</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTimeFormat("12h")}
                          className={`px-4 py-3 rounded-lg border flex items-center justify-center ${
                            timeFormat === "12h" 
                              ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20' 
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="font-medium">12-hour</span>
                          <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">(AM/PM)</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTimeFormat("24h")}
                          className={`px-4 py-3 rounded-lg border flex items-center justify-center ${
                            timeFormat === "24h" 
                              ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20' 
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="font-medium">24-hour</span>
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveSettings}
                        className="w-full bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center justify-center font-medium"
                        disabled={saving}
                      >
                        {saving ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                          </motion.div>
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        {saving ? "Saving..." : "Save Units Preferences"}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
              
              {activeTab === "privacy" && (
                <motion.div
                  key="privacy"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Privacy & Security Settings</h2>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          id="twoFactor" 
                          checked={twoFactorEnabled}
                          onChange={toggleTwoFactor}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            twoFactorEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            animate={{
                              x: twoFactorEnabled ? 28 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.hr variants={itemVariants} className="border-gray-200 dark:border-gray-700" />
                    
                    <motion.div variants={itemVariants} className="grid gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Sharing</label>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h3 className="font-medium text-sm dark:text-white">Share with Healthcare Providers</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Allow doctors to view your health data</p>
                        </div>
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            id="shareHealthcare" 
                            checked={shareWithHealthcare}
                            onChange={() => setShareWithHealthcare(!shareWithHealthcare)}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                              shareWithHealthcare ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          >
                            <motion.div 
                              layout
                              className="bg-white w-4 h-4 rounded-full shadow-md"
                              animate={{
                                x: shareWithHealthcare ? 21 : 0
                              }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h3 className="font-medium text-sm dark:text-white">Anonymous Data for Research</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Contribute anonymized data for diabetes research</p>
                        </div>
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            id="shareResearch" 
                            checked={shareForResearch}
                            onChange={() => setShareForResearch(!shareForResearch)}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                              shareForResearch ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          >
                            <motion.div 
                              layout
                              className="bg-white w-4 h-4 rounded-full shadow-md"
                              animate={{
                                x: shareForResearch ? 21 : 0
                              }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h3 className="font-medium text-sm dark:text-white">Marketing Communications</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Allow personalized recommendations</p>
                        </div>
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            id="shareMarketing" 
                            checked={allowMarketing}
                            onChange={() => setAllowMarketing(!allowMarketing)}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                              allowMarketing ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          >
                            <motion.div 
                              layout
                              className="bg-white w-4 h-4 rounded-full shadow-md"
                              animate={{
                                x: allowMarketing ? 21 : 0
                              }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.hr variants={itemVariants} className="border-gray-200 dark:border-gray-700" />
                    
                    <motion.div variants={itemVariants} className="grid gap-3">
                      <h3 className="font-medium dark:text-white">Sessions & Devices</h3>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Smartphone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm dark:text-white">iPhone 13 Pro</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Last active: 2 minutes ago</div>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                          Current
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Globe className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm dark:text-white">Chrome on MacBook</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Last active: 2 days ago</div>
                          </div>
                        </div>
                        <button className="text-xs font-medium text-red-500 hover:text-red-600">
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveSettings}
                        className="w-full bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center justify-center font-medium"
                        disabled={saving}
                      >
                        {saving ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                          </motion.div>
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        {saving ? "Saving..." : "Save Privacy Settings"}
                      </motion.button>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 px-4 rounded-lg flex items-center justify-center font-medium"
                      >
                        Export My Data
                      </motion.button>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 px-4 rounded-lg flex items-center justify-center font-medium"
                      >
                        Delete My Account
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Edit icon component
function Edit({ className = "w-6 h-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
} 