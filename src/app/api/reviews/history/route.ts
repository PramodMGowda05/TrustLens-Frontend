import { NextResponse } from 'next/server';
import pool from '@/backend/lib/db';
import { getUserFromToken } from '@/backend/lib/get-user-from-token';

export async function GET(req: Request) {
  const user = await getUserFromToken();

  if (!user) {
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT 
         id,
         trust_score as trustScore,
         predicted_label as predictedLabel,
         explanation,
         product_or_service as productOrService,
         platform,
         review_text as reviewText,
         created_at as timestamp 
       FROM reviews 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user.userId]
    );
    
    return NextResponse.json(rows, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch review history:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
