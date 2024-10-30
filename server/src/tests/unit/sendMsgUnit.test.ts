import { Request, Response } from "express";
import { sendMsgController } from "../../controllers/chat/sendMsgController";
import ChatModel from "../../models/chatModel";
import { jwtDecoder } from "../../utils/jwtDecoder";
import { messageValidation } from "../../validation/messageValidation";

jest.mock("../../models/chatModel");
jest.mock("../../utils/jwtDecoder");
jest.mock("../../validation/messageValidation");

describe.skip("sendMsgController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                message: "Hello, this is a test message",
            },
            cookies: { accessToken: "test-token" }
        };

        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        res = {
            status: statusMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should send message successfully when authenticated and valid input", async () => {
        (jwtDecoder as jest.Mock).mockResolvedValue({ email: "test@example.com" });

        (messageValidation.validate as jest.Mock).mockReturnValue({ error: null });

        (ChatModel.prototype.save as jest.Mock).mockResolvedValue({});

        await sendMsgController(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 201,
            statusType: 'success',
            message: 'Text sent successfully',
        });
    });

    it("should return 401 if user is not authenticated", async () => {
        (jwtDecoder as jest.Mock).mockResolvedValue(null);

        await sendMsgController(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 401,
            statusType: 'error',
            message: 'Failed to authenticate user',
        });
    });

    it("should return 400 if message validation fails", async () => {
        (jwtDecoder as jest.Mock).mockResolvedValue({ email: "test@example.com" });

        const validationError = { message: "Invalid message content" };
        (messageValidation.validate as jest.Mock).mockReturnValue({ error: validationError });

        await sendMsgController(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 400,
            statusType: 'error',
            message: validationError.message,
        });
    });

    it("should return 500 if an unexpected error occurs", async () => {
        (jwtDecoder as jest.Mock).mockResolvedValue({ email: "test@example.com" });

        (messageValidation.validate as jest.Mock).mockReturnValue({ error: null });

        (ChatModel.prototype.save as jest.Mock).mockRejectedValue(new Error("Database save error"));

        await sendMsgController(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 500,
            statusType: 'error',
            message: 'Internal server error',
        });
    });
});
