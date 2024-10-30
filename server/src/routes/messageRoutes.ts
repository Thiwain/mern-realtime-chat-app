import express, { Router } from 'express';
import {sendMsgController} from "../controllers/chat/sendMsgController";
import {loadMsgController} from "../controllers/chat/loadMsgController";

const MessageRoutes: Router = express();

MessageRoutes.post('/send', sendMsgController);
MessageRoutes.get('/load', loadMsgController);

export default MessageRoutes;
