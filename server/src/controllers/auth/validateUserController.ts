import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config"
import UserModel from "../../models/userModel";

const validateUserController = async (req: Request | any, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET');

        const foundUser = await UserModel.findOne({ _id: decoded.userId });
        if (!foundUser) {
            return res.status(401).json({
                status: res.statusCode,
                statusType: 'error',
                message: 'Unauthorized User Error',
            });
        }

        res.status(200).json({
            status: res.statusCode,
            message: 'Authenticated',
            data: {
                userId: foundUser._id,
                email: foundUser.email
            }
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

export default validateUserController;