import { authSession } from './middleware/authSession';
import { pageNotFound } from './middleware/pageNotFound';
import { serverError } from './middleware/serverError';
import { IndexRouter } from './routes/Index.router';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';

configDotenv();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authSession());

app.use(IndexRouter);

app.use(pageNotFound);
app.use(serverError);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server open on http://localhost:${PORT}`);
});
