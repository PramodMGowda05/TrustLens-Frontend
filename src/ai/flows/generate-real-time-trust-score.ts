'use server';
/**
 * @fileOverview Generates a real-time trust score for a submitted review using AI.
 *
 * - generateRealTimeTrustScore - A function that generates a trust score for a review.
 * - GenerateRealTimeTrustScoreInput - The input type for the generateRealTimeTrustScore function.
 * - GenerateRealTimeTrustScoreOutput - The return type for the generateRealTimeTrustScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRealTimeTrustScoreInputSchema = z.object({
  reviewText: z.string().describe('The text content of the review.'),
  productOrService: z.string().describe('The product or service being reviewed.'),
  platform: z.string().describe('The platform where the review was submitted (e.g., Amazon, Yelp).'),
  language: z.string().describe('The language of the review.'),
});
export type GenerateRealTimeTrustScoreInput = z.infer<typeof GenerateRealTimeTrustScoreInputSchema>;

const GenerateRealTimeTrustScoreOutputSchema = z.object({
  trustScore: z.number().describe('A score between 0 and 1 indicating the trustworthiness of the review, where 0 is least trustworthy and 1 is most trustworthy.'),
  predictedLabel: z.enum(['genuine', 'fake']).describe('The predicted label for the review (genuine or fake).'),
  explanation: z.string().optional().describe('An explanation of why the review was classified as genuine or fake.'),
});
export type GenerateRealTimeTrustScoreOutput = z.infer<typeof GenerateRealTimeTrustScoreOutputSchema>;

export async function generateRealTimeTrustScore(input: GenerateRealTimeTrustScoreInput): Promise<GenerateRealTimeTrustScoreOutput> {
  return generateRealTimeTrustScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRealTimeTrustScorePrompt',
  input: {schema: GenerateRealTimeTrustScoreInputSchema},
  output: {schema: GenerateRealTimeTrustScoreOutputSchema},
  prompt: `You are an AI expert in detecting fake reviews. Analyze the following review and determine its trustworthiness.

Review Text: {{{reviewText}}}
Product/Service: {{{productOrService}}}
Platform: {{{platform}}}
Language: {{{language}}}

Based on your analysis, provide a trust score between 0 and 1 (0 being least trustworthy, 1 being most trustworthy), predict whether the review is genuine or fake, and provide a brief explanation for your classification.

Ensure that the trustScore is a number between 0 and 1. Ensure predictedLabel is either "genuine" or "fake". The explanation should briefly describe the reasoning behind the classification.

Output should be formatted as JSON.`,
});

const generateRealTimeTrustScoreFlow = ai.defineFlow(
  {
    name: 'generateRealTimeTrustScoreFlow',
    inputSchema: GenerateRealTimeTrustScoreInputSchema,
    outputSchema: GenerateRealTimeTrustScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
