const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Dashboard route - explicitly defined before static middleware
app.get('/students/student-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'students', 'student-dashboard.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

