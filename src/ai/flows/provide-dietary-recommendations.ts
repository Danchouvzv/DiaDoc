'use server';
/**
 * @fileOverview An AI agent that provides personalized dietary recommendations.
 *
 * - provideDietaryRecommendations - A function that generates dietary recommendations based on food intake and activity levels.
 * - ProvideDietaryRecommendationsInput - The input type for the provideDietaryRecommendations function.
 * - ProvideDietaryRecommendationsOutput - The return type for the provideDietaryRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideDietaryRecommendationsInputSchema = z.object({
  foodIntake: z
    .string()
    .describe('A description of the user food intake for the day.'),
  activityLevels: z
    .string()
    .describe('A description of the user activity levels for the day.'),
  userGoals: z
    .string()
    .describe('A description of the user health goals.'),
});
export type ProvideDietaryRecommendationsInput = z.infer<
  typeof ProvideDietaryRecommendationsInputSchema
>;

const ProvideDietaryRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('Dietary recommendations for the user.'),
});
export type ProvideDietaryRecommendationsOutput = z.infer<
  typeof ProvideDietaryRecommendationsOutputSchema
>;

export async function provideDietaryRecommendations(
  input: ProvideDietaryRecommendationsInput
): Promise<ProvideDietaryRecommendationsOutput> {
  return provideDietaryRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideDietaryRecommendationsPrompt',
  input: {schema: ProvideDietaryRecommendationsInputSchema},
  output: {schema: ProvideDietaryRecommendationsOutputSchema},
  prompt: `You are a registered dietician who provides personalized dietary recommendations.

  Based on the user's food intake, activity levels, and health goals, provide dietary recommendations.

  Food Intake: {{{foodIntake}}}
  Activity Levels: {{{activityLevels}}}
  User Goals: {{{userGoals}}}

  Provide specific and actionable recommendations to help the user achieve their goals.
  Please provide the recommendations in markdown format.
  `,
});

const provideDietaryRecommendationsFlow = ai.defineFlow(
  {
    name: 'provideDietaryRecommendationsFlow',
    inputSchema: ProvideDietaryRecommendationsInputSchema,
    outputSchema: ProvideDietaryRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
