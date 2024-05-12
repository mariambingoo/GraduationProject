// app.js
const express = require('express');
const bodyParser = require('body-parser');
const traindingDataRouter = require('./routes/trainingData');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/trainingData', traindingDataRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
