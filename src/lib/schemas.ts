import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // path of error
});
export type RegisterFormData = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

// User profile schema
export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  diabetesType: z.enum(["type1", "type2", "gestational", "other", "prediabetes"]).optional(),
  insulinTherapy: z.boolean().optional(),
  dateOfBirth: z.string().optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  goalDailySteps: z.number().int().positive().default(10000),
  goalDailyCalories: z.number().int().positive().default(2000),
  targetGlucoseMin: z.number().positive().default(70),
  targetGlucoseMax: z.number().positive().default(140),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Food entry schema
export const FoodEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  timestamp: z.string().datetime(),
  description: z.string(),
  photo: z.string().optional(), // URL to photo in storage
  calories: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  analyzedByAI: z.boolean().default(false),
  recommendations: z.string().optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
  glucoseImpact: z.number().optional(), // Tracked glucose change after meal
});

export type FoodEntry = z.infer<typeof FoodEntrySchema>;

// Activity entry schema
export const ActivityEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  timestamp: z.string().datetime(),
  activityType: z.enum(["walking", "running", "cycling", "swimming", "yoga", "weightlifting", "other"]),
  duration: z.number().int().positive(), // in minutes
  distance: z.number().nonnegative().optional(), // in km or miles
  steps: z.number().int().nonnegative().optional(),
  caloriesBurned: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
  glucoseImpact: z.number().optional(), // Tracked glucose change after activity
});

export type ActivityEntry = z.infer<typeof ActivityEntrySchema>;

// Glucose reading schema
export const GlucoseReadingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  timestamp: z.string().datetime(),
  value: z.number().positive(),
  unit: z.enum(["mg/dL", "mmol/L"]).default("mg/dL"),
  mealContext: z.enum(["fasting", "before_meal", "after_meal", "bedtime", "other"]).optional(),
  notes: z.string().optional(),
  source: z.enum(["manual", "cgm", "glucometer"]).default("manual"),
});

export type GlucoseReading = z.infer<typeof GlucoseReadingSchema>;

// Wellbeing entry schema (sleep, stress, etc.)
export const WellbeingEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  timestamp: z.string().datetime(),
  sleepDuration: z.number().nonnegative().optional(), // in hours
  sleepQuality: z.enum(["poor", "fair", "good", "excellent"]).optional(),
  stressLevel: z.enum(["low", "moderate", "high", "severe"]).optional(),
  mood: z.enum(["very_bad", "bad", "neutral", "good", "very_good"]).optional(),
  notes: z.string().optional(),
});

export type WellbeingEntry = z.infer<typeof WellbeingEntrySchema>;

// Daily summary schema
export const DailySummarySchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string().datetime(),
  averageGlucose: z.number().optional(),
  highestGlucose: z.number().optional(),
  lowestGlucose: z.number().optional(),
  glucoseReadingsCount: z.number().int().nonnegative().default(0),
  totalCaloriesConsumed: z.number().nonnegative().default(0),
  totalCarbs: z.number().nonnegative().default(0),
  totalProtein: z.number().nonnegative().default(0),
  totalFat: z.number().nonnegative().default(0),
  totalSteps: z.number().int().nonnegative().default(0),
  totalActivityMinutes: z.number().int().nonnegative().default(0),
  totalCaloriesBurned: z.number().int().nonnegative().default(0),
  dailySummaryGenerated: z.boolean().default(false),
  insights: z.string().optional(),
});

export type DailySummary = z.infer<typeof DailySummarySchema>;
