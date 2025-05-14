'use server';

/**
 * @fileOverview An AI agent that recognizes food items in a photo.
 *
 * - recognizeFoodPhoto - A function that handles the food recognition process.
 * - RecognizeFoodPhotoInput - The input type for the recognizeFoodPhoto function.
 * - RecognizeFoodPhotoOutput - The return type for the recognizeFoodPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizeFoodPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecognizeFoodPhotoInput = z.infer<typeof RecognizeFoodPhotoInputSchema>;

const RecognizeFoodPhotoOutputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of ingredients recognized in the photo.'),
});
export type RecognizeFoodPhotoOutput = z.infer<typeof RecognizeFoodPhotoOutputSchema>;

export async function recognizeFoodPhoto(input: RecognizeFoodPhotoInput): Promise<RecognizeFoodPhotoOutput> {
  return recognizeFoodPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recognizeFoodPhotoPrompt',
  input: {schema: RecognizeFoodPhotoInputSchema},
  output: {schema: RecognizeFoodPhotoOutputSchema},
  prompt: `You are an expert in food recognition.  You will be provided a photo of a meal, and you will respond with a list of ingredients.

Use the following photo to determine the ingredients:

Photo: {{media url=photoDataUri}}`,
});

const recognizeFoodPhotoFlow = ai.defineFlow(
  {
    name: 'recognizeFoodPhotoFlow',
    inputSchema: RecognizeFoodPhotoInputSchema,
    outputSchema: RecognizeFoodPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
