import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static assets (images, extracted assets, screenshots)
const assetsPath = path.resolve(process.cwd(), 'assets');
app.use('/assets', express.static(assetsPath));

// API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'FocusRealm Presentation Studio Backend' });
});

app.listen(PORT, () => {
  console.log(`[FocusRealm Backend] Running on http://localhost:${PORT}`);
});
