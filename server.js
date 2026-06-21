const express = require('express');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env
const app = express();

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Parse JSON bodies
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Mount API routes (AI tutor, news, etc.)
try {
  const apiRouter = require(path.join(__dirname, 'routes', 'api'));
  app.use('/api', apiRouter);
  console.log('Mounted API router at /api');
} catch (err) {
  console.error('Failed to mount API router:', err);
}

// Handle both /students/student-dashboard and /students/student-dashboard.html
app.get(['/students/student-dashboard', '/students/student-dashboard.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'students', 'student-dashboard.html'));
});

app.get('/students/news-feed', (req, res) => {
  res.sendFile(path.join(__dirname, 'students', 'news-feed-gemini.html'));
});

// CBT page
app.get('/students/cbt', (req, res) => {
  res.sendFile(path.join(__dirname, 'students', 'cbt-simple.html'));
});

// Serve question images
app.use('/questions', express.static(path.join(__dirname, 'public', 'questions')));

// Special handling for root to redirect to dashboard
app.get('/', (req, res) => {
  res.redirect('/students/student-dashboard');
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

// Serve static directories
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/students', express.static(path.join(__dirname, 'students')));
// Serve uploaded files
const uploadsPath = path.join(__dirname, 'uploads');
try { app.use('/uploads', express.static(uploadsPath)); } catch (e) { console.warn('Could not serve uploads directory', e.message); }

// Note: news API removed during cleanup.

// Custom 404 handler
app.use((req, res) => {
  console.log('404 for:', req.url);
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Page Not Found</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #2563eb; }
        </style>
      </head>
      <body>
        <h1>Page Not Found</h1>
        <p>The requested page could not be found.</p>
        <p><a href="/students/student-dashboard">Return to Dashboard</a></p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('- /students/student-dashboard');
  console.log('- /students/news-feed');
});

