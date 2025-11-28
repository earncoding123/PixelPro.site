
'use server';
/**
 * @fileOverview An AI agent for manually enhancing images.
 * THIS FLOW IS DEPRECATED. Image enhancement is now handled on the client-side.
 *
 * - enhanceImage - A function that handles the image enhancement process.
 * - EnhanceImageInput - The input type for the enhanceImage function.
 * - EnhanceImageOutput - The return type for the enhanceImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceImageInputSchema = z.object({
  file: z
    .string()
    .describe(
      "The image to enhance, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  brightness: z.number().describe('The brightness level (0-2).'),
  contrast: z.number().describe('The contrast level (0-2).'),
  saturation: z.number().describe('The saturation level (0-2).'),
  sharpness: z.number().describe('The sharpness level (0-2).'),
});
export type EnhanceImageInput = z.infer<typeof EnhanceImageInputSchema>;

const EnhanceImageOutputSchema = z.object({
  enhancedImage: z.string().describe('The enhanced image as a data URI.'),
});
export type EnhanceImageOutput = z.infer<typeof EnhanceImageOutputSchema>;

export async function enhanceImage(input: EnhanceImageInput): Promise<EnhanceImageOutput> {
  throw new Error("This AI flow is deprecated. Image enhancement is now handled on the client-side.");
}

const enhanceImageFlow = ai.defineFlow(
  {
    name: 'enhanceImageFlow',
    inputSchema: EnhanceImageInputSchema,
    outputSchema: EnhanceImageOutputSchema,
  },
  async (input) => {
    throw new Error("This AI flow is deprecated. Image enhancement is now handled on the client-side.");
  }
);
