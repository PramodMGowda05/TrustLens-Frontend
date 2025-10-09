import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

type UserPayload = {
    userId: number;
    email: string;
    name: string;
    iat: number;
    exp: number;
};

export async function getUserFromToken() {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
        return decoded;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
