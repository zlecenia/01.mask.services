#!/usr/bin/env node
/**
 * Development Server for serviceMenu Component
 * Standalone server for individual component testing
 */

import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3023;

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files
app.use(express.static(__dirname));
app.use('/node_modules', express.static(path.join(__dirname, '../../../../node_modules')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    component: 'serviceMenu',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Component API endpoints
app.get('/api/config', (req, res) => {
  try {
    const configPath = path.join(__dirname, 'config/config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      res.json(config);
    } else {
      res.json({ component: { name: 'serviceMenu' }, settings: {} });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Default route - serve standalone.html
app.get('/', (req, res) => {
  const standaloneFile = path.join(__dirname, 'standalone.html');
  if (fs.existsSync(standaloneFile)) {
    res.sendFile(standaloneFile);
  } else {
    res.send(`
      <html>
        <head><title>serviceMenu - Dev Server</title></head>
        <body>
          <h1>serviceMenu Development Server</h1>
          <p>Port: 3023</p>
          <p>standalone.html not found - please generate it first</p>
          <a href="/health">Health Check</a>
        </body>
      </html>
    `);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 serviceMenu dev server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`⚙️ Config API: http://localhost:${PORT}/api/config`);
});

export default app;
