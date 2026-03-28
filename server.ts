import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  app.get("/api/assets", async (req, res) => {
    const fs = await import('fs/promises');
    const path = 'generated_assets.json';
    try {
      const data = await fs.readFile(path, 'utf-8');
      res.json(JSON.parse(data));
    } catch (e) {
      res.json({});
    }
  });

  app.post("/api/save-assets", async (req, res) => {
    const { logoUrl, faviconUrl, logoSvg, faviconSvg } = req.body;
    const fs = await import('fs/promises');
    const path = 'generated_assets.json';
    
    let currentAssets = {};
    try {
      const data = await fs.readFile(path, 'utf-8');
      currentAssets = JSON.parse(data);
    } catch (e) {
      // File doesn't exist yet
    }
    
    const updatedAssets = {
      ...currentAssets,
      ...(logoUrl ? { logoUrl } : {}),
      ...(faviconUrl ? { faviconUrl } : {}),
      ...(logoSvg ? { logoSvg } : {}),
      ...(faviconSvg ? { faviconSvg } : {})
    };
    
    await fs.writeFile(path, JSON.stringify(updatedAssets, null, 2));
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
