import mongoose from 'mongoose';
import 'dotenv/config';

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

export default connectDB;
