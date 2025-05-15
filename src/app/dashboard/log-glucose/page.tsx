'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { motion } from 'framer-motion';
import { createGlucoseReading, getUserProfile } from '@/lib/firebase-db';
import { UserProfile } from '@/lib/schemas';
import { ArrowLeft, Droplet, Info, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function LogGlucose() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [glucoseValue, setGlucoseValue] = useState('');
  const [readingContext, setReadingContext] = useState('before_meal');
  const [readingSource, setReadingSource] = useState('fingerstick');
  const [notes, setNotes] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
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
  
  const handleSaveReading = async () => {
    if (!user?.uid) {
      setError('You must be logged in to save a reading');
      return;
    }
    
    if (!glucoseValue.trim()) {
      setError('Please enter a glucose value');
      return;
    }
    
    const glucoseNumber = parseInt(glucoseValue, 10);
    if (isNaN(glucoseNumber) || glucoseNumber < 20 || glucoseNumber > 600) {
      setError('Please enter a valid glucose value between 20 and 600');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await createGlucoseReading(user.uid, {
        value: glucoseNumber,
        context: readingContext,
        source: readingSource,
        notes: notes.trim() || undefined,
      });
      
      setSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setGlucoseValue('');
        setReadingContext('before_meal');
        setReadingSource('fingerstick');
        setNotes('');
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving glucose reading:', error);
      setError('Failed to save glucose reading. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const getGlucoseStatus = (value: number): { status: string; color: string } => {
    const targetMin = userProfile?.targetGlucoseMin || 70;
    const targetMax = userProfile?.targetGlucoseMax || 140;
    
    if (value < targetMin) {
      return { status: 'Low', color: 'text-red-500' };
    } else if (value > targetMax) {
      return { status: 'High', color: 'text-red-500' };
    } else {
      return { status: 'In Range', color: 'text-green-500' };
    }
  };
  
  const glucoseNumber = parseInt(glucoseValue, 10);
  const glucoseStatus = !isNaN(glucoseNumber) ? getGlucoseStatus(glucoseNumber) : null;
  
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Log Glucose</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track your blood glucose levels to better manage your diabetes
          </p>
        </motion.div>
        
        {/* Glucose Input Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-8"
        >
          <div className="mb-6">
            <label htmlFor="glucoseValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Glucose Value (mg/dL)
            </label>
            <div className="relative">
              <input
                type="number"
                id="glucoseValue"
                value={glucoseValue}
                onChange={(e) => setGlucoseValue(e.target.value)}
                placeholder="Enter your glucose reading"
                min="20"
                max="600"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {glucoseStatus && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
                  <span className={`font-medium ${glucoseStatus.color}`}>
                    {glucoseStatus.status}
                  </span>
                </div>
              )}
            </div>
            {error && (
              <p className="mt-2 text-red-500 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {error}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="readingContext" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reading Context
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: 'before_meal', label: 'Before Meal' },
                  { value: 'after_meal', label: 'After Meal' },
                  { value: 'fasting', label: 'Fasting' },
                  { value: 'bedtime', label: 'Bedtime' },
                ].map((context) => (
                  <button
                    key={context.value}
                    type="button"
                    onClick={() => setReadingContext(context.value)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                      readingContext === context.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <span>{context.label}</span>
                    {readingContext === context.value && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="readingSource" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reading Source
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: 'fingerstick', label: 'Fingerstick' },
                  { value: 'cgm', label: 'Continuous Glucose Monitor' },
                  { value: 'lab_test', label: 'Lab Test' },
                ].map((source) => (
                  <button
                    key={source.value}
                    type="button"
                    onClick={() => setReadingSource(source.value)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                      readingSource === source.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <span>{source.label}</span>
                    {readingSource === source.value && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this reading"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>
          
          <button
            onClick={handleSaveReading}
            disabled={loading || !glucoseValue.trim()}
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
                <Droplet size={18} className="mr-2" />
                Save Glucose Reading
              </span>
            )}
          </button>
        </motion.div>
        
        {/* Target Range Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-8"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
              <Info size={20} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Target Range</h2>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-700 dark:text-gray-300">
                Your target glucose range is set to:
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {userProfile?.targetGlucoseMin || 70} - {userProfile?.targetGlucoseMax || 140} mg/dL
              </p>
            </div>
            
            <Link href="/dashboard/settings">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Update Target Range
              </button>
            </Link>
          </div>
        </motion.div>
        
        {/* Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800"
        >
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg mr-4">
              <Clock size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">When to Check Your Blood Glucose</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                    1
                  </span>
                  Before meals and 2 hours after meals
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                    2
                  </span>
                  Before and after exercise
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                    3
                  </span>
                  Before bedtime
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                    4
                  </span>
                  When you feel symptoms of high or low blood sugar
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 