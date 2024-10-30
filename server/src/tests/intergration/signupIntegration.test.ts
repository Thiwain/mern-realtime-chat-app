// @ts-ignore
import request from "supertest";
import { app } from "../../index";
import UserModel from "../../models/userModel";
import { HashPassword } from "../../utils/passwordUtils";

const postSignUp = async (reqBody: object, expectedStatus: number) => {
    return request(app)
        .post('/api/v1/auth/signup')
        .send(reqBody)
        .expect(expectedStatus);
};

describe("SignUp Integration tests", () => {

    beforeAll(async () => {
        const password = "interTestPw#123";
        const hashedPassword = await HashPassword(password);
        try {
            await new UserModel({ email: 'existingUser@example.com', password: hashedPassword }).save();
        } catch (err) {
            console.error(err);
        }
    });

    test("should sign up successfully", async () => {
        const reqBody = {
            email: "newUser@example.com",
            password: "ValidPw#123",
            rememberMe: true,
        };
        const response = await postSignUp(reqBody, 201);

        expect(response.body).toMatchObject({
            status: 201,
            statusType: "success",
            message: "User registered successfully",
        });

        const setCookies = response.headers['set-cookie'];
        expect(setCookies).toBeDefined();
    });

    test("should fail when email is already registered", async () => {
        const reqBody = {
            email: "existingUser@example.com",
            password: "ValidPw#123",
            rememberMe: true,
        };
        const response = await postSignUp(reqBody, 409);

        expect(response.body).toMatchObject({
            status: 409,
            statusType: "error",
            message: "Email already exists",
        });
    });

    test("should fail when invalid email is provided", async () => {
        const reqBody = {
            email: "invalidEmail",
            password: "ValidPw#123",
            rememberMe: true,
        };
        const response = await postSignUp(reqBody, 400);

        expect(response.body).toMatchObject({
            status: 400,
            statusType: "error",
            message: expect.any(String), // Expecting a validation message
        });
    });

    test("should fail when password does not meet criteria", async () => {
        const reqBody = {
            email: "newUser2@example.com",
            password: "short",
            rememberMe: true,
        };
        const response = await postSignUp(reqBody, 400);

        expect(response.body).toMatchObject({
            status: 400,
            statusType: "error",
            message: "Password must be at least 8 characters long", // Adjust to match validation
        });
    });

    afterAll(async () => {
        try {
            await UserModel.deleteMany({ email: { $in: ["newUser@example.com", "existingUser@example.com"] } });
        } catch (error) {
            console.error(error);
        }
    });
});
