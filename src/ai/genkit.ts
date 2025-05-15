'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Use environment variable for the API key
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn('GEMINI_API_KEY is not defined in environment variables. AI features will not work.');
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey: geminiApiKey || 'dummy-key', // Fallback to a dummy key when not available
  })],
  model: 'googleai/gemini-2.0-flash',
});

export default ai;
