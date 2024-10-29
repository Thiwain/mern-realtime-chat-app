import express, { Router } from 'express';
import {sendMsgController} from "../controllers/chat/sendMsgController";

const MessageRoutes: Router = express();

MessageRoutes.post('/send', sendMsgController);

export default MessageRoutes;
