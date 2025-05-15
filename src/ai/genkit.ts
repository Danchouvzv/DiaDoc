'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { z } from 'genkit';

// Use environment variable for the API key
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn('GEMINI_API_KEY is not defined in environment variables. AI features will not work.');
}

const ai = genkit({
  plugins: [googleAI({
    apiKey: geminiApiKey || 'dummy-key', // Fallback to a dummy key when not available
  })],
  model: 'googleai/gemini-2.0-flash',
});

// Export async wrapper functions for AI operations
export async function generateAIResponse(prompt: string) {
  try {
    const response = await ai.generate({
      prompt: prompt,
    });
    return response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

// Helper function for defining prompts
export async function definePrompt(options: {
  name: string;
  input: { schema: z.ZodType<any> };
  output: { schema: z.ZodType<any> };
  prompt: string;
}) {
  return ai.definePrompt(options);
}

// Helper function for defining flows
export async function defineFlow<I, O>(
  options: {
    name: string;
    inputSchema: z.ZodType<I>;
    outputSchema: z.ZodType<O>;
  },
  handler: (input: I) => Promise<O>
) {
  return ai.defineFlow(options, handler);
}

// Helper for executing a prompt
export async function executePrompt(promptFn: any, input: any) {
  try {
    const { output } = await promptFn(input);
    return output;
  } catch (error) {
    console.error('Error executing prompt:', error);
    throw error;
  }
}

// Add more async function exports as needed for different AI operations
