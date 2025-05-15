import { ai } from './genkit';
import { 
  GlucoseReading, FoodEntry, 
  ActivityEntry, WellbeingEntry,
  DailySummary
} from '../lib/schemas';

interface HealthInsight {
  summary: string;
  glucoseTrends: {
    averageGlucose: number;
    timeInRange: number;
    highEvents: number;
    lowEvents: number;
    pattern?: string;
  };
  nutritionInsights: {
    averageCalories: number;
    averageCarbs: number;
    carbsImpact: string;
    foodCorrelations: Array<{
      food: string;
      impact: 'positive' | 'negative' | 'neutral';
      explanation: string;
    }>;
  };
  activityInsights: {
    averageActivityMinutes: number;
    activityImpact: string;
    recommendations: string[];
  };
  wellbeingInsights: {
    sleepQuality: string;
    stressLevels: string;
    recommendations: string[];
  };
  recommendations: string[];
}

/**
 * Analyzes user health data and generates personalized insights and recommendations
 */
export async function generateHealthInsights(
  userId: string,
  timeframe: 'day' | 'week' | 'month',
  glucoseReadings: any[],
  foodEntries: any[],
  activityEntries: any[],
  wellbeingEntries: any[],
  userContext?: {
    diabetesType?: string | null;
    targetGlucoseMin?: number;
    targetGlucoseMax?: number;
    insulinTherapy?: boolean;
  }
): Promise<HealthInsight> {
  // In a real implementation, this would call an AI service like Gemini
  // For now, we'll return mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
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
}

/**
 * Generates a daily summary and insights based on the user's data for a specific day
 */
export async function generateDailySummary(
  userId: string,
  date: Date,
  glucoseReadings: GlucoseReading[],
  foodEntries: FoodEntry[],
  activityEntries: ActivityEntry[],
  wellbeingEntries: WellbeingEntry[],
  userProfile: {
    diabetesType?: 'type1' | 'type2' | 'gestational' | 'prediabetes';
    targetGlucoseMin?: number;
    targetGlucoseMax?: number;
    goalDailySteps?: number;
    goalDailyCalories?: number;
  }
): Promise<{
  summary: string;
  insights: string[];
  achievements: string[];
  recommendations: string[];
}> {
  try {
    // Process glucose data
    const glucoseValues = glucoseReadings.map(reading => reading.value);
    const averageGlucose = glucoseValues.length > 0 
      ? Math.round(glucoseValues.reduce((sum, val) => sum + val, 0) / glucoseValues.length) 
      : 0;
    
    const highestGlucose = glucoseValues.length > 0 ? Math.max(...glucoseValues) : 0;
    const lowestGlucose = glucoseValues.length > 0 ? Math.min(...glucoseValues) : 0;
    
    const targetMin = userProfile.targetGlucoseMin || 70;
    const targetMax = userProfile.targetGlucoseMax || 140;
    
    const readingsInRange = glucoseReadings.filter(
      reading => reading.value >= targetMin && reading.value <= targetMax
    ).length;
    
    const timeInRange = glucoseReadings.length > 0 
      ? Math.round((readingsInRange / glucoseReadings.length) * 100) 
      : 0;
    
    // Process nutrition data
    const totalCalories = foodEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const totalCarbs = foodEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
    const totalProtein = foodEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
    const totalFat = foodEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0);
    
    // Process activity data
    const totalSteps = activityEntries.reduce((sum, entry) => {
      if (entry.activityType === 'walking' || entry.activityType === 'running') {
        return sum + (entry.steps || 0);
      }
      return sum;
    }, 0);
    
    const totalActivityMinutes = activityEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const totalCaloriesBurned = activityEntries.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0);
    
    // Process wellbeing data
    const sleepDuration = wellbeingEntries.length > 0 
      ? wellbeingEntries[0].sleepDuration || 0 
      : 0;
    
    // Convert stress level enum to numeric value
    const getStressLevelValue = (level?: string) => {
      if (!level) return 0;
      switch(level) {
        case 'low': return 1;
        case 'moderate': return 2;
        case 'high': return 3;
        case 'severe': return 4;
        default: return 0;
      }
    };
    
    const stressLevel = wellbeingEntries.length > 0 
      ? getStressLevelValue(wellbeingEntries[0].stressLevel) 
      : 0;
    
    // Format date for display
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Build context for AI analysis
    const diabetesContext = userProfile.diabetesType 
      ? `The user has ${userProfile.diabetesType} diabetes. ` 
      : 'The user has diabetes. ';
    
    const goalContext = `The user's daily goals are: ${userProfile.goalDailySteps || 10000} steps and ${userProfile.goalDailyCalories || 2000} calories.`;
    
    // Construct the prompt for Gemini
    const prompt = `
    ${diabetesContext}${goalContext}
    
    I'm going to provide you with health data for ${formattedDate} for a diabetic patient. Please generate a daily summary with insights, achievements, and recommendations.
    
    Glucose Data:
    - Average glucose: ${averageGlucose} mg/dL
    - Highest glucose: ${highestGlucose} mg/dL
    - Lowest glucose: ${lowestGlucose} mg/dL
    - Time in range (${targetMin}-${targetMax} mg/dL): ${timeInRange}%
    - Number of readings: ${glucoseReadings.length}
    
    Nutrition Data:
    - Total calories consumed: ${totalCalories} kcal
    - Total carbohydrates: ${totalCarbs} g
    - Total protein: ${totalProtein} g
    - Total fat: ${totalFat} g
    - Number of meals recorded: ${foodEntries.length}
    
    Activity Data:
    - Total steps: ${totalSteps} steps
    - Total activity minutes: ${totalActivityMinutes} minutes
    - Total calories burned: ${totalCaloriesBurned} kcal
    - Number of activities recorded: ${activityEntries.length}
    
    Wellbeing Data:
    - Sleep duration: ${sleepDuration} hours
    - Stress level (1-4): ${stressLevel}
    
    Based on this data, please provide:
    1. A brief summary of the day
    2. Key insights about the user's health for this day
    3. Achievements or positive points to celebrate
    4. Personalized recommendations for improvement
    
    Return the response as a structured JSON object with the following format:
    {
      "summary": "Brief summary of the day",
      "insights": ["insight1", "insight2", ...],
      "achievements": ["achievement1", "achievement2", ...],
      "recommendations": ["recommendation1", "recommendation2", ...]
    }
    `;
    
    try {
      // Call Gemini API
      const response = await ai.generate({
        prompt: prompt
      });
      
      const responseText = response.text;
      let resultJson;
      
      try {
        // Try to parse the response as JSON
        resultJson = JSON.parse(responseText);
      } catch (parseError) {
        // If parsing fails, try to extract JSON from the text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          resultJson = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract JSON from the AI response');
        }
      }
      
      // Validate and return the result
      return {
        summary: resultJson?.summary || `Daily summary for ${formattedDate}`,
        insights: Array.isArray(resultJson?.insights) ? resultJson.insights : [],
        achievements: Array.isArray(resultJson?.achievements) ? resultJson.achievements : [],
        recommendations: Array.isArray(resultJson?.recommendations) ? resultJson.recommendations : []
      };
    } catch (aiError) {
      console.error('Error calling AI service:', aiError);
      throw aiError;
    }
  } catch (error) {
    console.error('Error generating daily summary:', error);
    // Return a fallback response
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return {
      summary: `Daily summary for ${formattedDate}`,
      insights: ['Unable to generate insights due to an error'],
      achievements: [],
      recommendations: ['Please try again later']
    };
  }
}