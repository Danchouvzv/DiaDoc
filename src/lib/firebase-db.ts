import { db } from './firebase';
import { 
  collection, doc, setDoc, getDoc, getDocs, 
  updateDoc, query, where, orderBy, limit as firestoreLimit, 
  Timestamp, QueryConstraint, deleteDoc, addDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { 
  UserProfile, FoodEntry, 
  ActivityEntry, GlucoseReading, 
  WellbeingEntry, DailySummary 
} from './schemas';

// Collection names
const USERS_COLLECTION = 'users';
const FOOD_ENTRIES_COLLECTION = 'foodEntries';
const ACTIVITY_ENTRIES_COLLECTION = 'activityEntries';
const GLUCOSE_READINGS_COLLECTION = 'glucoseReadings';
const WELLBEING_ENTRIES_COLLECTION = 'wellbeingEntries';
const DAILY_SUMMARIES_COLLECTION = 'dailySummaries';

// Helper function to convert Firestore timestamp to ISO string
const timestampToISOString = (timestamp: Timestamp) => {
  return timestamp.toDate().toISOString();
};

// User Profile Operations
export const createUserProfile = async (userId: string, email: string, profile: Partial<UserProfile> = {}) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const now = new Date().toISOString();
  
  const userProfile: UserProfile = {
    id: userId,
    email,
    name: profile.name || '',
    diabetesType: profile.diabetesType,
    insulinTherapy: profile.insulinTherapy || false,
    dateOfBirth: profile.dateOfBirth,
    weight: profile.weight,
    height: profile.height,
    goalDailySteps: profile.goalDailySteps || 10000,
    goalDailyCalories: profile.goalDailyCalories || 2000,
    targetGlucoseMin: profile.targetGlucoseMin || 70,
    targetGlucoseMax: profile.targetGlucoseMax || 140,
    createdAt: now,
    updatedAt: now,
  };
  
  await setDoc(userRef, userProfile);
  return userProfile;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  
  return null;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const updatedData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await updateDoc(userRef, updatedData);
  return updatedData;
};

// Food Entry Operations
export const createFoodEntry = async (userId: string, entryData: Omit<FoodEntry, 'id' | 'userId' | 'timestamp'>) => {
  const entryId = uuidv4();
  const foodEntryRef = doc(db, FOOD_ENTRIES_COLLECTION, entryId);
  
  const foodEntry: FoodEntry = {
    id: entryId,
    userId,
    timestamp: new Date().toISOString(),
    ...entryData,
  };
  
  await setDoc(foodEntryRef, foodEntry);
  return foodEntry;
};

export const getFoodEntries = async (userId: string, startDate?: Date, endDate?: Date, mealType?: string, limitCount?: number) => {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
  ];
  
  if (startDate && endDate) {
    constraints.push(where('timestamp', '>=', startDate.toISOString()));
    constraints.push(where('timestamp', '<=', endDate.toISOString()));
  }
  
  if (mealType) {
    constraints.push(where('mealType', '==', mealType));
  }
  
  if (limitCount) {
    constraints.push(firestoreLimit(limitCount));
  }
  
  const q = query(collection(db, FOOD_ENTRIES_COLLECTION), ...constraints);
  const querySnapshot = await getDocs(q);
  
  const entries: FoodEntry[] = [];
  querySnapshot.forEach((doc) => {
    entries.push(doc.data() as FoodEntry);
  });
  
  return entries;
};

export const updateFoodEntry = async (entryId: string, updates: Partial<FoodEntry>) => {
  const entryRef = doc(db, FOOD_ENTRIES_COLLECTION, entryId);
  await updateDoc(entryRef, updates);
  return updates;
};

export const deleteFoodEntry = async (entryId: string) => {
  const entryRef = doc(db, FOOD_ENTRIES_COLLECTION, entryId);
  await deleteDoc(entryRef);
  return { success: true, id: entryId };
};

