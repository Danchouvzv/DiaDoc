'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { motion } from 'framer-motion';
import { 
  getUserProfile, 
  getGlucoseReadings, 
  getFoodEntries, 
  getActivityEntries, 
  getWellbeingEntries,
  getDailySummaries
} from '@/lib/firebase-db';
import { generateHealthInsights } from '@/ai/health-insights';
import { UserProfile, DailySummary } from '@/lib/schemas';
import { ArrowLeft, Calendar, TrendingUp, Info, Activity, Utensils, Heart } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

export default function Insights() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [insights, setInsights] = useState<any | null>(null);
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get user profile
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        
        // Calculate date range based on timeframe
        const endDate = new Date();
        const startDate = new Date();
        
        switch (timeframe) {
          case 'day':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        }
        
        // Get daily summaries
        const dailySummaries = await getDailySummaries(user.uid, startDate, endDate);
        setSummaries(dailySummaries);
        
        // For demonstration purposes, we'll use mock data instead of calling the AI
        // In a real app, you would fetch the actual data and pass it to the AI
        
        // Get glucose readings
        const glucoseReadings = await getGlucoseReadings(user.uid, startDate, endDate);
        
        // Get food entries
        const foodEntries = await getFoodEntries(user.uid, startDate, endDate);
        
        // Get activity entries
        const activityEntries = await getActivityEntries(user.uid, startDate, endDate);
        
        // Get wellbeing entries
        const wellbeingEntries = await getWellbeingEntries(user.uid, startDate, endDate);
        
        // Generate insights using AI
        const healthInsights = await generateHealthInsights(
          user.uid,
          timeframe,
          glucoseReadings,
          foodEntries,
          activityEntries,
          wellbeingEntries,
          {
            diabetesType: profile?.diabetesType,
            targetGlucoseMin: profile?.targetGlucoseMin,
            targetGlucoseMax: profile?.targetGlucoseMax,
            insulinTherapy: profile?.insulinTherapy
          }
        );
        
        setInsights(healthInsights);
      } catch (error) {
        console.error('Error fetching insights data:', error);
        setError('Failed to load insights. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, timeframe]);
  
  // Mock data for demonstration purposes
  const mockWeeklyData = [
    { day: 'Mon', glucose: 125, carbs: 120, activity: 35 },
    { day: 'Tue', glucose: 132, carbs: 110, activity: 20 },
    { day: 'Wed', glucose: 121, carbs: 130, activity: 45 },
    { day: 'Thu', glucose: 140, carbs: 115, activity: 30 },
    { day: 'Fri', glucose: 135, carbs: 125, activity: 25 },
    { day: 'Sat', glucose: 128, carbs: 140, activity: 60 },
    { day: 'Sun', glucose: 130, carbs: 135, activity: 40 },
  ];
  
  // Use mock data if real data is not available
  const insightsData = insights || {
    summary: "Based on your data from the past week, your glucose control has been generally good with 75% time in range. Your activity levels have helped maintain stable glucose levels, though there's room for improvement in your nutritional choices.",
    glucoseTrends: {
      averageGlucose: 130,
      timeInRange: 75,
      highEvents: 5,
      lowEvents: 2,
      pattern: "Your glucose tends to rise after lunch, particularly on days with higher carb intake."
    },
    nutritionInsights: {
      averageCalories: 1850,
      averageCarbs: 125,
      carbsImpact: "Higher carb meals are causing moderate glucose spikes, especially when consumed without protein or fiber.",
      foodCorrelations: [
        {
          food: "Whole grain bread",
          impact: "positive",
          explanation: "When eaten with protein, helps maintain stable glucose levels"
        },
        {
          food: "White rice",
          impact: "negative",
          explanation: "Causes significant glucose spikes within 30-45 minutes"
        },
        {
          food: "Greek yogurt",
          impact: "positive",
          explanation: "High protein content helps balance glucose response"
        }
      ]
    },
    activityInsights: {
      averageActivityMinutes: 32,
      activityImpact: "Your activity sessions are helping reduce glucose levels by approximately 15-20 mg/dL when done after meals.",
      recommendations: [
        "Try to walk for 10-15 minutes after your largest meal of the day",
        "Consider adding resistance training 2-3 times per week to improve insulin sensitivity",
        "Morning activity appears to have the best impact on your daily glucose patterns"
      ]
    },
    wellbeingInsights: {
      sleepQuality: "Your average of 6.5 hours is below the recommended 7-8 hours, which may be affecting glucose control.",
      stressLevels: "Moderate stress levels reported, which can contribute to glucose variability.",
      recommendations: [
        "Aim for 7-8 hours of sleep consistently",
        "Consider adding a 10-minute meditation practice before bed",
        "Your glucose is most stable on days when you report lower stress levels"
      ]
    },
    recommendations: [
      "Add protein and fiber to your lunch to reduce afternoon glucose spikes",
      "Increase daily activity to at least 45 minutes",
      "Consider eating your carb-heavy meals earlier in the day",
      "Track stress levels alongside glucose readings to identify patterns",
      "Add a 10-15 minute walk after dinner to improve overnight glucose levels"
    ]
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/dashboard" className="flex items-center text-primary mb-4">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Health Insights</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Personalized analysis and recommendations based on your data
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
              {(['day', 'week', 'month'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-md text-sm ${
                    timeframe === period 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-8"
            >
              <div className="flex items-start">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                  <Info size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Summary</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {insightsData.summary}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Glucose Trends */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-8"
            >
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                  <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Glucose Trends</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Glucose</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {insightsData.glucoseTrends.averageGlucose} <span className="text-sm font-normal">mg/dL</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time in Range</p>
                  <p className="text-2xl font-bold text-green-500">
                    {insightsData.glucoseTrends.timeInRange}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">High Events</p>
                  <p className="text-2xl font-bold text-red-500">
                    {insightsData.glucoseTrends.highEvents}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Low Events</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {insightsData.glucoseTrends.lowEvents}
                  </p>
                </div>
              </div>
              
              <div className="h-64 md:h-80 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockWeeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="glucose" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#glucoseGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {insightsData.glucoseTrends.pattern && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Pattern Detected: </span>
                    {insightsData.glucoseTrends.pattern}
                  </p>
                </div>
              )}
            </motion.div>
            
            {/* Nutrition Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-8"
            >
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                  <Utensils size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Nutrition Insights</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Calories</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {insightsData.nutritionInsights.averageCalories} <span className="text-sm font-normal">kcal</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Carbs</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {insightsData.nutritionInsights.averageCarbs}g
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex items-center">
                  <div className="h-16 w-16 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockWeeklyData}>
                        <Bar dataKey="carbs" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Carb Trend</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Past {timeframe}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Carbs Impact</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {insightsData.nutritionInsights.carbsImpact}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Food Correlations</h3>
                <div className="space-y-3">
                  {insightsData.nutritionInsights.foodCorrelations.map((item: any, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className={`w-3 h-3 rounded-full mt-1.5 mr-2 ${
                        item.impact === 'positive' ? 'bg-green-500' : 
                        item.impact === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{item.food}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Activity & Wellbeing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Activity Insights */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                    <Activity size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Activity Insights</h2>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-600 dark:text-gray-400">Average Activity</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">
                      {insightsData.activityInsights.averageActivityMinutes} min
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (insightsData.activityInsights.averageActivityMinutes / 60) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Goal: 60 minutes
                  </p>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {insightsData.activityInsights.activityImpact}
                </p>
                
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations</h3>
                <ul className="space-y-2">
                  {insightsData.activityInsights.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              {/* Wellbeing Insights */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
                    <Heart size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Wellbeing Insights</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Sleep Quality</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {insightsData.wellbeingInsights.sleepQuality}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Stress Levels</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {insightsData.wellbeingInsights.stressLevels}
                    </p>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations</h3>
                <ul className="space-y-2">
                  {insightsData.wellbeingInsights.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            {/* Overall Recommendations */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-xl shadow-sm p-6 border border-primary/20 dark:border-primary/30"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Key Recommendations</h2>
              
              <div className="space-y-3">
                {insightsData.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
} 