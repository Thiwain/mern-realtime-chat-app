import express, { Router } from 'express';
import {sendMsgController} from "../controllers/chat/sendMsgController";

const AuthRoutes: Router = express();

AuthRoutes.post('/send', sendMsgController);

export default AuthRoutes;
