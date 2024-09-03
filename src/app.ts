import { IndexRouter } from './routes/Index.router';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';

configDotenv();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(IndexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server open on http://localhost:${PORT}`);
});
