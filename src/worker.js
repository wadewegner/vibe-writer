const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.WORKER_PORT || 4000;

app.get('/', (req, res) => {
  res.send('<h1>Strava Title Generator</h1><p>Worker service is running!</p>');
});

app.listen(port, () => {
  console.log(`Worker service listening at http://localhost:${port}`);
}); 