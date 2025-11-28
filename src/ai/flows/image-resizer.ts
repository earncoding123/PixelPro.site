
'use server';
/**
 * @fileOverview An AI agent for resizing images.
 * This flow is deprecated. Resizing is now handled on the client-side.
 *
 * - resizeImage - A function that handles the image resizing process.
 * - ResizeImageInput - The input type for the resizeImage function.
 * - ResizeImageOutput - The return type for the resizeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResizeImageInputSchema = z.object({
  file: z
    .string()
    .describe(
      "The image to resize, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  width: z.number().optional().describe('The new width of the image in pixels.'),
  height: z.number().optional().describe('The new height of the image in pixels.'),
});
export type ResizeImageInput = z.infer<typeof ResizeImageInputSchema>;

const ResizeImageOutputSchema = z.object({
  resizedImage: z.string().describe('The resized image as a data URI.'),
});
export type ResizeImageOutput = z.infer<typeof ResizeImageOutputSchema>;

export async function resizeImage(input: ResizeImageInput): Promise<ResizeImageOutput> {
  // This flow is deprecated.
  throw new Error("This AI flow is deprecated. Image resizing is now handled on the client-side.");
}

const resizeImageFlow = ai.defineFlow(
  {
    name: 'resizeImageFlow',
    inputSchema: ResizeImageInputSchema,
    outputSchema: ResizeImageOutputSchema,
  },
  async (input) => {
     throw new Error("This AI flow is deprecated. Image resizing is now handled on the client-side.");
  }
);
