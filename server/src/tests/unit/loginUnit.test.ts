import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/userModel";
// @ts-ignore
import bcrypt from 'bcrypt';
// @ts-ignore
import requestIp from 'request-ip';
import {loginController} from "../../controllers/auth/loginController";
import {generateAccessToken, generateRefreshToken} from "../../utils/jwtUtils";

jest.mock("../../models/userModel");
jest.mock("../../utils/jwtUtils");
jest.mock("bcrypt");
jest.mock("request-ip");

describe("loginController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction = jest.fn();

    beforeEach(() => {
        req = {
            body: {
                email: "test@example.com",
                password: "password123",
                rememberMe: true
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };
    });

    it("should return 400 if validation fails", async () => {
        req.body = {};

        await loginController(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 400,
            statusType: 'error',
            message: expect.any(String)
        });
    });

    it("should return 401 if user is not found", async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);

        await loginController(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            statusType: 'error',
            message: "Invalid email or password"
        });
    });

    it("should return 401 if password does not match", async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue({ password: "hashedPassword" });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await loginController(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            statusType: 'error',
            message: "Invalid email or password"
        });
    });

    it("should return 403 if account is deactivated", async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue({ password: "hashedPassword", active: false });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        await loginController(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            status: 403,
            statusType: 'error',
            message: "Account is deactivated"
        });
    });

    it("should set cookies and return 200 on successful login", async () => {
        const mockUser = { _id: "userId", email: "test@example.com", password: "hashedPassword", active: true };
        const mockAccessToken = { token: "accessToken" };
        const mockRefreshToken = "refreshToken";

        (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (generateAccessToken as jest.Mock).mockResolvedValue(mockAccessToken);
        (generateRefreshToken as jest.Mock).mockResolvedValue(mockRefreshToken);
        (requestIp.getClientIp as jest.Mock).mockReturnValue("127.0.0.1");

        await loginController(req as Request, res as Response, next);

        expect(res.cookie).toHaveBeenCalledWith("rememberMe", true, expect.any(Object));
        expect(res.cookie).toHaveBeenCalledWith("refreshToken", mockRefreshToken, expect.any(Object));
        expect(res.cookie).toHaveBeenCalledWith("accessToken", mockAccessToken.token, expect.any(Object));
        expect(res.cookie).toHaveBeenCalledWith("storedIp", "127.0.0.1", { httpOnly: true });
        expect(res.cookie).toHaveBeenCalledWith("storedDevice", expect.any(String), { httpOnly: true });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            statusType: 'success',
            message: 'Login successful'
        });
    });

    it("should call next with an error if an exception occurs", async () => {
        const error = new Error("Database error");
        (UserModel.findOne as jest.Mock).mockRejectedValue(error);

        await loginController(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
