const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>Strava Title Generator</h1><p>Web service is running!</p>');
});

app.listen(port, () => {
  console.log(`Web service listening at http://localhost:${port}`);
}); 