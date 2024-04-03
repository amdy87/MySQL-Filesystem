/**
 * express routes file in backedn
 * @fileoverview
 */

import express from 'express';
import path from 'path';

import userRoute from './routes/user';
import directoryRoute from './routes/directory';
import permissionRoute from './routes/permission';
import { treeRouter } from './routes/tree';
import { fileRouter } from './routes/file';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend-dist')));

// For any other requests, serve the React frontend
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend-dist', 'index.html'));
});

app.use('/api/dir', directoryRoute);
app.use('/api/permission', permissionRoute);
app.use('/api/user', userRoute);
app.use('/api/tree', treeRouter);
app.use('/api/file', fileRouter);

export default app;
