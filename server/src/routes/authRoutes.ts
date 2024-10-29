import express, { Router } from 'express';
import {loginController} from "../controllers/auth/loginController";
import {signUpController} from "../controllers/auth/signupController";

const AuthRoutes: Router = express();

AuthRoutes.post('/login', loginController);
AuthRoutes.post('/signup', signUpController);

export default AuthRoutes;
