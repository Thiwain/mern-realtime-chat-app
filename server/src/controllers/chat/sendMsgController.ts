import { Request, Response } from "express";
import { messageValidation } from "../../validation/messageValidation";
import ChatModel, { ChatItem } from "../../models/chatModel";
import { jwtDecoder } from "../../utils/jwtDecoder";

export const sendMsgController = async (req: Request, res: Response) => {
    try {
        const userObj: any | null = await jwtDecoder(req, res);
        if (!userObj || !userObj.email) {
            return res.status(401).json({
                status: 401,
                statusType: 'error',
                message: 'Failed to authenticate user',
            });
        }

        const { error } = messageValidation.validate({
            sentBy: userObj.email,
            message: req.body.message,
        });

        if (error) {
            return res.status(400).json({
                status: 400,
                statusType: 'error',
                message: error.message,
            });
        }

        const newChat = new ChatModel({
            sentBy: userObj.email,
            message: req.body.message,
        });

        await newChat.save();

        return res.status(201).json({
            status: 201,
            statusType: 'success',
            message: 'Text sent successfully',
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            statusType: 'error',
            message: 'Internal server error',
        });
    }
};
