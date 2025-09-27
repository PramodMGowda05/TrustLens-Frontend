"use server";

import { generateRealTimeTrustScore, type GenerateRealTimeTrustScoreInput } from '@/ai/flows/generate-real-time-trust-score';

export async function analyzeReview(data: GenerateRealTimeTrustScoreInput) {
    try {
        const result = await generateRealTimeTrustScore(data);
        return { success: true, data: { ...result, timestamp: new Date().toISOString(), ...data } };
    } catch (error) {
        console.error("Error analyzing review:", error);
        return { success: false, error: 'Failed to analyze review due to an internal error.' };
    }
}
