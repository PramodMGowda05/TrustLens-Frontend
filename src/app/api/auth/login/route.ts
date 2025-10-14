import { NextResponse } from 'next/server';
import pool from '@/backend/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  }
  
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in the environment variables.');
    return NextResponse.json({ message: 'Authentication configuration error.' }, { status: 500 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ message: 'Could not connect to the database.' }, { status: 500 });
  }

  try {
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const user: any = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    const response = NextResponse.json({ message: 'Login successful.' }, { status: 200 });
    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error) {
    console.error('Login processing error:', error);
    return NextResponse.json({ message: 'An internal server error occurred during login.' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
