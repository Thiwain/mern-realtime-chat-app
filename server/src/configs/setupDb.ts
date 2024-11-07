import mongoose from 'mongoose';
import 'dotenv/config';
import UserModel from "../models/userModel";
import ChatModel from "../models/chatModel";

const mongoURI = process.env.MONGO_CON || '';
export let mongoDbCon: any;

const connectDB = async () => {
    try {
        mongoDbCon = await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Clear Data for demo deployment
const clearDb=async () => {
    try {
        await ChatModel.deleteMany({});
        console.log('Db cleared successfully');
    }catch(err) {
        console.error(err);
    }
}
// Clear Data for demo deployment

setInterval(async () => {await clearDb()},7*60*1000);

export default connectDB;
