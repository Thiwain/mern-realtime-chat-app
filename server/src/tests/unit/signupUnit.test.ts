import { signUpController } from "../../controllers/auth/signupController";
import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/userModel";
import { signupValidation } from "../../validation/signupValidation";
import { HashPassword } from "../../utils/passwordUtils";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwtUtils";
import requestIp from 'request-ip';

jest.mock("../../models/userModel");
jest.mock("../../validation/signupValidation");
jest.mock("../../utils/passwordUtils");
jest.mock("../../utils/jwtUtils");
jest.mock('request-ip');

describe.skip("signUpController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {
                email: "test@example.com",
                password: "password123",
                rememberMe: true,
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };

        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if validation fails", async () => {
        (signupValidation.validate as jest.Mock).mockReturnValueOnce({
            error: { message: "Validation error" },
        });

        await signUpController(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 400,
            statusType: "error",
            message: "Validation error",
        });
    });

    it("should return 409 if email already exists", async () => {
        (signupValidation.validate as jest.Mock).mockReturnValueOnce({ error: null });
        (UserModel.findOne as jest.Mock).mockResolvedValueOnce(true);

        await signUpController(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            status: 409,
            statusType: "error",
            message: "Email already exists",
        });
    });

    it("should create a new user and return 201 with access and refresh tokens", async () => {
        (signupValidation.validate as jest.Mock).mockReturnValueOnce({ error: null });
        (UserModel.findOne as jest.Mock).mockResolvedValueOnce(null);
        (HashPassword as jest.Mock).mockResolvedValueOnce("hashedPassword123");
        (UserModel.prototype.save as jest.Mock).mockResolvedValueOnce({});
        (generateAccessToken as jest.Mock).mockResolvedValueOnce({ token: "accessToken123" });
        (generateRefreshToken as jest.Mock).mockResolvedValueOnce("refreshToken123");
        (requestIp.getClientIp as jest.Mock).mockReturnValueOnce("127.0.0.1");

        await signUpController(req as Request, res as Response, next);

        expect(UserModel.prototype.save).toHaveBeenCalled();
        expect(res.cookie).toHaveBeenCalledWith("refreshToken", "refreshToken123", expect.any(Object));
        expect(res.cookie).toHaveBeenCalledWith("accessToken", "accessToken123", expect.any(Object));
        expect(res.cookie).toHaveBeenCalledWith("storedIp", "127.0.0.1", { httpOnly: true });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 201,
            statusType: "success",
            message: "User registered successfully",
        });
    });

    it("should handle errors and call next with the error", async () => {
        const error = new Error("Database error");
        (signupValidation.validate as jest.Mock).mockReturnValueOnce({ error: null });
        (UserModel.findOne as jest.Mock).mockRejectedValueOnce(error);

        await signUpController(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
