import express from 'express';
import cors from 'cors';
import path from 'path';

let appPromise: Promise<express.Express> | null = null;

async function getApp(): Promise<express.Express> {
  if (appPromise) return appPromise;

  appPromise = (async () => {
    const app = express();

    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Serve static assets from server/assets directory
    const assetsPath = path.resolve(process.cwd(), 'server/assets');
    app.use('/assets', express.static(assetsPath));

    // Dynamically import ESM router
    const { default: apiRouter } = await import('../server/src/routes/api.js');
    app.use('/api', apiRouter);

    // Root health check
    app.get('/api/health', (_req, res) => {
      res.json({ status: 'ok', service: 'FocusRealm Presentation Studio Backend (Serverless ESM)' });
    });

    return app;
  })();

  return appPromise;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (err: any) {
    console.error('Fatal Serverless Handler Error:', err);
    res.status(500).json({ error: 'Serverless invocation error', details: err?.message || String(err) });
  }
}

