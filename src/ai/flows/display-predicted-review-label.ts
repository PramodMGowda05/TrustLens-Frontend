'use server';
/**
 * @fileOverview An AI agent that predicts whether a review is genuine or fake and provides a trust score.
 *
 * - predictReviewLabel - A function that handles the review label prediction process.
 * - PredictReviewLabelInput - The input type for the predictReviewLabel function.
 * - PredictReviewLabelOutput - The return type for the predictReviewLabel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictReviewLabelInputSchema = z.object({
  reviewText: z.string().describe('The text content of the review.'),
});
export type PredictReviewLabelInput = z.infer<typeof PredictReviewLabelInputSchema>;

const PredictReviewLabelOutputSchema = z.object({
  trustScore: z.number().describe('A score indicating the trustworthiness of the review (0-1).'),
  predictedLabel: z.enum(['genuine', 'fake']).describe('The predicted label for the review (genuine or fake).'),
});
export type PredictReviewLabelOutput = z.infer<typeof PredictReviewLabelOutputSchema>;

export async function predictReviewLabel(input: PredictReviewLabelInput): Promise<PredictReviewLabelOutput> {
  return predictReviewLabelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictReviewLabelPrompt',
  input: {schema: PredictReviewLabelInputSchema},
  output: {schema: PredictReviewLabelOutputSchema},
  prompt: `You are an AI that analyzes customer reviews and predicts whether they are genuine or fake.\n\nAnalyze the following review text and provide a trust score (0-1) and a predicted label (genuine or fake).\n\nReview Text: {{{reviewText}}}\n\n`,
});

const predictReviewLabelFlow = ai.defineFlow(
  {
    name: 'predictReviewLabelFlow',
    inputSchema: PredictReviewLabelInputSchema,
    outputSchema: PredictReviewLabelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
