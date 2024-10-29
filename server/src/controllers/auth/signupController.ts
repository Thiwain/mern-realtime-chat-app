import { Request, Response, CookieOptions } from "express";
import { HashPassword } from "../../utils/passwordUtils";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwtUtils";
import UserModel from "../../models/userModel";
import requestIp from 'request-ip';
import { signupValidation } from "../../validation/signupValidation";

export const signUpController = async (req: Request, res: Response) => {
    try {
        const { error } = signupValidation.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                statusType: 'error',
                message: error.message,
            });
        }

        const { email, password, rememberMe } = req.body;

        const foundUser = await UserModel.findOne({ email });
        if (foundUser) {
            return res.status(409).json({
                status: 409,
                statusType: 'error',
                message: 'Email already exists',
            });
        }

        const hashedPassword = await HashPassword(password);
        const newUser = new UserModel({ email, password: hashedPassword });
        await newUser.save();

        const userPayloadForAccess:any = {
            userId: newUser._id,
            email: newUser.email,
        };

        const userPayloadForRefresh:any = { userId: newUser._id };

        const accessToken = await generateAccessToken(userPayloadForAccess);
        const refreshToken = await generateRefreshToken(userPayloadForRefresh);

        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
        };

        if (rememberMe) {
            cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        }

        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.cookie('accessToken', accessToken.token, cookieOptions);

        const ip = requestIp.getClientIp(req);
        const device = `${req.useragent?.browser}-${req.useragent?.os}`;

        res.cookie('storedIp', ip, { httpOnly: true });
        res.cookie('storedDevice', device, { httpOnly: true });

        return res.status(201).json({
            status: 201,
            statusType: 'success',
            message: 'User registered successfully',
        });

    } catch (err: any) {
        console.error(err);
    }
};
