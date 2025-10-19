'use server';
/**
 * @fileOverview Generates a real-time trust score for a submitted review by calling a Python ML service.
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
});
export type GenerateRealTimeTrustScoreInput = z.infer<typeof GenerateRealTimeTrustScoreInputSchema>;

const GenerateRealTimeTrustScoreOutputSchema = z.object({
  trustScore: z.number().describe('A score between 0 and 1 indicating the trustworthiness of the review, where 0 is least trustworthy and 1 is most trustworthy.'),
  predictedLabel: z.enum(['genuine', 'fake']).describe('The predicted label for the review (genuine or fake).'),
  explanation: z.string().describe('An explanation of why the review was classified as genuine or fake.'),
});
export type GenerateRealTimeTrustScoreOutput = z.infer<typeof GenerateRealTimeTrustScoreOutputSchema>;

export async function generateRealTimeTrustScore(input: GenerateRealTimeTrustScoreInput): Promise<GenerateRealTimeTrustScoreOutput> {
  return generateRealTimeTrustScoreFlow(input);
}


const explanationPrompt = ai.definePrompt({
    name: 'explanationPrompt',
    input: { schema: z.object({
        reviewText: z.string(),
        modelOutput: z.object({
            predictedLabel: z.string(),
            trustScore: z.number(),
        })
    })},
    output: { schema: GenerateRealTimeTrustScoreOutputSchema },
    prompt: `You are an AI that explains the output of a machine learning model that detects fake reviews.
The model analyzed a review and produced a 'predicted_label' ('genuine' or 'fake') and a 'trust_score' (0.0 to 1.0).

Review Text:
"{{{reviewText}}}"

Model Prediction:
- Label: {{{modelOutput.predictedLabel}}}
- Trust Score: {{{modelOutput.trustScore}}}

Based on the model's output, provide a brief, easy-to-understand explanation for why the review received this classification. If the score is high (e.g., > 0.7), focus on signs of authenticity. If the score is low (e.g., < 0.4), focus on potential red flags for fake reviews. For mid-range scores, explain the ambiguity.
Your final output should be a JSON object with 'trustScore', 'predictedLabel', and 'explanation' fields. The trustScore and predictedLabel should be the same as the input modelOutput.`
});


const generateRealTimeTrustScoreFlow = ai.defineFlow(
  {
    name: 'generateRealTimeTrustScoreFlow',
    inputSchema: GenerateRealTimeTrustScoreInputSchema,
    outputSchema: GenerateRealTimeTrustScoreOutputSchema,
  },
  async (input) => {
    
    // In a real scenario, you would call your model endpoint here.
    // For this demo, we'll use a simple Genkit prompt to simulate the analysis.
    const { output: analysis } = await ai.generate({
        prompt: `Analyze the following review and determine if it is 'genuine' or 'fake'. Provide a trust score between 0.0 and 1.0. Review: "${input.reviewText}"`,
        output: {
            schema: z.object({
                predictedLabel: z.enum(['genuine', 'fake']),
                trustScore: z.number().min(0).max(1),
            })
        }
    });

    if (!analysis) {
        throw new Error("The review analysis service is currently unavailable.");
    }
    
    // 2. Use a Genkit LLM to generate the explanation based on the model's output
    const { output: explanationResult } = await explanationPrompt({
        reviewText: input.reviewText,
        modelOutput: analysis
    });
    
    if (!explanationResult) {
        throw new Error("Could not generate an explanation.");
    }

    return explanationResult;
  }
);
