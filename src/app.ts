import { pageNotFound } from './errors/pageNotFound';
import { serverError } from './errors/serverError';
import { authSession } from './middleware/authSession';
import { IndexRouter } from './routes/Index.router';
import cors from 'cors';
import express from 'express';

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authSession);

// Base router
app.use(IndexRouter);

// Error handling
app.use(pageNotFound);
app.use(serverError);

export { app };
