const express = require('express');
const router = express.Router();
const path = require('path');

// Dashboard route
router.get('/student-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'students', 'student-dashboard.html'));
});

// News feed route
router.get('/news-feed', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'students', 'news-feed-gemini.html'));
});

// Generic route handler for other student pages
router.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, '..', 'students', page + (page.endsWith('.html') ? '' : '.html'));
  res.sendFile(filePath, err => {
    if (err) next();
  });
});

module.exports = router;

