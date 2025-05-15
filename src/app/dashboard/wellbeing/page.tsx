"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import { motion, AnimatePresence, useMotionValue, useTransform, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Heart, Brain, Moon, Sun, ArrowLeft, User, Calendar, Clock, 
  RefreshCw, Check, ChevronDown, BarChart2, Activity, 
  Smile, Frown, AlertTriangle, BarChart, Zap, Send
} from "lucide-react";
import Link from "next/link";
import { generateHealthInsights } from "@/ai/health-insights";
import { GlucoseReading, FoodEntry, ActivityEntry, WellbeingEntry } from "@/lib/schemas";

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
    scale: 1.03,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 }
  }
};

const pageTransition = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    y: 50, 
    transition: {
      duration: 0.3
    }
  }
};

// Wellbeing scale component
const WellbeingScale = ({ value, isLight }: { value: number, isLight: boolean }) => {
  const progressBg = isLight ? 
    `linear-gradient(90deg, #f05252 0%, #f59e0b 25%, #10b981 50%, #3b82f6 75%, #8b5cf6 100%)` : 
    `linear-gradient(90deg, #b91c1c 0%, #d97706 25%, #065f46 50%, #1d4ed8 75%, #5b21b6 100%)`;
  
  return (
    <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
      <motion.div 
        className="absolute top-0 left-0 h-full"
        style={{ 
          background: progressBg,
          width: '100%'
        }}
      />
      <motion.div 
        className="absolute top-0 left-0 h-full w-1 bg-white/80 rounded-full shadow-lg"
        initial={{ left: "50%" }}
        animate={{ left: `${value * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
};

// Sleep quality chart
const SleepQualityChart = ({ data, isLight }: { data: {date: string, quality: number, duration: number}[], isLight: boolean }) => {
  const barColors = {
    poor: isLight ? "#f87171" : "#b91c1c",
    fair: isLight ? "#fbbf24" : "#d97706",
    good: isLight ? "#34d399" : "#059669",
    excellent: isLight ? "#60a5fa" : "#3b82f6"
  };
  
  const getBarColor = (quality: number) => {
    if (quality < 0.25) return barColors.poor;
    if (quality < 0.5) return barColors.fair;
    if (quality < 0.75) return barColors.good;
    return barColors.excellent;
  };
  
  return (
    <div className="mt-4 h-32">
      <div className="flex items-end justify-between h-full">
        {data.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <motion.div 
              className="relative w-7 rounded-t-md mb-1"
              style={{ backgroundColor: getBarColor(day.quality) }}
              initial={{ height: 0 }}
              animate={{ height: `${day.quality * 100}%` }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <motion.div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-1 py-0.5 rounded opacity-0"
                whileHover={{ opacity: 1 }}
              >
                {Math.round(day.duration)}h
              </motion.div>
            </motion.div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {day.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stress level visualization
const StressDisplay = ({ level, isLight }: { level: string, isLight: boolean }) => {
  const levels = {
    'low': { icon: Smile, color: isLight ? 'text-green-500' : 'text-green-400', bg: isLight ? 'bg-green-100' : 'bg-green-900/30' },
    'moderate': { icon: Brain, color: isLight ? 'text-blue-500' : 'text-blue-400', bg: isLight ? 'bg-blue-100' : 'bg-blue-900/30' },
    'high': { icon: AlertTriangle, color: isLight ? 'text-amber-500' : 'text-amber-400', bg: isLight ? 'bg-amber-100' : 'bg-amber-900/30' },
    'severe': { icon: Frown, color: isLight ? 'text-red-500' : 'text-red-400', bg: isLight ? 'bg-red-100' : 'bg-red-900/30' }
  };
  
  const levelInfo = levels[level as keyof typeof levels] || levels.moderate;
  const Icon = levelInfo.icon;
  
  return (
    <motion.div 
      className={`inline-flex items-center px-3 py-1 rounded-full ${levelInfo.bg}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring" }}
    >
      <Icon className={`w-4 h-4 mr-1 ${levelInfo.color}`} />
      <span className={`capitalize font-medium ${levelInfo.color}`}>{level}</span>
    </motion.div>
  );
};

// Mood tracker component
const MoodTracker = ({ isLight }: { isLight: boolean }) => {
  const moods = [
    { emoji: "😔", label: "Sad", value: "sad" },
    { emoji: "😟", label: "Anxious", value: "anxious" },
    { emoji: "😐", label: "Neutral", value: "neutral" },
    { emoji: "🙂", label: "Good", value: "good" },
    { emoji: "😄", label: "Great", value: "great" }
  ];
  
  const [selectedMood, setSelectedMood] = useState("");
  
  return (
    <div className="flex justify-between items-center mt-2">
      {moods.map((mood, idx) => (
        <motion.button
          key={mood.value}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 17,
            delay: idx * 0.1 
          }}
          onClick={() => setSelectedMood(mood.value)}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            selectedMood === mood.value 
              ? `${isLight ? 'bg-primary-100' : 'bg-primary-900/30'} ring-2 ring-primary` 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">{mood.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

// Animated circular progress
const CircularProgress = ({ value, color, size = 120 }: { value: number, color: string, size?: number }) => {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const progress = value * circumference;
  
  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(value * 100)}%
        </motion.span>
      </div>
    </div>
  );
};

export default function WellbeingPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isLight, setIsLight] = useState(true);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [newEntry, setNewEntry] = useState({
    sleepDuration: 7.5,
    stressLevel: 'moderate',
    mood: 'good',
    notes: ''
  });
  
  // Demo sleep data
  const sleepData = [
    { date: 'Mon', quality: 0.6, duration: 7.2 },
    { date: 'Tue', quality: 0.8, duration: 8 },
    { date: 'Wed', quality: 0.4, duration: 6 },
    { date: 'Thu', quality: 0.7, duration: 7.5 },
    { date: 'Fri', quality: 0.9, duration: 8.5 },
    { date: 'Sat', quality: 0.65, duration: 7.3 },
    { date: 'Sun', quality: 0.75, duration: 7.8 }
  ];
  
  // Meditation progress data
  const meditationData = {
    sessionCount: 12,
    streak: 5,
    totalMinutes: 180,
    completionRate: 0.85
  };
  
  // Check theme
  useEffect(() => {
    setIsLight(theme !== 'dark');
  }, [theme]);
  
  // Fetch insights
  const fetchInsights = async () => {
    setLoading(true);
    setError(false);
    
    try {
      // In a real app, this would be actual user data
      const mockGlucoseReadings: GlucoseReading[] = [];
      const mockFoodEntries: FoodEntry[] = [];
      const mockActivityEntries: ActivityEntry[] = [];
      const mockWellbeingEntries: WellbeingEntry[] = [];
      
      const result = await generateHealthInsights(
        user?.uid || 'anonymous',
        timeframe,
        mockGlucoseReadings,
        mockFoodEntries,
        mockActivityEntries,
        mockWellbeingEntries
      );
      
      setInsights(result);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(true);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInsights();
  }, [timeframe, user]);
  
  // Animation references
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  
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
              className="flex items-center text-primary hover:text-primary-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.div>
          </Link>
        </div>
        
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Heart className="w-8 h-8 mr-3 text-primary" fill="currentColor" strokeWidth={1.5} />
              Wellbeing Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Personalized analysis and recommendations based on your data
            </p>
          </div>
          
          <motion.div 
            className="flex items-center mt-4 md:mt-0 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {(['day', 'week', 'month'] as const).map((period) => (
              <motion.button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-md ${
                  timeframe === period 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } font-medium transition-colors capitalize`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {period}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-6"
              >
                <RefreshCw className="w-12 h-12 text-primary" />
              </motion.div>
              <p className="text-gray-600 dark:text-gray-300">Loading your wellbeing insights...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-6 text-red-500"
              >
                <AlertTriangle className="w-16 h-16" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Failed to load insights</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't retrieve your wellbeing data at this time.</p>
              <motion.button
                onClick={fetchInsights}
                className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-lg flex items-center font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Sleep Quality Card */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg overflow-hidden"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Moon className="w-5 h-5 mr-2 text-indigo-500" />
                  Sleep Quality
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {insights?.wellbeingInsights?.sleepQuality || "Track your sleep patterns"}
                </p>
                
                <SleepQualityChart data={sleepData} isLight={isLight} />
                
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>Average: 7.5h</span>
                  <span>Target: 8h</span>
                </div>
              </motion.div>
              
              {/* Stress Levels Card */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-amber-500" />
                  Stress Levels
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {insights?.wellbeingInsights?.stressLevels || "Monitor your mental wellbeing"}
                </p>
                
                <div className="flex flex-col items-center justify-center py-6">
                  <StressDisplay level="moderate" isLight={isLight} />
                  
                  <div className="w-full mt-8">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <WellbeingScale value={0.45} isLight={isLight} />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Today's Mood</h3>
                  <MoodTracker isLight={isLight} />
                </div>
              </motion.div>
              
              {/* Meditation Progress */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-500" />
                  Meditation Progress
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Track your mindfulness journey
                </p>
                
                <div className="flex justify-center py-4">
                  <CircularProgress 
                    value={meditationData.completionRate} 
                    color={isLight ? "#8b5cf6" : "#a78bfa"} 
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {meditationData.sessionCount}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Sessions</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {meditationData.streak}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {meditationData.totalMinutes}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Minutes</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Recommendations Card */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg md:col-span-2"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  Recommendations
                </h2>
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {insights?.recommendations ? (
                    insights.recommendations.map((rec: string, idx: number) => (
                      <motion.div 
                        key={idx}
                        variants={itemVariants}
                        className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{rec}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No recommendations available yet
                    </p>
                  )}
                </motion.div>
              </motion.div>
              
              {/* Quick Log Entry */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-2xl shadow-lg text-white"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Log New Entry
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Sleep Duration</label>
                    <div className="relative">
                      <input 
                        type="range" 
                        min="0" 
                        max="12" 
                        step="0.5" 
                        value={newEntry.sleepDuration}
                        onChange={(e) => setNewEntry({...newEntry, sleepDuration: parseFloat(e.target.value)})}
                        className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                      />
                      <div className="text-center mt-1 text-white/90">
                        {newEntry.sleepDuration} hours
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Stress Level</label>
                    <select 
                      value={newEntry.stressLevel}
                      onChange={(e) => setNewEntry({...newEntry, stressLevel: e.target.value})}
                      className="w-full bg-white/20 border border-white/30 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <textarea
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                      placeholder="How are you feeling today?"
                      className="w-full bg-white/20 border border-white/30 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-white/50 h-20 resize-none"
                    ></textarea>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-white text-primary font-medium py-2 px-4 rounded-lg mt-2 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Save Entry
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 