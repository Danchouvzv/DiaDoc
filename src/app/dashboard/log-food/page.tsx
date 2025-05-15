'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { motion } from 'framer-motion';
import { createFoodEntry, getUserProfile } from '@/lib/firebase-db';
import { analyzeFoodWithAI } from '@/ai/food-analyzer';
import { UserProfile } from '@/lib/schemas';
import { ArrowLeft, Search, Utensils, Clock, Info, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { GeminiService } from '@/lib/gemini-service';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { MessagingService } from '@/lib/firebase-messaging';

interface FoodEntry {
  description: string;
  portion: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
}

export default function LogFood() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [foodDescription, setFoodDescription] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, reset } = useForm<FoodEntry>();
  const geminiService = GeminiService.getInstance();
  const messagingService = MessagingService.getInstance();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  const onSubmit = async (data: FoodEntry) => {
    if (!user) return;

    setAnalyzing(true);
    try {
      // Analyze food with AI
      const analysis = await geminiService.analyzeFoodEntry(
        `${data.portion} of ${data.description} for ${data.mealType} at ${data.time}`
      );

      setAnalysisResult(analysis);

      // Save to Firestore
      const foodEntryRef = doc(db, 'users', user.uid, 'foodEntries', new Date().toISOString());
      await setDoc(foodEntryRef, {
        ...data,
        analysis,
        timestamp: new Date().toISOString(),
      });

      // Show success notification
      toast.success('Food entry logged successfully!');

      // Reset form
      reset();

      // Send reminder notification for glucose check
      const reminderTime = new Date();
      reminderTime.setHours(reminderTime.getHours() + 2);
      
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          title: 'Glucose Check Reminder',
          body: `Time to check your glucose levels after your ${data.mealType}!`,
          scheduledTime: reminderTime.toISOString(),
        }),
      });

    } catch (error) {
      console.error('Error logging food:', error);
      toast.error('Failed to log food entry. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };
  
  const getImpactColor = (impact: 'low' | 'moderate' | 'high') => {
    switch (impact) {
      case 'low':
        return 'text-green-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Log Food</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Record what you ate and get instant analysis for better glucose management
          </p>
        </motion.div>
        
        {/* Food Input Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-8"
        >
          <div className="mb-6">
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meal Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type)}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg border ${
                    mealType === type
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="foodDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What did you eat?
            </label>
            <div className="relative">
              <input
                type="text"
                id="foodDescription"
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                placeholder="E.g. Oatmeal with berries and honey"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={analyzing || !foodDescription.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Analyzing
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Search size={16} className="mr-2" />
                    Analyze
                  </span>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red-500 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {error}
              </p>
            )}
          </div>
        </motion.div>
        
        {/* Analysis Results */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Food Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Nutritional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysisResult.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{key}:</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Glucose Impact</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Expected Impact:</span>
                    <span className={`font-bold ${getImpactColor(analysisResult.glucoseImpact.expectedImpact)}`}>
                      {analysisResult.glucoseImpact.expectedImpact.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 dark:text-gray-300">Rise Speed:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {analysisResult.glucoseImpact.riseSpeed.charAt(0).toUpperCase() + analysisResult.glucoseImpact.riseSpeed.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {analysisResult.glucoseImpact.explanation}
                  </p>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className={`w-4 h-4 rounded-full ${analysisResult.diabetesFriendly ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    {analysisResult.diabetesFriendly ? 'Diabetes-Friendly' : 'Not Diabetes-Friendly'}
                  </h3>
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Info size={18} className="mr-2 text-primary" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="inline-block w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                      {index + 1}
                    </span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Alternatives */}
            {analysisResult.alternatives && analysisResult.alternatives.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Healthier Alternatives</h3>
                <ul className="space-y-2">
                  {analysisResult.alternatives.map((alternative: string, index: number) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {alternative}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Save Button */}
            <div className="mt-8">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Saving...
                  </span>
                ) : success ? (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Saved Successfully
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Utensils size={18} className="mr-2" />
                    Save Food Entry
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800"
        >
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg mr-4">
              <Info size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Tips for Better Tracking</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                    1
                  </span>
                  Be specific about portion sizes (e.g., "1 cup of rice" instead of just "rice")
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                    2
                  </span>
                  Include cooking methods and ingredients (e.g., "grilled chicken with olive oil")
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                    3
                  </span>
                  Log your food right after eating for the most accurate tracking
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 