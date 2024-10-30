// @ts-ignore
import request from 'supertest';
import { app } from '../../index';
import ChatModel from '../../models/chatModel';
import { jwtDecoder } from "../../utils/jwtDecoder";

/*
* !...Should Remove Authentication Middleware to run the test...!
*/

jest.mock('../../utils/jwtDecoder');

describe.skip("sendMsgController Integration Tests", () => {
    const testUser = { email: "testuser@example.com" };
    const testMessage = "Hello, this is a test message";

    beforeEach(async () => {
        (jwtDecoder as jest.Mock).mockResolvedValue(testUser);
    });

    afterEach(async () => {
        jest.clearAllMocks();
        await ChatModel.deleteMany({ sentBy: testUser.email });
    });

    it("should send a message successfully when authenticated and input is valid", async () => {
        const response = await request(app)
            .post('/api/v1/chat/send')
            .send({ message: testMessage })
            .set('Authorization', 'Bearer fake-valid-token')
            .expect(201);

        expect(response.body).toMatchObject({
            status: 201,
            statusType: 'success',
            message: 'Text sent successfully',
        });

        const savedMessage = await ChatModel.findOne({ sentBy: testUser.email });
        expect(savedMessage).not.toBeNull();
        expect(savedMessage?.message).toBe(testMessage);
    });

    it("should return 401 if user is not authenticated", async () => {
        (jwtDecoder as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .post('/api/v1/chat/send')
            .send({ message: testMessage })
            .expect(401);

        expect(response.body).toMatchObject({
            status: 401,
            statusType: 'error',
            message: 'Failed to authenticate user',
        });
    });

    it("should return 400 if message validation fails", async () => {
        const response = await request(app)
            .post('/api/v1/chat/send')
            .send({ message: "" })
            .set('Authorization', 'Bearer fake-valid-token')
            .expect(400);

        expect(response.body).toMatchObject({
            status: 400,
            statusType: 'error',
            message: expect.any(String)
        });
    });

    it("should return 500 if an internal error occurs", async () => {
        jest.spyOn(ChatModel.prototype, 'save').mockImplementationOnce(() => {
            throw new Error("Database save error");
        });

        const response = await request(app)
            .post('/api/v1/chat/send')
            .send({ message: testMessage })
            .set('Authorization', 'Bearer fake-valid-token')
            .expect(500);

        expect(response.body).toMatchObject({
            status: 500,
            statusType: 'error',
            message: 'Internal server error',
        });
    });
});
