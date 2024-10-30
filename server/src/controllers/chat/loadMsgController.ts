import { Request, Response } from 'express';
import ChatModel from "../../models/chatModel";

export const loadMsgController = async (req: Request, res: Response) => {
    try {
        const messages = await ChatModel.find()
            .sort({ createdAt: -1 })
            .limit(15);

        const sortedMessages = messages.reverse();

        res.status(200).json({
            status: 200,
            messages: sortedMessages,
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            status: 500,
            message: 'An error occurred while retrieving messages.',
        });
    }
};
