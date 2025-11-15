import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

import authRoutes from './routes/auth.route.js';
import messagesRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const __dirname = path.resolve();

app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    // console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})

