import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import UserModel from "../models/userModel";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';

const authenticate = async (req: Request | any, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            status: res.statusCode,
            statusType: 'error',
            message: 'Refresh token is missing',
        });
    }

    if (!accessToken) {
        return res.status(401).json({
            status: res.statusCode,
            statusType: 'error',
            message: 'Access token is missing',
        });
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || "", async (err: any, user: any) => {
        if (err) {
            if (err.message === "jwt expired") {
                if (!refreshToken) {
                    return res.status(401).json({
                        status: res.statusCode,
                        statusType: 'error',
                        message: 'Refresh token is missing',
                    });
                }

                let decodedRefreshToken: any;
                try {
                    decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
                } catch (error: any) {
                    if (error instanceof TokenExpiredError) {
                        return res.status(401).json({
                            status: res.statusCode,
                            statusType: 'error',
                            message: 'Refresh token expired',
                        });
                    } else if (error instanceof JsonWebTokenError) {
                        return res.status(401).json({
                            status: 401,
                            statusType: 'error',
                            message: 'Invalid refresh token',
                        });
                    } else {
                        console.error(error);
                        return res.status(500).json({
                            status: res.statusCode,
                            statusType: 'error',
                            message: 'Internal Server Error',
                        });
                    }
                }

                const { userId } = decodedRefreshToken;
                if (!userId) {
                    return res.status(400).json({
                        status: res.statusCode,
                        statusType: 'error',
                        message: 'Invalid Refresh Token',
                    });
                }

                const user = await UserModel.findOne({ _id: userId });
                if (!user) {
                    return res.status(404).json({
                        status: res.statusCode,
                        statusType: 'error',
                        message: 'User not found',
                    });
                }

                const payload: any = { userId: user._id, email: user.email };
                const refreshTokenPayload: any = { userId: user._id };

                const newAccessToken = generateAccessToken(payload);
                const newRefreshToken = generateRefreshToken(refreshTokenPayload);

                const cookieOptions: CookieOptions = {
                    httpOnly: true,
                    secure: true,
                };

                const rememberMe = req.cookies.rememberMe || null;

                if (rememberMe) cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;

                await res.cookie('accessToken', newAccessToken.token, cookieOptions);
                await res.cookie('refreshToken', newRefreshToken, cookieOptions);

                req.user = payload;
                return next();

            } else {
                return res.status(403).json({
                    status: res.statusCode,
                    statusType: 'error',
                    message: err.message,
                });
            }
        }

        req.user = user;
        return next();
    });
};

export default authenticate;
