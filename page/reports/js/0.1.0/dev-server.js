import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3122;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    component: 'reportsView',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Config API endpoint
app.get('/api/config', (req, res) => {
  try {
    const configPath = path.join(__dirname, 'config', 'config.json');
    if (require('fs').existsSync(configPath)) {
      const config = JSON.parse(require('fs').readFileSync(configPath, 'utf8'));
      res.json(config);
    } else {
      res.json({ 
        name: 'reportsView',
        version: '0.1.0',
        status: 'active'
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Config load failed' });
  }
});

// Serve component files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'standalone.html'));
});

app.get('/component.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.js'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 ${componentName} dev server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`⚙️ Config API: http://localhost:${PORT}/api/config`);
});

export default app;
