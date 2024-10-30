import { Request, Response } from 'express';

export const logoutController = (req: Request, res: Response) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        res.clearCookie('rememberMe', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        res.clearCookie('storedDevice', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        res.clearCookie('storedIp', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
