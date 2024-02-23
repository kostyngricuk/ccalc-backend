import express, { Express, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import AuthRoute from './routes/AuthRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import { notFound, errorHandler } from './middlewares/ErrorMiddleware';

dotenv.config();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5000;

const app: Express = express();

connectDB();

const corsOptions: CorsOptions = {
  origin: `http://localhost:3000`
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Auth routes
app.use("/api/auth", AuthRoute);

// Default route
app.use("/api", ProtectedRoute);

// Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://${host}:${port}`);
});