import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import { Server as WebSocketServer } from 'ws';

import connectDB, { mongoDbCon } from './configs/setupDb';
import AuthRoutes from "./routes/authRoutes";
import { authLimiter } from "./middlewares/authLimiter";
import { setupMessageRoutes } from "./routes/messageRoutes";
import authenticate from "./middlewares/authenticate";
import { globalLimiter } from "./middlewares/globalLimiter";
import validateUserController from "./controllers/auth/validateUserController";
import { logoutController } from "./controllers/auth/logoutController";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_HOST = process.env.CLIENT_HOST || 'http://localhost:5173';

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

app.use('/api/v1/auth/', authLimiter, AuthRoutes);

const wss = new WebSocketServer({ noServer: true });
const MessageRoutes = setupMessageRoutes(wss);
app.use('/api/v1/chat/', globalLimiter, authenticate, MessageRoutes);

app.get('/api/v1/validate', globalLimiter, validateUserController);
app.post('/api/v1/logout', logoutController);

connectDB();

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

function gracefulShutdown() {
    console.log("Shutting down server...");
    server.close(async () => {
        console.log("HTTP server closed.");
        wss.clients.forEach((client) => client.close());

        try {
            await mongoDbCon.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        } catch (error) {
            console.error('Error during shutdown:', error);
            process.exit(1);
        }
    });
}

// Shutdown handlers
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
