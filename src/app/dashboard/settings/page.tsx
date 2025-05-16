"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { 
  User, Bell, Shield, Moon, Sun, Smartphone, Globe, 
  Palette, BarChart3, Volume2, Eye, Lock, LogOut, Save, ArrowLeft,
  Check, RefreshCw, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { settingsService, UserSettings, defaultSettings } from "@/lib/settings-service";

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Состояния для настроек пользователя
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  
  // Форма профиля
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
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
      // При монтировании компонента устанавливаем тему в соответствии с настройками
      if (settings.theme === 'system') {
        setTheme('system');
      } else {
        setTheme(settings.theme);
      }
    }
  }, [settings.theme, mounted, setTheme]);
  
  // Загрузка настроек пользователя
  useEffect(() => {
    if (user?.uid) {
      setName(user.displayName || "");
      setEmail(user.email || "");
      setProfileImage(user.photoURL || "/default-avatar.png");
      
      // Загружаем настройки пользователя
      const loadUserSettings = async () => {
        try {
          setIsLoading(true);
          const userSettings = await settingsService.getUserSettings(user.uid);
          setSettings(userSettings);
          
          // Установим тему в соответствии с настройками
          if (userSettings.theme === 'system') {
            setTheme('system');
          } else {
            setTheme(userSettings.theme);
          }
        } catch (error) {
          console.error("Error loading user settings:", error);
          toast.error("Не удалось загрузить настройки пользователя");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadUserSettings();
    }
  }, [user, setTheme]);
  
  // Обработка изменения темы
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    const updatedSettings = { ...settings, theme: newTheme };
    setSettings(updatedSettings);
    setTheme(newTheme === 'system' ? 'system' : newTheme);
    setHasChanges(true);
  };
  
  // Обработка изменения цветовой схемы
  const handleColorThemeChange = (color: UserSettings['colorTheme']) => {
    setSettings({ ...settings, colorTheme: color });
    setHasChanges(true);
  };
  
  // Обработка изменения размера шрифта
  const handleFontSizeChange = (size: UserSettings['fontSize']) => {
    setSettings({ ...settings, fontSize: size });
    setHasChanges(true);
  };
  
  // Обработка изменения настройки снижения анимации
  const toggleReduceMotion = () => {
    setSettings({ ...settings, reduceMotion: !settings.reduceMotion });
    setHasChanges(true);
  };
  
  // Обработка изменения настройки двухфакторной аутентификации
  const toggleTwoFactor = () => {
    setSettings({ ...settings, twoFactorEnabled: !settings.twoFactorEnabled });
    setHasChanges(true);
  };
  
  // Обработка изменения настроек уведомлений
  const handleNotificationChange = (key: keyof Pick<UserSettings, 'notificationsEnabled' | 'emailNotifications' | 'pushNotifications' | 'reminderNotifications'>, value: boolean) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };
  
  // Обработка изменения настроек единиц измерения
  const handleUnitChange = <K extends keyof Pick<UserSettings, 'glucoseUnit' | 'weightUnit' | 'carbUnit' | 'timeFormat'>>(
    key: K, 
    value: UserSettings[K]
  ) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };
  
  // Обработка изменения настроек приватности
  const handlePrivacyChange = (key: keyof Pick<UserSettings, 'shareWithHealthcare' | 'shareForResearch' | 'allowMarketing' | 'twoFactorEnabled'>, value: boolean) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };
  
  // Обработка изменения языка
  const handleLanguageChange = (language: UserSettings['language']) => {
    setSettings({ ...settings, language });
    setHasChanges(true);
  };
  
  // Сохранение настроек
  const handleSaveSettings = async () => {
    if (!user?.uid) return;
    
    setSaving(true);
    try {
      // Сохраняем настройки в Firebase
      await settingsService.updateUserSettings(user.uid, settings);
      
      // Устанавливаем тему в соответствии с настройками
      if (settings.theme === 'system') {
        setTheme('system');
      } else {
        setTheme(settings.theme);
      }
      
      // Показываем уведомление об успешном сохранении
      toast.success("Настройки успешно сохранены");
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Не удалось сохранить настройки");
    } finally {
      setSaving(false);
    }
  };
  
  // Сброс настроек
  const handleResetSettings = async () => {
    if (!user?.uid) return;
    
    if (window.confirm("Вы уверены, что хотите сбросить все настройки до значений по умолчанию?")) {
      setSaving(true);
      try {
        // Сбрасываем настройки до значений по умолчанию
        await settingsService.resetSettings(user.uid);
        
        // Обновляем состояние
        setSettings(defaultSettings);
        
        // Устанавливаем тему в соответствии с настройками по умолчанию
        if (defaultSettings.theme === 'system') {
          setTheme('system');
        } else {
          setTheme(defaultSettings.theme);
        }
        
        // Показываем уведомление об успешном сбросе
        toast.success("Настройки успешно сброшены");
        setHasChanges(false);
      } catch (error) {
        console.error("Error resetting settings:", error);
        toast.error("Не удалось сбросить настройки");
      } finally {
        setSaving(false);
      }
    }
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
                          checked={settings.notificationsEnabled}
                          onChange={() => handleNotificationChange('notificationsEnabled', !settings.notificationsEnabled)}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            settings.notificationsEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            animate={{
                              x: settings.notificationsEnabled ? 28 : 0
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
                          checked={settings.emailNotifications}
                          onChange={() => handleNotificationChange('emailNotifications', !settings.emailNotifications)}
                          disabled={!settings.notificationsEnabled}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            settings.emailNotifications && settings.notificationsEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          } ${!settings.notificationsEnabled ? "opacity-50" : ""}`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            animate={{
                              x: settings.emailNotifications && settings.notificationsEnabled ? 28 : 0
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
                          checked={settings.pushNotifications}
                          onChange={() => handleNotificationChange('pushNotifications', !settings.pushNotifications)}
                          disabled={!settings.notificationsEnabled}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            settings.pushNotifications && settings.notificationsEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          } ${!settings.notificationsEnabled ? "opacity-50" : ""}`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            animate={{
                              x: settings.pushNotifications && settings.notificationsEnabled ? 28 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium dark:text-white">Reminder Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive reminders for blood glucose checks and medication</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          id="reminderNotifications" 
                          checked={settings.reminderNotifications}
                          onChange={() => handleNotificationChange('reminderNotifications', !settings.reminderNotifications)}
                          disabled={!settings.notificationsEnabled}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            settings.reminderNotifications && settings.notificationsEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          } ${!settings.notificationsEnabled ? "opacity-50" : ""}`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            animate={{
                              x: settings.reminderNotifications && settings.notificationsEnabled ? 28 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-4 flex flex-col gap-4">
                      <div className="flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleResetSettings}
                          className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                          disabled={saving}
                        >
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Reset to Default
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSaveSettings}
                          className="bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center justify-center font-medium"
                          disabled={saving || !hasChanges}
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
                      </div>
                      
                      {hasChanges && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          You have unsaved changes
                        </motion.p>
                      )}
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
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Appearance</h2>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants} className="grid gap-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleThemeChange('light')}
                          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                            settings.theme === 'light'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <Sun className={`w-6 h-6 mb-2 ${settings.theme === 'light' ? "text-primary" : "text-gray-500 dark:text-gray-400"}`} />
                          <span className={`text-sm font-medium ${settings.theme === 'light' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>Light</span>
                          {settings.theme === 'light' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleThemeChange('dark')}
                          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                            settings.theme === 'dark'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <Moon className={`w-6 h-6 mb-2 ${settings.theme === 'dark' ? "text-primary" : "text-gray-500 dark:text-gray-400"}`} />
                          <span className={`text-sm font-medium ${settings.theme === 'dark' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>Dark</span>
                          {settings.theme === 'dark' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleThemeChange('system')}
                          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                            settings.theme === 'system'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <Smartphone className={`w-6 h-6 mb-2 ${settings.theme === 'system' ? "text-primary" : "text-gray-500 dark:text-gray-400"}`} />
                          <span className={`text-sm font-medium ${settings.theme === 'system' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>System</span>
                          {settings.theme === 'system' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color Theme</label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
                          { value: 'green', label: 'Green', color: 'bg-green-500' },
                          { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
                          { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
                          { value: 'red', label: 'Red', color: 'bg-red-500' },
                        ].map((color) => (
                          <motion.button
                            key={color.value}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleColorThemeChange(color.value as UserSettings['colorTheme'])}
                            className={`relative rounded-full w-10 h-10 flex items-center justify-center border-2 ${
                              settings.colorTheme === color.value
                                ? "border-gray-800 dark:border-white"
                                : "border-transparent"
                            }`}
                          >
                            <div className={`rounded-full w-8 h-8 ${color.color}`}></div>
                            {settings.colorTheme === color.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'small', label: 'Small', className: 'text-sm' },
                          { value: 'medium', label: 'Medium', className: 'text-base' },
                          { value: 'large', label: 'Large', className: 'text-lg' },
                        ].map((size) => (
                          <motion.button
                            key={size.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleFontSizeChange(size.value as UserSettings['fontSize'])}
                            className={`flex items-center justify-center p-3 rounded-lg border-2 ${
                              settings.fontSize === size.value
                                ? "border-primary bg-primary/10"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            <span className={`font-medium ${size.className} ${
                              settings.fontSize === size.value ? "text-primary" : "text-gray-700 dark:text-gray-300"
                            }`}>{size.label}</span>
                            {settings.fontSize === size.value && <Check className="w-4 h-4 text-primary ml-2" />}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium dark:text-white">Reduce Motion</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Minimize animations throughout the app</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          id="reduceMotion" 
                          checked={settings.reduceMotion}
                          onChange={toggleReduceMotion}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            settings.reduceMotion ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            animate={{
                              x: settings.reduceMotion ? 28 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-4 flex flex-col gap-4">
                      <div className="flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleResetSettings}
                          className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                          disabled={saving}
                        >
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Reset to Default
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSaveSettings}
                          className="bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center justify-center font-medium"
                          disabled={saving || !hasChanges}
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
                      </div>
                      
                      {hasChanges && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          You have unsaved changes
                        </motion.p>
                      )}
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
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Units & Measurement</h2>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants} className="grid gap-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Glucose Units</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnitChange('glucoseUnit', 'mg/dL')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                            settings.glucoseUnit === 'mg/dL'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <span className={`text-lg font-medium ${settings.glucoseUnit === 'mg/dL' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>mg/dL</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">United States</span>
                          {settings.glucoseUnit === 'mg/dL' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnitChange('glucoseUnit', 'mmol/L')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                            settings.glucoseUnit === 'mmol/L'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <span className={`text-lg font-medium ${settings.glucoseUnit === 'mmol/L' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>mmol/L</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">International</span>
                          {settings.glucoseUnit === 'mmol/L' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight Units</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnitChange('weightUnit', 'kg')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                            settings.weightUnit === 'kg'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <span className={`text-lg font-medium ${settings.weightUnit === 'kg' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>kg</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Kilograms</span>
                          {settings.weightUnit === 'kg' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnitChange('weightUnit', 'lb')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                            settings.weightUnit === 'lb'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <span className={`text-lg font-medium ${settings.weightUnit === 'lb' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>lb</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Pounds</span>
                          {settings.weightUnit === 'lb' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Carbohydrate Units</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnitChange('carbUnit', 'g')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                            settings.carbUnit === 'g'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <span className={`text-lg font-medium ${settings.carbUnit === 'g' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>g</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Grams</span>
                          {settings.carbUnit === 'g' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnitChange('carbUnit', 'oz')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                            settings.carbUnit === 'oz'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <span className={`text-lg font-medium ${settings.carbUnit === 'oz' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>oz</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Ounces</span>
                          {settings.carbUnit === 'oz' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid gap-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Format</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnitChange('timeFormat', '12h')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                            settings.timeFormat === '12h'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <span className={`text-lg font-medium ${settings.timeFormat === '12h' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>12-hour</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">AM/PM</span>
                          {settings.timeFormat === '12h' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnitChange('timeFormat', '24h')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                            settings.timeFormat === '24h'
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <span className={`text-lg font-medium ${settings.timeFormat === '24h' ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>24-hour</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Military</span>
                          {settings.timeFormat === '24h' && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-4 flex flex-col gap-4">
                      <div className="flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleResetSettings}
                          className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                          disabled={saving}
                        >
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Reset to Default
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSaveSettings}
                          className="bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center justify-center font-medium"
                          disabled={saving || !hasChanges}
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
                      </div>
                      
                      {hasChanges && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          You have unsaved changes
                        </motion.p>
                      )}
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
                          checked={settings.twoFactorEnabled}
                          onChange={(e) => handlePrivacyChange('twoFactorEnabled', e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            settings.twoFactorEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        >
                          <motion.div 
                            layout
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            animate={{
                              x: settings.twoFactorEnabled ? 28 : 0
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
                            checked={settings.shareWithHealthcare}
                            onChange={(e) => handlePrivacyChange('shareWithHealthcare', e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                              settings.shareWithHealthcare ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          >
                            <motion.div 
                              layout
                              className="bg-white w-4 h-4 rounded-full shadow-md"
                              animate={{
                                x: settings.shareWithHealthcare ? 21 : 0
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
                            checked={settings.shareForResearch}
                            onChange={(e) => handlePrivacyChange('shareForResearch', e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                              settings.shareForResearch ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          >
                            <motion.div 
                              layout
                              className="bg-white w-4 h-4 rounded-full shadow-md"
                              animate={{
                                x: settings.shareForResearch ? 21 : 0
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
                            checked={settings.allowMarketing}
                            onChange={(e) => handlePrivacyChange('allowMarketing', e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                              settings.allowMarketing ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          >
                            <motion.div 
                              layout
                              className="bg-white w-4 h-4 rounded-full shadow-md"
                              animate={{
                                x: settings.allowMarketing ? 21 : 0
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
}

// Определим глобальные стили для настроек
const getColorThemeClass = (colorTheme: string) => {
  switch (colorTheme) {
    case 'blue':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    case 'green':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    case 'purple':
      return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
    case 'orange':
      return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    case 'red':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    default:
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
  }
}; 