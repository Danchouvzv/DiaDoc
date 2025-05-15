import { ai } from './genkit';
import { FoodEntry } from '../lib/schemas';

interface FoodAnalysisResult {
  description: string;
  nutritionalInfo: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
  glucoseImpact: {
    expectedImpact: 'low' | 'moderate' | 'high';
    riseSpeed: 'slow' | 'moderate' | 'fast';
    explanation: string;
  };
  diabetesFriendly: boolean;
  recommendations: string[];
  alternatives?: string[];
}

/**
 * Analyzes food description using Gemini AI to extract nutritional information
 * and provide insights for diabetic patients
 */
export async function analyzeFoodWithAI(
  foodDescription: string,
  diabetesType?: string | null,
  options?: {
    insulinSensitive?: boolean;
    dietaryRestrictions?: string[];
    preferredCuisines?: string[];
  }
): Promise<FoodAnalysisResult> {
  // In a real implementation, this would call an AI service like Gemini
  // For now, we'll return mock data based on the food description
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple logic to categorize food
  const isHighCarb = /pasta|rice|bread|potato|sugar|cake|cookie|dessert/i.test(foodDescription);
  const isProteinRich = /chicken|fish|beef|pork|tofu|egg|meat|protein/i.test(foodDescription);
  const isVegetable = /vegetable|salad|broccoli|spinach|kale|carrot/i.test(foodDescription);
  const isFruit = /fruit|apple|banana|orange|berry|berries/i.test(foodDescription);
  const isDairy = /milk|cheese|yogurt|dairy/i.test(foodDescription);
  
  // Calculate mock nutritional values
  let calories = 0;
  let carbs = 0;
  let protein = 0;
  let fat = 0;
  let fiber = 0;
  let sugar = 0;
  
  if (isHighCarb) {
    carbs = 40 + Math.floor(Math.random() * 20);
    calories += carbs * 4;
  } else {
    carbs = 10 + Math.floor(Math.random() * 15);
    calories += carbs * 4;
  }
  
  if (isProteinRich) {
    protein = 20 + Math.floor(Math.random() * 15);
    calories += protein * 4;
  } else {
    protein = 5 + Math.floor(Math.random() * 10);
    calories += protein * 4;
  }
  
  if (isVegetable) {
    fiber = 5 + Math.floor(Math.random() * 5);
    carbs += 5;
    calories += 50;
  }
  
  if (isFruit) {
    sugar = 10 + Math.floor(Math.random() * 10);
    carbs += sugar;
    calories += sugar * 4;
  }
  
  if (isDairy) {
    fat = 5 + Math.floor(Math.random() * 10);
    calories += fat * 9;
  } else {
    fat = 3 + Math.floor(Math.random() * 7);
    calories += fat * 9;
  }
  
  // Determine glucose impact
  let expectedImpact: 'low' | 'moderate' | 'high';
  let riseSpeed: 'slow' | 'moderate' | 'fast';
  
  if (isHighCarb && !isProteinRich && !isVegetable) {
    expectedImpact = 'high';
    riseSpeed = 'fast';
  } else if (isHighCarb && (isProteinRich || isVegetable)) {
    expectedImpact = 'moderate';
    riseSpeed = 'moderate';
  } else {
    expectedImpact = 'low';
    riseSpeed = 'slow';
  }
  
  // Determine if diabetes-friendly
  const diabetesFriendly = !isHighCarb || (isHighCarb && (isProteinRich && isVegetable));
  
  // Generate recommendations
  const recommendations = [];
  
  if (isHighCarb) {
    recommendations.push("Consider reducing portion size to minimize glucose impact.");
    if (!isProteinRich) {
      recommendations.push("Add a source of protein to slow down carbohydrate absorption.");
    }
    if (!isVegetable) {
      recommendations.push("Include non-starchy vegetables to add fiber and slow glucose absorption.");
    }
  }
  
  if (diabetesType === 'type1' && options?.insulinSensitive) {
    recommendations.push("Remember to adjust insulin dosage based on total carbohydrate content.");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("This meal appears well-balanced for blood glucose management.");
  }
  
  // Generate alternatives if high-carb
  const alternatives = isHighCarb ? [
    "Replace white rice with cauliflower rice for fewer carbs",
    "Use zucchini noodles instead of pasta",
    "Try a lettuce wrap instead of bread"
  ] : undefined;
  
  return {
    description: foodDescription,
    nutritionalInfo: {
      calories,
      carbs,
      protein,
      fat,
      fiber,
      sugar
    },
    glucoseImpact: {
      expectedImpact,
      riseSpeed,
      explanation: getImpactExplanation(expectedImpact, riseSpeed, diabetesType)
    },
    diabetesFriendly,
    recommendations,
    alternatives
  };
}

