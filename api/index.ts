import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRouter from '../server/src/routes/api.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static assets from server/assets directory
const assetsPath = path.resolve(process.cwd(), 'server/assets');
app.use('/assets', express.static(assetsPath));

// API routes mounted at /api
app.use('/api', apiRouter);

// Root health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'FocusRealm Presentation Studio Backend (Serverless)' });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
