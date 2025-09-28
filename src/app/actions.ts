"use server";

import { generateRealTimeTrustScore, type GenerateRealTimeTrustScoreInput } from '@/ai/flows/generate-real-time-trust-score';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/get-user-from-token';

export async function analyzeReview(data: GenerateRealTimeTrustScoreInput) {
    try {
        const user = await getUserFromToken();
        if (!user) {
            return { success: false, error: 'Authentication required.' };
        }

        const result = await generateRealTimeTrustScore(data);

        // Save to database
        const connection = await pool.getConnection();
        const [dbResult] = await connection.query(
            'INSERT INTO reviews (user_id, trust_score, predicted_label, explanation, product_or_service, platform, review_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user.userId, result.trustScore, result.predictedLabel, result.explanation, data.productOrService, data.platform, data.reviewText]
        );
        connection.release();
        
        const insertResult = dbResult as any;

        return { success: true, data: { ...result, id: insertResult.insertId, timestamp: new Date().toISOString(), ...data } };
    } catch (error) {
        console.error("Error analyzing review:", error);
        return { success: false, error: 'Failed to analyze review due to an internal error.' };
    }
}
