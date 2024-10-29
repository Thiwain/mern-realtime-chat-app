import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';

import connectDB, { mongoDbCon } from './configs/setupDb';
import AuthRoutes from "./routes/authRoutes";
import {authLimiter} from "./middlewares/authLimiter";

dotenv.config();

connectDB();

export const app = express();

const PORT = process.env.PORT || 3000;
let CLIENT_HOST: string | any = process.env.CLIENT_HOST;
const corsOptions = {
    origin: CLIENT_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};


app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(useragent.express());

app.options('*', cors(corsOptions));

// Routes
app.use('/api/v1/auth/', authLimiter, AuthRoutes);
// Routes

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

function gracefulShutdown() {
    console.log("Shutting down");
    server.close(async () => {
        console.log("HTTP server closed.");
        try {
            await mongoDbCon.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        } catch (error) {
            console.error('Error during graceful shutdown:', error);
            process.exit(1);
        }
    });
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
