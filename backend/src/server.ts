import express, { Request, Response } from 'express';
import path from 'path';

import userRoutes from './routes/user';

const app = express();
const appRoutes = express.Router();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend-dist')));

// For any other requests, serve the React frontend
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-dist', "index.html"));
  });


// API endpoints
appRoutes.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});
appRoutes.use("/user", userRoutes);

app.use("/api", appRoutes);

export default app
