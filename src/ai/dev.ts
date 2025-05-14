import { config } from 'dotenv';
config();

import '@/ai/flows/provide-dietary-recommendations.ts';
import '@/ai/flows/recognize-food-photo.ts';
import '@/ai/flows/analyze-food-entry.ts';