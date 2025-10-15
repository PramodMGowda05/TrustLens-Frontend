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
  language: z.string().describe('The language of the review.'),
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
            predicted_label: z.string(),
            trust_score: z.number(),
        })
    })},
    prompt: `You are an AI that explains the output of a machine learning model that detects fake reviews.
The model analyzed a review and produced a 'predicted_label' ('genuine' or 'fake') and a 'trust_score' (0.0 to 1.0).

Review Text:
"{{{reviewText}}}"

Model Prediction:
- Label: {{{modelOutput.predicted_label}}}
- Trust Score: {{{modelOutput.trust_score}}}

Based on the model's output, provide a brief, easy-to-understand explanation for why the review received this classification. If the score is high (e.g., > 0.7), focus on signs of authenticity. If the score is low (e.g., < 0.4), focus on potential red flags for fake reviews. For mid-range scores, explain the ambiguity.`
});


const generateRealTimeTrustScoreFlow = ai.defineFlow(
  {
    name: 'generateRealTimeTrustScoreFlow',
    inputSchema: GenerateRealTimeTrustScoreInputSchema,
    outputSchema: GenerateRealTimeTrustScoreOutputSchema,
  },
  async (input) => {
    // 1. Call the external Python ML service
    const mlServiceUrl = 'http://127.0.0.1:5001/predict';
    let modelOutput: { predicted_label: 'genuine' | 'fake', trust_score: number };
    
    try {
        const response = await fetch(mlServiceUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input.reviewText }),
        });

        if (!response.ok) {
            throw new Error(`ML service responded with status: ${response.status}`);
        }
        const data = await response.json();
        modelOutput = {
            predicted_label: data.predicted_label,
            trust_score: data.trust_score,
        };

    } catch(err: any) {
        console.error("Failed to connect to Python ML service:", err);
        // Fallback or error handling
        throw new Error("The review analysis service is currently unavailable. Please try again later.");
    }
    
    // 2. Use a Genkit LLM to generate the explanation based on the model's output
    const { output: explanation } = await explanationPrompt({
        reviewText: input.reviewText,
        modelOutput: modelOutput
    });

    // 3. Combine results and return
    return {
      trustScore: modelOutput.trust_score,
      predictedLabel: modelOutput.predicted_label,
      explanation: explanation ? explanation.text : "Could not generate an explanation.",
    };
  }
);
