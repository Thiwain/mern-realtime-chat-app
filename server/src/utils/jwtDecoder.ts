import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { generateAccessToken } from './jwtUtils';
import UserModel, {UserItem} from '../models/userModel';

export const jwtDecoder = async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        return res.status(403).json({
            status: res.statusCode,
            statusType: 'error',
            message: 'Access token is missing'
        })
    }
    if (!refreshToken) {
        return res.status(403).json({
            status: res.statusCode,
            statusType: 'error',
            message: 'Refresh token is missing'
        })
    }

    try {
        const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || "");
        return user;
    } catch (err: any) {
        if (err.name === 'TokenExpiredError' && refreshToken) {
            try {
                const decodedRefreshToken: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "");

                const { email } = await UserModel.findOne({
                    _id: { $eq: decodedRefreshToken.userId },
                    active: { $ne: false }
                }) as UserItem;

                const newAccessToken = generateAccessToken({ userId: decodedRefreshToken.userId, email });

                res.cookie('accessToken', newAccessToken.token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 15 * 60 * 1000,
                });

                return jwt.verify(newAccessToken.token, process.env.ACCESS_TOKEN_SECRET || "");
            } catch (refreshErr) {
                console.error('Refresh token error:', refreshErr);
                return null;
            }
        }

        return null;
    }
};
