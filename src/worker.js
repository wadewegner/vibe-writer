const express = require('express');
require('dotenv').config();

const webhookRoutes = require('./routes/webhookRoutes');

const app = express();
const port = process.env.WORKER_PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount webhook router
app.use('/webhook', webhookRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Strava Title Generator</h1><p>Worker service is running!</p>');
});

app.listen(port, () => {
  console.log(`Worker service listening at http://localhost:${port}`);
}); 