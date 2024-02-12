import express, { Express, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

const corsOptions: CorsOptions = {
  origin: `http://${host}:${port}`
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://${host}:${port}`);
});