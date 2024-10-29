import {HashPassword} from "../../utils/passwordUtils";
import UserModel, {UserItem} from "../../models/userModel";
import request from "supertest";
import {app} from "../../index";

const postLogin = async (reqBody: object, expectedStatus: number) => {
    return request(app)
        .post('/api/v1/auth/login')
        .send(reqBody)
        .expect(expectedStatus);
}

describe("Login Integration tests",()=>{

    beforeAll(async () => {
        let password="interTestPw#123"
        const hashedPassword = await HashPassword(password);
        try {
            new UserModel({ email:'testEmail1@example.com', password: hashedPassword }).save();
        }catch(err) {
            console.error(err);
        }
    })

    test('should log in successfully', async () => {
        const { email, password } = {
            email: 'testEmail1@example.com',
            password: 'interTestPw#123',
        };
        const reqBody = {
            email: email,
            password: password,
        };
        const response = await postLogin(reqBody, 200);
        expect(response.body).toMatchObject({
            statusType: "success",
            message: "Login successful",
        });
        expect(response.status).toBe(200);
    });

    afterAll(async () => {
        try {
            await UserModel.deleteOne({ email: 'testEmail1@example.com' });
        }catch (error){
            console.error(error);
        }
    })

});
