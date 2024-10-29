import mongoose, { Schema, Model,Document } from "mongoose";

export interface UserItem extends Document {
    email: string;
    password: string;
    rcode: number;
    role: string;
    active: boolean;
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        rcode: {
            type: Number,
            default: 0
        },
        role: {
            type: String,
            default: "client"
        },
        dp_url: {
            type: String,
            default: "",
            optional: true
        },
        active: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
);

const UserModel: Model<UserItem> = mongoose.model<UserItem>('user', UserSchema);

export default UserModel;