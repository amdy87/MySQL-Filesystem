import express from 'express';
import path from 'path';

import userRoutes from './routes/user';
import directoryRoutes from "./routes/directory";
import permissionRoutes from "./routes/permission";
import { apiRoutes } from './routes/api';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend-dist')));

// For any other requests, serve the React frontend
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-dist', "index.html"));
});

app.use("/api/dir", directoryRoutes);
app.use("/api/permission", permissionRoutes);
app.use("/api/user", userRoutes);
app.use("/api", apiRoutes);

export default app
