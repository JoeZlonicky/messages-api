import { authSession } from './middleware/authSession';
import { pageNotFound } from './middleware/pageNotFound';
import { serverError } from './middleware/serverError';
import { IndexRouter } from './routes/Index.router';
import cors from 'cors';
import express from 'express';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authSession);

// Base router
app.use(IndexRouter);

// Error handling
app.use(pageNotFound);
app.use(serverError);

export { app };
