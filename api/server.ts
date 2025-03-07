import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import cors  from "cors"
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use( cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}))
app.use('/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

mongoose.connect(process.env.MONGO_URI!).then(() => {
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});