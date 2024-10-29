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

describe.skip("Login Integration tests",()=>{

    beforeAll(async () => {
        let password="interTestPw#123"
        const hashedPassword = await HashPassword(password);
        try {
           await new UserModel({ email:'testEmail1@example.com', password: hashedPassword }).save();
        }catch(err) {
            console.error(err);
        }
    })

    test('should log in successfully', async () => {
        const { email, password } = {
            email: 'testEmail1@example.com',
            password: 'interTestPw#123',
        };
        const response = await postLogin({email: email, password: password,}, 200);
        expect(response.body).toMatchObject({
            statusType: "success",
            message: "Login successful",
        });
    });

    test('should fail when invalid Email', async () => {
        const { email, password } = {
            email: 'testEmail1example.com',
            password: 'interTestPw#123',
        };
        const response = await postLogin({email: email, password: password,}, 400);
        expect(response.body).toMatchObject({
            "status": 400,
            "statusType": "error",
            "message": "Invalid email address"
        })
    });

    test('should fail when invalid password', async () => {
        const { email, password } = {
            email: 'testEmail1@example.com',
            password: '0',
        };
        const response = await postLogin({email: email, password: password,}, 400);
        expect(response.body).toMatchObject({
            "statusType": "error",
            "message": "Password must be at least 8 characters long"
        })
    });

    test('should fail when user does not exist', async () => {
        const { email, password } = {
            email: 'testEmail2@example.com',
            password: '123#Password',
        };
        const response = await postLogin({email: email, password: password,}, 401);
        expect(response.body).toMatchObject({
            statusType: 'error',
            message: 'Invalid email or password',
        })
    });

    afterAll(async () => {
        try {
            await UserModel.deleteOne({ email: 'testEmail1@example.com' });
        }catch (error){
            console.error(error);
        }
    })

});
