import { NextResponse } from 'next/server';
import pool from '@/backend/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Name, email, and password are required.' }, { status: 400 });
  }
  
  let connection;
  try {
    connection = await pool.getConnection();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ message: 'Could not connect to the database.' }, { status: 500 });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    
    return NextResponse.json({ message: 'User created successfully.' }, { status: 201 });

  } catch (error) {
    console.error('Signup processing error:', error);
    return NextResponse.json({ message: 'An internal server error occurred during signup.' }, { status: 500 });
  } finally {
      if(connection) {
          connection.release();
      }
  }
}
