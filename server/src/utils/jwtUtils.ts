import 'dotenv/config';
import jwt from 'jsonwebtoken';

export interface UserPayload {
    userId: string;
    email: string;
}
const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret';
const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';


export const generateAccessToken = (user: UserPayload): { token: string } => {
    if (!user || !user.userId || !user.email) {
        throw new Error('User object is missing required fields');
    }
    try {
        const token = jwt.sign(
            {
                userId: user.userId,
                email: user.email,
            },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
        );
        return { token };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

interface refreshTokenPayload {
    userId: string;
}

export const generateRefreshToken = (user: refreshTokenPayload) => {
    if (!user || !user.userId) {
        throw new Error('User object is missing required fields');
    }
    try {
        return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '4h' });
    } catch (error: any) {
        throw new Error(error.message);
    }
};
