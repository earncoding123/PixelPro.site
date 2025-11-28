'use server';
/**
 * @fileOverview An AI agent for changing image backgrounds.
 *
 * - changeBackground - A function that handles the background change process.
 * - ChangeBackgroundInput - The input type for the changeBackground function.
 * - ChangeBackgroundOutput - The return type for the changeBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {MediaPart} from 'genkit/content';

const ChangeBackgroundInputSchema = z.object({
  file: z
    .string()
    .describe(
      "The foreground image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  background: z.string().describe('The background image or color.'),
  background_type: z.enum(['image', 'color']).describe('The type of background: image or color.'),
});
export type ChangeBackgroundInput = z.infer<typeof ChangeBackgroundInputSchema>;

const ChangeBackgroundOutputSchema = z.object({
  modifiedImage: z.string().describe('The modified image with the new background as a data URI.'),
});
export type ChangeBackgroundOutput = z.infer<typeof ChangeBackgroundOutputSchema>;

export async function changeBackground(input: ChangeBackgroundInput): Promise<ChangeBackgroundOutput> {
  return changeBackgroundFlow(input);
}

const changeBackgroundFlow = ai.defineFlow(
  {
    name: 'changeBackgroundFlow',
    inputSchema: ChangeBackgroundInputSchema,
    outputSchema: ChangeBackgroundOutputSchema,
  },
  async (input) => {
    const prompt: (MediaPart | { text: string })[] = [
      { media: { url: input.file } },
    ];

    if (input.background_type === 'image') {
      prompt.push({ media: { url: input.background } });
      prompt.push({ text: 'Change the background of the first image to be the second image.' });
    } else {
      prompt.push({ text: `Change the background of the image to a solid color: ${input.background}.` });
    }

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('The AI model did not return an image.');
    }
    
    return { modifiedImage: media.url };
  }
);
