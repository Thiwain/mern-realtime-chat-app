import { Request, Response, CookieOptions } from "express";
import {messageValidation} from "../../validation/messageValidation";
import ChatModel, {ChatItem} from "../../models/chatModel";

export const sendMsgController = async (req:Request,res:Response)=>{

    try {
        const {error}=messageValidation.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                statusType: 'error',
                message: error.message
            });
        }

        await new ChatModel({
            sentBy:req.body?.email,
            message:req.body.message,
        }).save() as ChatItem;

        res.status(201).json({
            status: res.statusCode,
            statusType: 'success',
            message: 'Text sent successfully',
        });

    }catch(err){
        console.log(err);
    }
}