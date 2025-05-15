import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { z } from 'zod';
import pRetry from 'p-retry';

// Validation schemas
const NutritionalInfoSchema = z.object({
  calories: z.number(),
  carbs: z.number(),
  protein: z.number(),
  fat: z.number(),
  fiber: z.number().optional(),
  sugar: z.number().optional(),
});

const FoodAnalysisSchema = z.object({
  nutritionalInfo: NutritionalInfoSchema,
  glucoseImpact: z.object({
    level: z.enum(['low', 'moderate', 'high']),
    speed: z.enum(['slow', 'moderate', 'fast']),
    explanation: z.string(),
  }),
  recommendations: z.array(z.string()),
  diabetesFriendly: z.boolean(),
});

const HealthInsightsSchema = z.object({
  insights: z.array(z.string()),
  recommendations: z.array(z.string()),
  riskFactors: z.array(z.string()),
});

export class GeminiService {
  private static instance: GeminiService;
  private genAI: GoogleGenerativeAI;
  private model: any;

  private constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async analyzeFoodEntry(foodDescription: string): Promise<z.infer<typeof FoodAnalysisSchema>> {
    const prompt = {
      text: `Analyze this food entry for a diabetic patient and provide a JSON response with the following structure:
      {
        "nutritionalInfo": {
          "calories": number,
          "carbs": number,
          "protein": number,
          "fat": number,
          "fiber": number (optional),
          "sugar": number (optional)
        },
        "glucoseImpact": {
          "level": "low" | "moderate" | "high",
          "speed": "slow" | "moderate" | "fast",
          "explanation": string
        },
        "recommendations": string[],
        "diabetesFriendly": boolean
      }

      Food entry: ${foodDescription}`,
      role: 'user'
    };

    return await pRetry(
      async () => {
        try {
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          // Extract JSON from the response
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('Invalid response format');
          }

          const parsedData = JSON.parse(jsonMatch[0]);
          return FoodAnalysisSchema.parse(parsedData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error('Invalid response format from AI');
          }
          throw error;
        }
      },
      {
        retries: 3,
        onFailedAttempt: error => {
          console.log(
            `Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`
          );
        },
      }
    );
  }

  public async generateHealthInsights(userData: {
    glucoseReadings: any[];
    foodEntries: any[];
    activityLogs: any[];
    wellbeingData: any[];
  }): Promise<z.infer<typeof HealthInsightsSchema>> {
    const prompt = {
      text: `Analyze this health data for a diabetic patient and provide a JSON response with the following structure:
      {
        "insights": string[],
        "recommendations": string[],
        "riskFactors": string[]
      }
      
      Data: ${JSON.stringify(userData, null, 2)}`,
      role: 'user'
    };

    return await pRetry(
      async () => {
        try {
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          // Extract JSON from the response
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('Invalid response format');
          }

          const parsedData = JSON.parse(jsonMatch[0]);
          return HealthInsightsSchema.parse(parsedData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error('Invalid response format from AI');
          }
          throw error;
        }
      },
      {
        retries: 3,
        onFailedAttempt: error => {
          console.log(
            `Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`
          );
        },
      }
    );
  }
} 