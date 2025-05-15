'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { getUserProfile } from '@/lib/firebase-db';
import { UserProfile } from '@/lib/schemas';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { ArrowUpRight, Activity, Utensils, Heart, Droplet } from 'lucide-react';
import Link from 'next/link';

// Mock data - would be replaced with real data from Firebase
const mockGlucoseData = [
  { time: '6:00', glucose: 120 },
  { time: '8:00', glucose: 145 },
  { time: '10:00', glucose: 130 },
  { time: '12:00', glucose: 160 },
  { time: '14:00', glucose: 120 },
  { time: '16:00', glucose: 110 },
  { time: '18:00', glucose: 125 },
  { time: '20:00', glucose: 140 },
  { time: '22:00', glucose: 115 },
];

const mockFoodData = [
  { id: 1, name: 'Breakfast', time: '8:30', description: 'Oatmeal with berries', carbs: 35, calories: 320 },
  { id: 2, name: 'Lunch', time: '12:30', description: 'Grilled chicken salad', carbs: 20, calories: 450 },
  { id: 3, name: 'Snack', time: '15:00', description: 'Apple with almond butter', carbs: 15, calories: 200 },
];

const mockActivityData = [
  { id: 1, type: 'Walking', time: '7:00', duration: 30, calories: 120 },
  { id: 2, type: 'Strength Training', time: '17:00', duration: 45, calories: 220 },
];

const mockWeeklyStats = [
  { day: 'Mon', glucose: 125, carbs: 120, activity: 35 },
  { day: 'Tue', glucose: 132, carbs: 110, activity: 20 },
  { day: 'Wed', glucose: 121, carbs: 130, activity: 45 },
  { day: 'Thu', glucose: 140, carbs: 115, activity: 30 },
  { day: 'Fri', glucose: 135, carbs: 125, activity: 25 },
  { day: 'Sat', glucose: 128, carbs: 140, activity: 60 },
  { day: 'Sun', glucose: 130, carbs: 135, activity: 40 },
];

const mockInsights = [
  "Your glucose levels tend to rise after lunch. Consider reducing carb intake at this meal.",
  "You've been consistently active this week! Keep it up for better glucose control.",
  "Your average glucose is 10% lower than last week. Great improvement!",
];

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const calculateTimeInRange = () => {
    const inRange = mockGlucoseData.filter(reading => reading.glucose >= 70 && reading.glucose <= 140).length;
    return Math.round((inRange / mockGlucoseData.length) * 100);
  };
  
  const averageGlucose = Math.round(
    mockGlucoseData.reduce((sum, reading) => sum + reading.glucose, 0) / mockGlucoseData.length
  );
  
  const totalCarbs = mockFoodData.reduce((sum, food) => sum + food.carbs, 0);
  const totalCalories = mockFoodData.reduce((sum, food) => sum + food.calories, 0);
  const totalActivityMinutes = mockActivityData.reduce((sum, activity) => sum + activity.duration, 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Hello, {profile?.name || 'there'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link href="/dashboard/log-food">
              <button className="px-4 py-2 bg-primary text-white rounded-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors">
                <Utensils size={18} />
                <span>Log Food</span>
              </button>
            </Link>
            <Link href="/dashboard/log-glucose">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors">
                <Droplet size={18} />
                <span>Log Glucose</span>
              </button>
            </Link>
          </div>
        </motion.div>
        
        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Glucose Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Droplet size={20} className="text-blue-500" />
                </div>
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Glucose</h3>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Today</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{averageGlucose}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">mg/dL average</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-500">{calculateTimeInRange()}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">in range</p>
              </div>
            </div>
          </div>
          
          {/* Carbs Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Utensils size={20} className="text-green-500" />
                </div>
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Carbs</h3>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Today</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalCarbs}g</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">consumed</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{totalCalories}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">calories</p>
              </div>
            </div>
          </div>
          
          {/* Activity Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Activity size={20} className="text-purple-500" />
                </div>
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Activity</h3>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Today</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalActivityMinutes}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">active minutes</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {mockActivityData.reduce((sum, activity) => sum + activity.calories, 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">calories burned</p>
              </div>
            </div>
          </div>
          
          {/* Health Score Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Heart size={20} className="text-red-500" />
                </div>
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Health Score</h3>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Weekly</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">82</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">out of 100</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-500">+5%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">from last week</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Glucose Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Glucose Trends</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('today')}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeTab === 'today' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                Today
              </button>
              <button 
                onClick={() => setActiveTab('week')}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeTab === 'week' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                This Week
              </button>
            </div>
          </div>
          
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'today' ? (
                <LineChart data={mockGlucoseData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[60, 200]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="glucose" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
                  />
                  {/* Target range */}
                  <svg>
                    <rect x="0" y="70" width="100%" height="70" fill="rgba(0, 255, 0, 0.1)" />
                  </svg>
                </LineChart>
              ) : (
                <AreaChart data={mockWeeklyStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
              )}
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Glucose (mg/dL)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-3 bg-green-100 dark:bg-green-900/30 rounded-sm"></div>
              <span>Target Range (70-140 mg/dL)</span>
            </div>
          </div>
        </motion.div>
        
        {/* Food and Activity Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Food Log */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Today's Food</h2>
              <Link href="/dashboard/food-log">
                <button className="text-primary flex items-center space-x-1 text-sm">
                  <span>View All</span>
                  <ArrowUpRight size={16} />
                </button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {mockFoodData.map((food) => (
                <div key={food.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">{food.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{food.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{food.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800 dark:text-white">{food.carbs}g</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{food.calories} kcal</p>
                  </div>
                </div>
              ))}
              
              {mockFoodData.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No food entries today</p>
                  <Link href="/dashboard/log-food">
                    <button className="mt-2 text-primary">+ Add Food</button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Activity Log */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Today's Activity</h2>
              <Link href="/dashboard/activity-log">
                <button className="text-primary flex items-center space-x-1 text-sm">
                  <span>View All</span>
                  <ArrowUpRight size={16} />
                </button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {mockActivityData.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">{activity.type}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.duration} minutes</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800 dark:text-white">{activity.calories}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">calories</p>
                  </div>
                </div>
              ))}
              
              {mockActivityData.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No activity entries today</p>
                  <Link href="/dashboard/log-activity">
                    <button className="mt-2 text-primary">+ Add Activity</button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Health Insights</h2>
            <Link href="/dashboard/insights">
              <button className="text-primary flex items-center space-x-1 text-sm">
                <span>View All</span>
                <ArrowUpRight size={16} />
              </button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-800 dark:text-gray-200">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 