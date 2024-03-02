import express, { Request, Response } from 'express';
import path from 'path';

const app = express();



app.use(express.static(path.join(__dirname, '../frontend-dist')));

// For any other requests, serve the React frontend
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-dist', "index.html"));
  });

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

export default app
