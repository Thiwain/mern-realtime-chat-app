import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ChatItem extends Document {
    sentBy: string;
    message: string;
}

const chatSchema: Schema = new Schema(
    {
        sentBy: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        createdAt: { type: Date, default: Date.now }
    }
);

const ChatModel: Model<ChatItem> = mongoose.model<ChatItem>('Chat', chatSchema);

export default ChatModel;
