import express, { Router } from 'express';
import {loginController} from "../controllers/loginController";

const AuthRoutes: Router = express();

AuthRoutes.post('/login', loginController);

export default AuthRoutes;
