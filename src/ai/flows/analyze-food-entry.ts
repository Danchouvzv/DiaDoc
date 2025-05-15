// 'use server'

/**
 * @fileOverview Analyzes a food entry description to estimate its nutritional content.
 *
 * - analyzeFoodEntry - A function that handles the food entry analysis process.
 * - AnalyzeFoodEntryInput - The input type for the analyzeFoodEntry function.
 * - AnalyzeFoodEntryOutput - The return type for the analyzeFoodEntry function.
 */

'use server';

import { definePrompt, defineFlow, executePrompt } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeFoodEntryInputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the food entry, including ingredients and preparation methods.'),
});
export type AnalyzeFoodEntryInput = z.infer<typeof AnalyzeFoodEntryInputSchema>;

const AnalyzeFoodEntryOutputSchema = z.object({
  calories: z.number().describe('Estimated total calories in the food entry.'),
  protein: z.number().describe('Estimated grams of protein in the food entry.'),
  carbs: z.number().describe('Estimated grams of carbohydrates in the food entry.'),
  fat: z.number().describe('Estimated grams of fat in the food entry.'),
  recommendations: z.string().optional().describe('Optional recommendations based on the food entry analysis.'),
});
export type AnalyzeFoodEntryOutput = z.infer<typeof AnalyzeFoodEntryOutputSchema>;

// Main entry point function
export async function analyzeFoodEntry(input: AnalyzeFoodEntryInput): Promise<AnalyzeFoodEntryOutput> {
  // Define the prompt
  const prompt = await definePrompt({
    name: 'analyzeFoodEntryPrompt',
    input: {schema: AnalyzeFoodEntryInputSchema},
    output: {schema: AnalyzeFoodEntryOutputSchema},
    prompt: `Analyze the following food entry description and estimate its nutritional content (calories, protein, carbs, fat).
\nFood Entry Description: {{{description}}}
\nProvide the estimated calories, protein, carbs, and fat content.  If possible, also provide brief recommendations for improving the meal's nutritional balance.
\nEnsure that the output is a valid JSON object. Do not include any surrounding text or explanations.`,
  });
  
  // Execute the prompt with the input
  try {
    const output = await executePrompt(prompt, input);
    return output || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      recommendations: "Unable to analyze food entry"
    };
  } catch (error) {
    console.error("Error analyzing food entry:", error);
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      recommendations: "Error analyzing food entry"
    };
  }
}
