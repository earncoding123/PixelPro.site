'use server';
/**
 * @fileOverview An AI agent for compressing images.
 * THIS FLOW IS DEPRECATED. Compression is now handled by a dedicated API proxy.
 *
 * - compressImage - A function that handles the image compression process.
 * - CompressImageInput - The input type for the compressImage function.
 * - CompressImageOutput - The return type for the compressImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompressImageInputSchema = z.object({
  file: z
    .string()
    .describe(
      "The image to compress, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  quality: z.number().describe('The quality of the compressed image (10-95).'),
});
export type CompressImageInput = z.infer<typeof CompressImageInputSchema>;

const CompressImageOutputSchema = z.object({
  compressedImage: z.string().describe('The compressed image as a data URI.'),
});
export type CompressImageOutput = z.infer<typeof CompressImageOutputSchema>;

export async function compressImage(input: CompressImageInput): Promise<CompressImageOutput> {
  return compressImageFlow(input);
}

const compressImageFlow = ai.defineFlow(
  {
    name: 'compressImageFlow',
    inputSchema: CompressImageInputSchema,
    outputSchema: CompressImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: input.file } },
        { text: `Compress this image to a quality of ${input.quality}.` },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('The AI model did not return an image.');
    }

    return { compressedImage: media.url };
  }
);
