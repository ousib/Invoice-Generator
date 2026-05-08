import express from "express";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Explicitly serve the OG image with correct content-type and no-cache for debugging
  app.get("/og-image.jpg", (req, res) => {
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(process.cwd(), "public", "og-image.jpg"));
  });

  // Explicitly serve ads.txt to ensure it's accessible at the root for AdSense crawl
  app.get("/ads.txt", (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(process.cwd(), "public", "ads.txt"));
  });

  // Explicitly serve robots.txt
  app.get("/robots.txt", (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(process.cwd(), "public", "robots.txt"));
  });

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
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static files first
    app.use(express.static(distPath));
    // SPA fallback: handle all other routes by serving index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
