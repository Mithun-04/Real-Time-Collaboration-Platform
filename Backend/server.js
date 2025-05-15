import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;


// connect db

try {
    await mongoose.connect(MONGO_URL, {});
    console.log("MongoDB connected");
}
catch (error) {
    console.log("MongoDB connection error: ", error);
}

app.listen(PORT, () => {  
    console.log(`Server is running on port ${PORT}`);
});

//routes

app.use('/api/auth', authRoutes);