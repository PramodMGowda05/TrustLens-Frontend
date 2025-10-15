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
import pool from '@/backend/lib/db';

const GenerateRealTimeTrustScoreInputSchema = z.object({
  reviewText: z.string().describe('The text content of the review.'),
  productOrService: z.string().describe('The product or service being reviewed.'),
  platform: z.string().describe('The platform where the review was submitted (e.g., Amazon, Yelp).'),
  language: z.string().describe('The language of the review.'),
  userId: z.number().describe('The ID of the user submitting the review.'),
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
    const { output: explanationText } = await explanationPrompt({
        reviewText: input.reviewText,
        modelOutput: modelOutput
    });
    
    const explanation = explanationText?.text ?? "Could not generate an explanation.";

    const resultToSave = {
        userId: input.userId,
        trustScore: modelOutput.trust_score,
        predictedLabel: modelOutput.predicted_label,
        explanation: explanation,
        productOrService: input.productOrService,
        platform: input.platform,
        reviewText: input.reviewText,
    };

    // 3. Save the result to the database
    let connection;
    try {
        connection = await pool.getConnection();
        const [dbResult] = await connection.query(
            'INSERT INTO reviews (user_id, trust_score, predicted_label, explanation, product_or_service, platform, review_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [resultToSave.userId, resultToSave.trustScore, resultToSave.predictedLabel, resultToSave.explanation, resultToSave.productOrService, resultToSave.platform, resultToSave.reviewText]
        );
    } catch (dbError: any) {
        console.error('Database error while saving review:', dbError);
        throw new Error('Failed to save the analysis result.');
    } finally {
        if (connection) {
            connection.release();
        }
    }

    // 4. Combine results and return
    return {
      trustScore: modelOutput.trust_score,
      predictedLabel: modelOutput.predicted_label,
      explanation: explanation,
    };
  }
);
