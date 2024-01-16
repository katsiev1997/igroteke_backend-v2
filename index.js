import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import reserveRouter from './routes/reserveRoute.js';
import clubRouter from './routes/clubRoute.js';

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:4173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use('/api', authRoute);
app.use('/api', clubRouter);
app.use('/api', reserveRouter);

mongoose
  .connect(process.env.DB_URL)
  .then(console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));

app.listen(port, () => console.log('Server started on port: ', port));
