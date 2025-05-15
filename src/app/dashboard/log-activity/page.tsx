"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Zap, Award, Calendar, Send, Plus, Play, Pause, Trash2 } from "lucide-react";
import Link from "next/link";

// Activity types with icons
const ACTIVITY_TYPES = [
  { id: 'walking', name: 'Walking', icon: '🚶', color: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-700 dark:text-green-400' },
  { id: 'running', name: 'Running', icon: '🏃', color: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-700 dark:text-blue-400' },
  { id: 'cycling', name: 'Cycling', icon: '🚴', color: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-700 dark:text-purple-400' },
  { id: 'swimming', name: 'Swimming', icon: '🏊', color: 'bg-cyan-100 dark:bg-cyan-900/30', textColor: 'text-cyan-700 dark:text-cyan-400' },
  { id: 'yoga', name: 'Yoga', icon: '🧘', color: 'bg-amber-100 dark:bg-amber-900/30', textColor: 'text-amber-700 dark:text-amber-400' },
  { id: 'weightlifting', name: 'Weights', icon: '🏋️', color: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-700 dark:text-red-400' },
  { id: 'hiit', name: 'HIIT', icon: '⚡', color: 'bg-orange-100 dark:bg-orange-900/30', textColor: 'text-orange-700 dark:text-orange-400' },
  { id: 'other', name: 'Other', icon: '➕', color: 'bg-gray-100 dark:bg-gray-800', textColor: 'text-gray-700 dark:text-gray-400' },
];

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

export default function LogActivityPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState('');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState('moderate');
  const [notes, setNotes] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [recentActivities, setRecentActivities] = useState([
    { 
      id: '1', 
      type: 'walking', 
      duration: 45, 
      intensity: 'moderate', 
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      caloriesBurned: 180
    },
    { 
      id: '2', 
      type: 'yoga', 
      duration: 30, 
      intensity: 'light', 
      date: new Date(Date.now() - 48 * 60 * 60 * 1000),
      caloriesBurned: 120
    },
    { 
      id: '3', 
      type: 'running', 
      duration: 25, 
      intensity: 'high', 
      date: new Date(Date.now() - 72 * 60 * 60 * 1000),
      caloriesBurned: 250
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format timer to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start tracking timer
  const startTracking = () => {
    setIsTracking(true);
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };
  
  // Pause tracking timer
  const pauseTracking = () => {
    setIsTracking(false);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };
  
  // Reset tracking timer
  const resetTracking = () => {
    pauseTracking();
    setTimer(0);
  };
  
  // Calculate estimated calories
  const calculateCalories = (activityType: string, durationMinutes: number, intensityLevel: string) => {
    // MET (Metabolic Equivalent of Task) values for different activities and intensities
    const metValues: Record<string, Record<string, number>> = {
      walking: { light: 2.5, moderate: 3.5, high: 4.5 },
      running: { light: 6, moderate: 8, high: 10 },
      cycling: { light: 4, moderate: 6, high: 8 },
      swimming: { light: 5, moderate: 7, high: 9 },
      yoga: { light: 2, moderate: 3, high: 4 },
      weightlifting: { light: 3, moderate: 5, high: 6 },
      hiit: { light: 6, moderate: 8, high: 10 },
      other: { light: 3, moderate: 4, high: 5 }
    };
    
    // Default weight in kg if not provided
    const weight = 70;
    
    // Get MET value for activity and intensity
    const met = metValues[activityType]?.[intensityLevel] || 4;
    
    // Calculate calories: MET * weight (kg) * duration (hours)
    const durationHours = durationMinutes / 60;
    const calories = met * weight * durationHours;
    
    return Math.round(calories);
  };
  
  // Handle form submission
  const handleSubmitActivity = async () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    
    // Calculate duration from timer if tracking
    const finalDuration = timer > 0 ? Math.round(timer / 60) : duration;
    const caloriesBurned = calculateCalories(selectedType, finalDuration, intensity);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Add to recent activities
    const newActivity = {
      id: Date.now().toString(),
      type: selectedType,
      duration: finalDuration,
      intensity,
      date: new Date(),
      caloriesBurned
    };
    
    setRecentActivities(prev => [newActivity, ...prev]);
    
    // Reset form
    setSelectedType('');
    setDuration(30);
    setIntensity('moderate');
    setNotes('');
    resetTracking();
    setIsSubmitting(false);
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
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
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Log Activity
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 dark:text-gray-300 mb-8"
        >
          Record your physical activities to track your health progress
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div 
            className="md:col-span-2 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Activity Type Selection */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                What type of activity?
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ACTIVITY_TYPES.map(activity => (
                  <motion.button
                    key={activity.id}
                    onClick={() => setSelectedType(activity.id)}
                    className={`p-4 rounded-xl flex flex-col items-center justify-center ${activity.color} ${
                      selectedType === activity.id 
                        ? 'ring-2 ring-primary dark:ring-primary-400' 
                        : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                    } transition-all`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-3xl mb-2">{activity.icon}</span>
                    <span className={`font-medium ${activity.textColor}`}>{activity.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
            
            {/* Timer and Duration */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <Clock className="inline mr-2 w-5 h-5" />
                Duration
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Timer */}
                <div className="flex-1">
                  <div className="mb-2 text-gray-700 dark:text-gray-300 font-medium">Live Tracking</div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl">
                    <div className="text-4xl font-bold text-center mb-4 text-primary dark:text-primary-400 font-mono">
                      {formatTime(timer)}
                    </div>
                    <div className="flex justify-center gap-4">
                      {!isTracking ? (
                        <motion.button
                          onClick={startTracking}
                          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isSubmitting}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={pauseTracking}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isSubmitting}
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </motion.button>
                      )}
                      <motion.button
                        onClick={resetTracking}
                        className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Reset
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Manual Duration */}
                <div className="flex-1">
                  <div className="mb-2 text-gray-700 dark:text-gray-300 font-medium">Manual Entry</div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl">
                    <div className="text-center mb-4 text-gray-700 dark:text-gray-300">
                      {duration} minutes
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="180" 
                      step="5" 
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span>5 min</span>
                      <span>3 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Intensity */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <Zap className="inline mr-2 w-5 h-5" />
                Intensity Level
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                {['light', 'moderate', 'high'].map(level => (
                  <motion.button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`p-4 rounded-xl ${
                      intensity === level 
                        ? 'bg-primary/10 dark:bg-primary/20 border-2 border-primary dark:border-primary-400' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } transition-all`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-center">
                      <div className={`font-medium ${
                        intensity === level ? 'text-primary dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                      } capitalize`}>
                        {level}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {level === 'light' && 'Easy, can talk'}
                        {level === 'moderate' && 'Breathing harder'}
                        {level === 'high' && 'Difficult to talk'}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
            
            {/* Notes */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Notes (Optional)
              </h2>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                placeholder="How did you feel? Add any notes about your activity..."
              />
            </motion.div>
            
            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                onClick={handleSubmitActivity}
                className="w-full bg-primary hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-70"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedType || isSubmitting}
              >
                {isSubmitting ? (
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
                  <Send className="mr-2 w-5 h-5" />
                )}
                {isSubmitting ? "Saving Activity..." : "Save Activity"}
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* Recent Activities */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Activities
              </h2>
              
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No activities recorded yet
                  </p>
                ) : (
                  <AnimatePresence>
                    {recentActivities.map(activity => {
                      const activityType = ACTIVITY_TYPES.find(type => type.id === activity.type);
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-4 rounded-xl ${activityType?.color || 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                          <div className="flex items-start">
                            <div className="text-2xl mr-3">{activityType?.icon || '🏃'}</div>
                            <div className="flex-1">
                              <div className={`font-medium ${activityType?.textColor || 'text-gray-800 dark:text-gray-200'}`}>
                                {activityType?.name || 'Activity'}
                              </div>
                              <div className="text-gray-700 dark:text-gray-300 text-sm">
                                {activity.duration} minutes • {activity.intensity}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                {activity.date.toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-800 dark:text-gray-200">
                                {activity.caloriesBurned}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">
                                calories
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
              
              {recentActivities.length > 0 && (
                <Link href="/dashboard/insights">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full mt-4 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 flex items-center justify-center font-medium"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    View All Activities
                  </motion.button>
                </Link>
              )}
            </div>
            
            {/* Calorie Estimate Card */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Estimate Calories
              </h2>
              
              {selectedType ? (
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-primary dark:text-primary-400 mb-2">
                    {calculateCalories(selectedType, timer > 0 ? Math.round(timer / 60) : duration, intensity)}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    estimated calories burned
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Select an activity type to see estimated calories
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 