// Activity Entry Operations
export const createActivityEntry = async (userId: string, entryData: Omit<ActivityEntry, 'id' | 'userId' | 'timestamp'>) => {
  const entryId = uuidv4();
  const activityEntryRef = doc(db, ACTIVITY_ENTRIES_COLLECTION, entryId);
  
  const activityEntry: ActivityEntry = {
    id: entryId,
    userId,
    timestamp: new Date().toISOString(),
    ...entryData,
  };
  
  await setDoc(activityEntryRef, activityEntry);
  return activityEntry;
};

export const getActivityEntries = async (userId: string, startDate?: Date, endDate?: Date, activityType?: string, limitCount?: number) => {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
  ];
  
  if (startDate && endDate) {
    constraints.push(where('timestamp', '>=', startDate.toISOString()));
    constraints.push(where('timestamp', '<=', endDate.toISOString()));
  }
  
  if (activityType) {
    constraints.push(where('activityType', '==', activityType));
  }
  
  if (limitCount) {
    constraints.push(firestoreLimit(limitCount));
  }
  
  const q = query(collection(db, ACTIVITY_ENTRIES_COLLECTION), ...constraints);
  const querySnapshot = await getDocs(q);
  
  const entries: ActivityEntry[] = [];
  querySnapshot.forEach((doc) => {
    entries.push(doc.data() as ActivityEntry);
  });
  
  return entries;
};

export const updateActivityEntry = async (entryId: string, updates: Partial<ActivityEntry>) => {
  const entryRef = doc(db, ACTIVITY_ENTRIES_COLLECTION, entryId);
  await updateDoc(entryRef, updates);
  return updates;
};

export const deleteActivityEntry = async (entryId: string) => {
  const entryRef = doc(db, ACTIVITY_ENTRIES_COLLECTION, entryId);
  await deleteDoc(entryRef);
  return { success: true, id: entryId };
};

// Glucose Reading Operations
export const createGlucoseReading = async (userId: string, readingData: Omit<GlucoseReading, 'id' | 'userId' | 'timestamp'>) => {
  const readingId = uuidv4();
  const glucoseReadingRef = doc(db, GLUCOSE_READINGS_COLLECTION, readingId);
  
  const glucoseReading: GlucoseReading = {
    id: readingId,
    userId,
    timestamp: new Date().toISOString(),
    ...readingData,
  };
  
  await setDoc(glucoseReadingRef, glucoseReading);
  return glucoseReading;
};

export const getGlucoseReadings = async (userId: string, startDate?: Date, endDate?: Date, limitCount?: number) => {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
  ];
  
  if (startDate && endDate) {
    constraints.push(where('timestamp', '>=', startDate.toISOString()));
    constraints.push(where('timestamp', '<=', endDate.toISOString()));
  }
  
  if (limitCount) {
    constraints.push(firestoreLimit(limitCount));
  }
  
  const q = query(collection(db, GLUCOSE_READINGS_COLLECTION), ...constraints);
  const querySnapshot = await getDocs(q);
  
  const readings: GlucoseReading[] = [];
  querySnapshot.forEach((doc) => {
    readings.push(doc.data() as GlucoseReading);
  });
  
  return readings;
};

export const updateGlucoseReading = async (readingId: string, updates: Partial<GlucoseReading>) => {
  const readingRef = doc(db, GLUCOSE_READINGS_COLLECTION, readingId);
  await updateDoc(readingRef, updates);
  return updates;
};

export const deleteGlucoseReading = async (readingId: string) => {
  const readingRef = doc(db, GLUCOSE_READINGS_COLLECTION, readingId);
  await deleteDoc(readingRef);
  return { success: true, id: readingId };
};

// Wellbeing Entry Operations
export const createWellbeingEntry = async (userId: string, entryData: Omit<WellbeingEntry, 'id' | 'userId' | 'timestamp'>) => {
  const entryId = uuidv4();
  const wellbeingEntryRef = doc(db, WELLBEING_ENTRIES_COLLECTION, entryId);
  
  const wellbeingEntry: WellbeingEntry = {
    id: entryId,
    userId,
    timestamp: new Date().toISOString(),
    ...entryData,
  };
  
  await setDoc(wellbeingEntryRef, wellbeingEntry);
  return wellbeingEntry;
};

