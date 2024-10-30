import express, { Router } from 'express';
import { loadMsgController } from "../controllers/chat/loadMsgController";
import ChatModel from "../models/chatModel";
import WebSocket, { } from 'ws';

const MessageRoutes: Router = express.Router();

export const setupMessageRoutes = (wss: WebSocket.Server) => {

    MessageRoutes.get('/load', loadMsgController);

    MessageRoutes.post('/send', async (req, res) => {
        const { sentBy, message } = req.body;
        try {
            const newMessage = new ChatModel({ sentBy, message });
            await newMessage.save();

            const responseMessage = JSON.stringify(newMessage);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(responseMessage);
                }
            });

            res.status(201).json({ status: 201, message: newMessage });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: 'Error sending message.' });
        }
    });

    return MessageRoutes;
};

export default MessageRoutes;
