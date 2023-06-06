import fs from 'fs/promises';
import path, { resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import express from 'express';
import serveStatic from 'serve-static';
import type { Request, Response, NextFunction } from 'express';

const isTest = process.env.NODE_ENV === 'test';

async function getAllStyles() {
  try {
    const assetPath = path.resolve(__dirname, 'dist/assets');
    const files = await fs.readdir(assetPath);
    const cssAssets = files.filter((file) => file.endsWith('.css'));
    const allContent: string[] = [];

    for (const assets of cssAssets) {
      const content = await fs.readFile(path.join(assetPath, assets), 'utf-8');
      allContent.push(`<style type="text/css">${content}</style>`);
    }

    return allContent.join('\n');
  } catch {
    return '';
  }
}

export async function createServer(isProd = process.env.NODE_ENV === 'prod') {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'info',
  });

  app.use(vite.middlewares);
  const requestHandler = express.static(resolve('assets'));
  app.use(requestHandler);
  app.use('/assets', requestHandler);

  if (isProd) {
    app.use(
      serveStatic('dist/client', {
        index: false,
      })
    );
  }

  const stylesheets = getAllStyles();

  app.use('*', async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      let template = await fs.readFile(
        isProd ? resolve('dist/client/index') : resolve('index.html'),
        'utf-8'
      );
      // vite html transform
      template = await vite.transformIndexHtml(url, template);

      // load server entry
      let productionBuildPath = path.join(
        __dirname,
        './dist/server/entry-server.mjs'
      );
      let devBuildPath = path.join(__dirname, './src/client/entry-server.tsx');
      const { render } = await vite.ssrLoadModule(
        isProd ? productionBuildPath : devBuildPath
      );

      // render the app html
      const appHtml = await render(url);
      const cssAssets = isProd ? '' : await stylesheets;

      const html = template
        .replace('<!--app-html-->', appHtml)
        .replace('<!--head-->', cssAssets);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);

      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`App started listening on http://localhost:${port}`);
  });
}

createServer();