function getImpactExplanation(impact: 'low' | 'moderate' | 'high', speed: 'slow' | 'moderate' | 'fast', diabetesType?: string | null): string {
  if (impact === 'high') {
    return `This food is likely to cause a significant rise in blood glucose levels at a ${speed} rate. ${diabetesType === 'type1' ? 'Consider adjusting insulin accordingly.' : 'Consider pairing with protein or fiber to moderate the impact.'}`;
  } else if (impact === 'moderate') {
    return `This food is expected to cause a moderate rise in blood glucose levels at a ${speed} rate. The combination of ingredients helps balance the impact.`;
  } else {
    return `This food should have minimal impact on your blood glucose levels and will be absorbed at a ${speed} rate.`;
  }
}

/**
 * Generates meal recommendations based on user preferences and health data
 */
export async function generateMealRecommendations(
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  userProfile: {
    diabetesType?: 'type1' | 'type2' | 'gestational' | 'prediabetes';
    currentGlucoseLevel?: number;
    recentMeals?: FoodEntry[];
    dietaryRestrictions?: string[];
    preferredCuisines?: string[];
    calorieTarget?: number;
    carbTarget?: number;
  }
): Promise<{
  recommendations: Array<{
    mealName: string;
    description: string;
    nutritionalInfo: {
      calories: number;
      carbs: number;
      protein: number;
      fat: number;
    };
    recipe?: string;
    diabetesFriendly: boolean;
  }>;
}> {
  try {
    // Build context for personalized recommendations
    let contextPrompt = '';
    
    if (userProfile.diabetesType) {
      contextPrompt += `The user has ${userProfile.diabetesType} diabetes. `;
    } else {
      contextPrompt += 'The user has diabetes. ';
    }
    
    if (userProfile.currentGlucoseLevel) {
      contextPrompt += `Current glucose level: ${userProfile.currentGlucoseLevel} mg/dL. `;
    }
    
    if (userProfile.dietaryRestrictions && userProfile.dietaryRestrictions.length > 0) {
      contextPrompt += `Dietary restrictions: ${userProfile.dietaryRestrictions.join(', ')}. `;
    }
    
    if (userProfile.preferredCuisines && userProfile.preferredCuisines.length > 0) {
      contextPrompt += `Preferred cuisines: ${userProfile.preferredCuisines.join(', ')}. `;
    }
    
    if (userProfile.calorieTarget) {
      contextPrompt += `Target calories per meal: approximately ${Math.round(userProfile.calorieTarget / 3)} calories. `;
    }
    
    if (userProfile.carbTarget) {
      contextPrompt += `Target carbs per meal: approximately ${Math.round(userProfile.carbTarget / 3)}g. `;
    }
    
    // Construct the prompt for Gemini
    const prompt = `
    ${contextPrompt}
    
    Generate 3 diabetes-friendly ${mealType} recommendations that:
    1. Have a low to moderate glycemic index
    2. Provide balanced nutrition
    3. Are satisfying and tasty
    
    For each recommendation, include:
    - Name of the meal
    - Brief description
    - Estimated nutritional information (calories, carbs, protein, fat)
    - Whether it's diabetes-friendly
    - A simple recipe or preparation instructions
    
    Return the response as a structured JSON object with the following format:
    {
      "recommendations": [
        {
          "mealName": "Name of meal 1",
          "description": "Brief description",
          "nutritionalInfo": {
            "calories": number,
            "carbs": number,
            "protein": number,
            "fat": number
          },
          "recipe": "Simple recipe or preparation instructions",
          "diabetesFriendly": boolean
        },
        // ... more recommendations
      ]
    }
    `;
    
    // Call Gemini API
    const response = await ai.generate({
      prompt: prompt
    });
    
    const responseText = response.text;
    
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from the AI response');
    }
    
    const resultJson = JSON.parse(jsonMatch[0]);
    
    // Validate and return the result
    return {
      recommendations: Array.isArray(resultJson.recommendations) 
        ? resultJson.recommendations.map((rec: any) => ({
            mealName: rec.mealName || 'Meal recommendation',
            description: rec.description || '',
            nutritionalInfo: {
              calories: rec.nutritionalInfo?.calories || 0,
              carbs: rec.nutritionalInfo?.carbs || 0,
              protein: rec.nutritionalInfo?.protein || 0,
              fat: rec.nutritionalInfo?.fat || 0
            },
            recipe: rec.recipe || undefined,
            diabetesFriendly: rec.diabetesFriendly !== undefined ? rec.diabetesFriendly : true
          }))
        : []
    };
  } catch (error) {
    console.error('Error generating meal recommendations:', error);
    // Return a fallback response
    return {
      recommendations: []
    };
  }
} 