export const getWellbeingEntries = async (userId: string, startDate?: Date, endDate?: Date, limitCount?: number) => {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
  ];
  
  if (startDate && endDate) {
    constraints.push(where('timestamp', '>=', startDate.toISOString()));
    constraints.push(where('timestamp', '<=', endDate.toISOString()));
  }
  
  if (limitCount) {
    constraints.push(firestoreLimit(limitCount));
  }
  
  const q = query(collection(db, WELLBEING_ENTRIES_COLLECTION), ...constraints);
  const querySnapshot = await getDocs(q);
  
  const entries: WellbeingEntry[] = [];
  querySnapshot.forEach((doc) => {
    entries.push(doc.data() as WellbeingEntry);
  });
  
  return entries;
};

// Daily Summary Operations
export const createOrUpdateDailySummary = async (userId: string, date: Date, summaryData: Partial<DailySummary>) => {
  // Format date as YYYY-MM-DD to use as document ID
  const dateString = date.toISOString().split('T')[0];
  const summaryId = `${userId}_${dateString}`;
  
  const summaryRef = doc(db, DAILY_SUMMARIES_COLLECTION, summaryId);
  const summaryDoc = await getDoc(summaryRef);
  
  if (summaryDoc.exists()) {
    // Update existing summary
    await updateDoc(summaryRef, {
      ...summaryData,
      updatedAt: serverTimestamp(),
    });
    
    const updatedDoc = await getDoc(summaryRef);
    return updatedDoc.data() as DailySummary;
  } else {
    // Create new summary
    const newSummary: DailySummary = {
      id: summaryId,
      userId,
      date: date.toISOString(),
      averageGlucose: summaryData.averageGlucose,
      highestGlucose: summaryData.highestGlucose,
      lowestGlucose: summaryData.lowestGlucose,
      glucoseReadingsCount: summaryData.glucoseReadingsCount || 0,
      totalCaloriesConsumed: summaryData.totalCaloriesConsumed || 0,
      totalCarbs: summaryData.totalCarbs || 0,
      totalProtein: summaryData.totalProtein || 0,
      totalFat: summaryData.totalFat || 0,
      totalSteps: summaryData.totalSteps || 0,
      totalActivityMinutes: summaryData.totalActivityMinutes || 0,
      totalCaloriesBurned: summaryData.totalCaloriesBurned || 0,
      dailySummaryGenerated: summaryData.dailySummaryGenerated || false,
      insights: summaryData.insights,
    };
    
    await setDoc(summaryRef, newSummary);
    return newSummary;
  }
};

export const getDailySummary = async (userId: string, date: Date) => {
  const dateString = date.toISOString().split('T')[0];
  const summaryId = `${userId}_${dateString}`;
  
  const summaryRef = doc(db, DAILY_SUMMARIES_COLLECTION, summaryId);
  const summaryDoc = await getDoc(summaryRef);
  
  if (summaryDoc.exists()) {
    return summaryDoc.data() as DailySummary;
  }
  
  return null;
};

export const getDailySummaries = async (userId: string, startDate?: Date, endDate?: Date, limitCount?: number) => {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('date', 'desc'),
  ];
  
  if (startDate && endDate) {
    constraints.push(where('date', '>=', startDate.toISOString()));
    constraints.push(where('date', '<=', endDate.toISOString()));
  }
  
  if (limitCount) {
    constraints.push(firestoreLimit(limitCount));
  }
  
  const q = query(collection(db, DAILY_SUMMARIES_COLLECTION), ...constraints);
  const querySnapshot = await getDocs(q);
  
  const summaries: DailySummary[] = [];
  querySnapshot.forEach((doc) => {
    summaries.push(doc.data() as DailySummary);
  });
  
  return summaries;
}; 