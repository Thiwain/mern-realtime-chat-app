import { Request, Response, NextFunction } from "express";
import {loginValidation} from "../../validation/loginValidation";
import bcrypt from 'bcrypt';
import { CookieOptions } from "express";
import requestIp from 'request-ip';
import UserModel from "../../models/userModel";
import {generateAccessToken, generateRefreshToken} from "../../utils/jwtUtils";

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password, rememberMe } = req.body;
        const { error } = loginValidation.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                statusType: 'error',
                message: error.message
            });
        }

    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
        return res.status(401).json({
            status: 401,
            statusType: 'error',
            message: 'Invalid email or password',
        });
    }

        const passwordIsMatch = await bcrypt.compare(password, foundUser.password);
        if (!passwordIsMatch) {
            return res.status(401).json({
                status: 401,
                statusType: 'error',
                message: 'Invalid email or password'
            });
        }

        if (!foundUser.active) {
            return res.status(403).json({
                status: 403,
                statusType: 'error',
                message: 'Account is deactivated',
            });
        }

        const userPayloadForAccess:any = {
            userId: foundUser._id,
            email: foundUser.email,
        };

        const userPayloadForRefresh:any = { userId: foundUser._id };

        const accessToken = await generateAccessToken(userPayloadForAccess);
        const refreshToken = await generateRefreshToken(userPayloadForRefresh);

        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
        };

        if (req.body.rememberMe) {
            res.cookie("rememberMe", true, { httpOnly: true, maxAge: 604800000, secure: true });
        }

        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.cookie('accessToken', accessToken.token, cookieOptions);

        const ip = requestIp.getClientIp(req);
        const device = `${req.useragent?.browser}-${req.useragent?.os}`;

        res.cookie('storedIp', ip, { httpOnly: true });
        res.cookie('storedDevice', device, { httpOnly: true });

        return res.status(200).json({
            status: 200,
            statusType: 'success',
            message: 'Login successful',
        });
    } catch (err: any) {
        console.error(err);
    }
};
